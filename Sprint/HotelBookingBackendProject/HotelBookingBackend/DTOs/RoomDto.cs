namespace HotelBookingBackend.DTOs
{
    public class RoomDto
    {
        public string RoomNumber { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Single, Double, Suite, etc.
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; } = true;
        public int HotelId { get; set; } // Link to hotel
    }
}
