using HotelBookingBackend.Data;
using HotelBookingBackend.DTOs;
using HotelBookingBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly HotelBookingDbContext _db;

        public AdminController(HotelBookingDbContext db) => _db = db;

        [HttpGet("bookings")]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _db.Bookings
                                    .Include(b => b.Users)
                                    .Include(b => b.Rooms)
                                        .ThenInclude(r => r.Hotels)
                                    .ToListAsync();
            return Ok(new { Success = true, Message = "All bookings fetched", Data = bookings });
        }

        [HttpPut("rooms/{id}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] Rooms roomUpdate)
        {
            var room = await _db.Rooms.FindAsync(id);
            if (room == null) return NotFound(new { Success = false, Message = "Room not found" });

            room.Price = roomUpdate.Price;
            room.IsAvailable = roomUpdate.IsAvailable;

            await _db.SaveChangesAsync();
            return Ok(new { Success = true, Message = "Room updated successfully", Data = room });
        }

        [HttpPut("bookings/{id}/status")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] UpdateBookingStatusDto dto)
        {
            var booking = await _db.Bookings.FindAsync(id);
            if (booking == null)
                return NotFound(new { Success = false, Message = "Booking not found" });

            booking.Status = dto.Status;
            await _db.SaveChangesAsync();

            return Ok(new { Success = true, Message = "Booking status updated", Data = booking });
        }
    }
}
