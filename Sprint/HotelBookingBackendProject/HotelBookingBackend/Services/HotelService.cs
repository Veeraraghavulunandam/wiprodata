using HotelBookingBackend.Data;
using HotelBookingBackend.Models;
using HotelBookingBackend.Utils;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingBackend.Services
{
    public class HotelService
    {
        private readonly HotelBookingDbContext _db;
        public HotelService(HotelBookingDbContext db) => _db = db;

        // -----------------------------
        // Get all hotels
        // -----------------------------
        public async Task<ApiResponse> GetAllHotels()
        {
            var hotels = await _db.Hotels.ToListAsync();
            return new ApiResponse { Success = true, Message = "Hotels fetched", Data = hotels };
        }

        // -----------------------------
        // Get hotel by Id
        // -----------------------------
        public async Task<ApiResponse> GetHotelById(int id)
        {
            var hotel = await _db.Hotels.FindAsync(id);
            if (hotel == null)
                return new ApiResponse { Success = false, Message = "Hotel not found" };
            return new ApiResponse { Success = true, Message = "Hotel fetched", Data = hotel };
        }

        // -----------------------------
        // Add a new hotel (Admin only)
        // -----------------------------
        public async Task<ApiResponse> AddHotel(Hotels hotel)
        {
            _db.Hotels.Add(hotel);
            await _db.SaveChangesAsync();
            return new ApiResponse { Success = true, Message = "Hotel added", Data = hotel };
        }

        // -----------------------------
        // Update hotel (Admin only)
        // -----------------------------
        public async Task<ApiResponse> UpdateHotel(Hotels hotel)
        {
            var existing = await _db.Hotels.FindAsync(hotel.Id);
            if (existing == null)
                return new ApiResponse { Success = false, Message = "Hotel not found" };

            existing.Name = hotel.Name;
            existing.Address = hotel.Address;
            existing.City = hotel.City;
            existing.Country = hotel.Country;

            await _db.SaveChangesAsync();
            return new ApiResponse { Success = true, Message = "Hotel updated", Data = existing };
        }

        // -----------------------------
        // Delete hotel (Admin only)
        // -----------------------------
        public async Task<ApiResponse> DeleteHotel(int id)
        {
            var hotel = await _db.Hotels.FindAsync(id);
            if (hotel == null)
                return new ApiResponse { Success = false, Message = "Hotel not found" };

            _db.Hotels.Remove(hotel);
            await _db.SaveChangesAsync();
            return new ApiResponse { Success = true, Message = "Hotel deleted" };
        }

        // -----------------------------
        // Search hotels with available rooms
        // -----------------------------
        public async Task<ApiResponse> SearchHotelRooms(string hotelName, DateTime checkIn, DateTime checkOut)
        {
            var hotels = await _db.Hotels
                                  .Where(h => h.Name.Contains(hotelName))
                                  .ToListAsync();

            if (!hotels.Any())
                return new ApiResponse { Success = false, Message = "No hotels found with this name." };

            var result = new List<object>();

            foreach (var hotel in hotels)
            {
                var rooms = await _db.Rooms
                                     .Where(r => r.HotelId == hotel.Id)
                                     .Include(r => r.Hotels)
                                     .ToListAsync();

                var availableRooms = new List<object>();

                foreach (var room in rooms)
                {
                    bool isBooked = await _db.Bookings.AnyAsync(b =>
                        b.RoomId == room.Id &&
                        b.Status != "Cancelled" &&
                        ((checkIn >= b.CheckInDate && checkIn < b.CheckOutDate) ||
                         (checkOut > b.CheckInDate && checkOut <= b.CheckOutDate) ||
                         (checkIn <= b.CheckInDate && checkOut >= b.CheckOutDate))
                    );

                    if (!isBooked && room.IsAvailable) // room.IsAvailable = permanent availability
                    {
                        availableRooms.Add(new
                        {
                            room.Id,
                            room.HotelId,
                            Hotels = room.Hotels,
                            room.RoomNumber,
                            room.Type,
                            room.Price,
                            IsAvailable = true
                        });
                    }
                }

                if (!availableRooms.Any())
                    result.Add(new { Hotel = hotel, Message = "No rooms available for selected dates." });
                else
                    result.Add(new { Hotel = hotel, AvailableRooms = availableRooms });
            }

            return new ApiResponse { Success = true, Message = "Search results fetched", Data = result };
        }

    }
}

