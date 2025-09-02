namespace HotelBookingBackend.DTOs
{
    public class PaymentDto
    {
        public int BookingId { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
    }
}
