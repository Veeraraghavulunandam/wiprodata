using HotelBookingBackend.DTOs;
using HotelBookingBackend.Models;
using HotelBookingBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelBookingBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelsController : ControllerBase
    {
        private readonly HotelService _hotelService;
        public HotelsController(HotelService hotelService) => _hotelService = hotelService;

        // -----------------------------
        // Get all hotels (anyone)
        // -----------------------------
        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _hotelService.GetAllHotels());

        // -----------------------------
        // Get hotel by Id
        // -----------------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id) => Ok(await _hotelService.GetHotelById(id));

        // -----------------------------
        // Admin actions
        // -----------------------------
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Add(Hotels hotel) => Ok(await _hotelService.AddHotel(hotel));

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, Hotels hotel)
        {
            hotel.Id = id;
            return Ok(await _hotelService.UpdateHotel(hotel));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id) => Ok(await _hotelService.DeleteHotel(id));

        // -----------------------------
        // Search hotels with available rooms
        // -----------------------------
        [HttpPost("search")]
        public async Task<IActionResult> SearchHotels([FromBody] HotelSearchDto dto)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(dto.HotelName))
                return BadRequest(new { Success = false, Message = "Hotel name is required." });

            if (dto.CheckInDate >= dto.CheckOutDate)
                return BadRequest(new { Success = false, Message = "Check-out date must be after check-in date." });

            // Call service
            var result = await _hotelService.SearchHotelRooms(dto.HotelName, dto.CheckInDate, dto.CheckOutDate);
            return Ok(result);
        }
    }
}
