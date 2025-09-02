using HotelBookingBackend.DTOs;
using HotelBookingBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelBookingBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly BookingService _bookingService;

        public BookingController(BookingService bookingService)
        {
            _bookingService = bookingService;
        }

        // -----------------------------
        // Create Booking
        // -----------------------------
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingDto dto)
        {
            var userClaim = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userClaim))
                return Unauthorized(new { message = "User ID not found in token" });

            int userId = int.Parse(userClaim);

            var result = await _bookingService.BookRoom(userId, dto);
            return Ok(result);
        }

        // -----------------------------
        // Get My Bookings
        // -----------------------------
        [HttpGet("me")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userClaim = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userClaim))
                return Unauthorized(new { message = "User ID not found in token" });

            int userId = int.Parse(userClaim);

            var response = await _bookingService.GetBookingsByUser(userId);
            return Ok(response);
        }

        // -----------------------------
        // Cancel Booking
        // -----------------------------
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var result = await _bookingService.CancelBooking(id);
            return Ok(result);
        }
    }
}
