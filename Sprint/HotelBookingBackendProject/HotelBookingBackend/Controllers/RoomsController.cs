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
    public class RoomsController : ControllerBase
    {
        private readonly HotelBookingDbContext _db;

        public RoomsController(HotelBookingDbContext db)
        {
            _db = db;
        }

        // -----------------------------
        // Get all rooms
        // -----------------------------
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _db.Rooms.Include(r => r.Hotels).ToListAsync();
            return Ok(result);
        }

        // -----------------------------
        // Get rooms by HotelId + check availability
        // -----------------------------
        [HttpGet("by-hotel/{hotelId}")]
        public async Task<IActionResult> GetByHotel(
            int hotelId,
            [FromQuery] DateTime? checkIn,
            [FromQuery] DateTime? checkOut)
        {
            var rooms = await _db.Rooms
                .Where(r => r.HotelId == hotelId)
                .Include(r => r.Hotels)
                .ToListAsync();

            var result = rooms.Select(r =>
            {
                bool isAvailable = true;

                if (checkIn.HasValue && checkOut.HasValue)
                {
                    // Availability depends only on bookings, not on r.IsAvailable
                    isAvailable = !_db.Bookings.Any(b =>
                        b.RoomId == r.Id &&
                        b.Status != "Cancelled" &&
                        b.CheckInDate < checkOut.Value &&
                        b.CheckOutDate > checkIn.Value
                    );
                }

                return new
                {
                    r.Id,
                    r.RoomNumber,
                    r.Type,
                    r.Price,
                    r.HotelId,
                    HotelName = r.Hotels.Name,
                    IsAvailable = isAvailable
                };
            });

            return Ok(result);
        }

        // -----------------------------
        // Get room by Id
        // -----------------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _db.Rooms
                .Include(r => r.Hotels)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (result == null) return NotFound();
            return Ok(result);
        }

        // -----------------------------
        // Add a new room (Admin only)
        // -----------------------------
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] RoomDto dto)
        {
            var room = new Rooms
            {
                RoomNumber = dto.RoomNumber,
                Type = dto.Type,
                Price = dto.Price,
                HotelId = dto.HotelId
                // Notice: No IsAvailable field anymore
            };

            _db.Rooms.Add(room);
            await _db.SaveChangesAsync();
            return Ok(room);
        }

        // -----------------------------
        // Update room (Admin only)
        // -----------------------------
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RoomDto dto)
        {
            var room = await _db.Rooms.FindAsync(id);
            if (room == null) return NotFound();

            room.RoomNumber = dto.RoomNumber;
            room.Type = dto.Type;
            room.Price = dto.Price;
            room.HotelId = dto.HotelId;
            // No IsAvailable update

            _db.Rooms.Update(room);
            await _db.SaveChangesAsync();
            return Ok(room);
        }

        // -----------------------------
        // Delete room (Admin only)
        // -----------------------------
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var room = await _db.Rooms.FindAsync(id);
            if (room == null) return NotFound();

            _db.Rooms.Remove(room);
            await _db.SaveChangesAsync();
            return Ok(true);
        }
    }
}
