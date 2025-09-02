using HotelBookingBackend.Data;
using HotelBookingBackend.DTOs;
using HotelBookingBackend.Models;
using HotelBookingBackend.Utils;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingBackend.Services
{
    public class PaymentService
    {
        private readonly HotelBookingDbContext _db;

        public PaymentService(HotelBookingDbContext db) => _db = db;

        public async Task<ApiResponse> MakePayment(PaymentDto dto)
        {
            var booking = await _db.Bookings.Include(b => b.Rooms)
                                            .FirstOrDefaultAsync(b => b.Id == dto.BookingId);

            if (booking == null)
                return new ApiResponse { Success = false, Message = "Booking not found" };

            if (booking.Status == "Cancelled")
                return new ApiResponse { Success = false, Message = "Booking is cancelled" };

            // Here you can integrate real payment gateway logic.
            // For now, we simulate payment success:
            booking.Status = "Confirmed";
            await _db.SaveChangesAsync();

            return new ApiResponse { Success = true, Message = "Payment successful, booking confirmed", Data = booking };
        }
    }
}
