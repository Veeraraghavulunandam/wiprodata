using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelBookingBackend.Models
{
    public class Bookings
    {
        [Key] public int Id { get; set; }
        [ForeignKey("Users")] public int UserId { get; set; }
        public Users Users { get; set; } = null!;
        [ForeignKey("Rooms")] public int RoomId { get; set; }
        public Rooms Rooms { get; set; } = null!;
        [Required] public DateTime CheckInDate { get; set; }
        [Required] public DateTime CheckOutDate { get; set; }
        [Required] public decimal TotalPrice { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
