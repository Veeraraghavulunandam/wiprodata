using HotelBookingBackend.Data;
using HotelBookingBackend.Models;
using HotelBookingBackend.DTOs;
using HotelBookingBackend.Utils;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingBackend.Services
{
    public class BookingService
    {
        private readonly HotelBookingDbContext _db;

        public BookingService(HotelBookingDbContext db)
        {
            _db = db;
        }

        // -----------------------------
        // Book a room
        // -----------------------------
        public async Task<ApiResponse> BookRoom(int userId, BookingDto dto)
        {
            // 1️⃣ Validate dates
            if (dto.CheckOutDate <= dto.CheckInDate)
                return new ApiResponse { Success = false, Message = "Check-out date must be after check-in date" };

            // 2️⃣ Find room
            var room = await _db.Rooms
                .Include(r => r.Hotels)
                .FirstOrDefaultAsync(r => r.Id == dto.RoomId);

            if (room == null)
                return new ApiResponse { Success = false, Message = "Room not found" };

            // 3️⃣ Check overlapping bookings
            bool isBooked = await _db.Bookings.AnyAsync(b =>
                b.RoomId == dto.RoomId &&
                b.Status != "Cancelled" &&
                ((dto.CheckInDate >= b.CheckInDate && dto.CheckInDate < b.CheckOutDate) ||
                 (dto.CheckOutDate > b.CheckInDate && dto.CheckOutDate <= b.CheckOutDate) ||
                 (dto.CheckInDate <= b.CheckInDate && dto.CheckOutDate >= b.CheckOutDate))
            );

            if (isBooked)
                return new ApiResponse { Success = false, Message = "Room is already booked for these dates" };

            // 4️⃣ Calculate total price
            var days = (dto.CheckOutDate - dto.CheckInDate).Days;
            if (days <= 0) days = 1;
            var totalPrice = room.Price * days;

            // 5️⃣ Create booking
            var booking = new Bookings
            {
                UserId = userId,
                RoomId = room.Id,
                CheckInDate = dto.CheckInDate,
                CheckOutDate = dto.CheckOutDate,
                TotalPrice = totalPrice,
                Status = "Pending",
                CreatedAt = DateTime.Now
            };

            _db.Bookings.Add(booking);
            await _db.SaveChangesAsync();

            // 6️⃣ Prepare dynamic response
            var bookingResponse = new
            {
                booking.Id,
                booking.UserId,
                Users = booking.Users,
                RoomId = room.Id,
                Rooms = new
                {
                    room.Id,
                    room.HotelId,
                    Hotels = room.Hotels,
                    room.RoomNumber,
                    room.Type,
                    room.Price,
                    room.IsAvailable
                },
                booking.CheckInDate,
                booking.CheckOutDate,
                booking.TotalPrice,
                booking.Status,
                booking.CreatedAt
            };

            return new ApiResponse
            {
                Success = true,
                Message = "Room booked successfully",
                Data = bookingResponse
            };
        }

        // -----------------------------
        // Get all bookings by user
        // -----------------------------
        public async Task<ApiResponse> GetBookingsByUser(int userId)
        {
            var bookings = await _db.Bookings
                .Include(b => b.Rooms)
                    .ThenInclude(r => r.Hotels)
                .Include(b => b.Users)
                .Where(b => b.UserId == userId)
                .ToListAsync();

            return new ApiResponse { Success = true, Message = "Bookings fetched successfully", Data = bookings };
        }

        // -----------------------------
        // Cancel a booking
        // -----------------------------
        public async Task<ApiResponse> CancelBooking(int bookingId)
        {
            var booking = await _db.Bookings
                .Include(b => b.Rooms)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null)
                return new ApiResponse { Success = false, Message = "Booking not found" };

            booking.Status = "Cancelled";
            await _db.SaveChangesAsync();

            return new ApiResponse { Success = true, Message = "Booking cancelled successfully" };
        }
    }
}
