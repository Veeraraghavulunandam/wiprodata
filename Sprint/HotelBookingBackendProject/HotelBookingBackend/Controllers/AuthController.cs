using HotelBookingBackend.DTOs;
using HotelBookingBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace HotelBookingBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        // -----------------------------
        // REGISTER
        // -----------------------------
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Success = false, Message = "Invalid data" });

            var result = await _authService.Register(dto);
            return Ok(result);
        }

        // -----------------------------
        // LOGIN
        // -----------------------------
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { Success = false, Message = "Invalid data" });

            var result = await _authService.Login(dto);
            return Ok(result);
        }

        
    }
}
