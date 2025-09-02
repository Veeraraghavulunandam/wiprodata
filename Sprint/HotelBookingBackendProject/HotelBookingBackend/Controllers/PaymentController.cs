using HotelBookingBackend.DTOs;
using HotelBookingBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelBookingBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _paymentService;

        public PaymentController(PaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost]
        public async Task<IActionResult> MakePayment([FromBody] PaymentDto dto)
        {
            var response = await _paymentService.MakePayment(dto);
            return Ok(response);
        }
    }
}
