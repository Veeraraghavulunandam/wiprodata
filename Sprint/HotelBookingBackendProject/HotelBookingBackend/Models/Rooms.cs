using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelBookingBackend.Models
{
    public class Rooms
    {
        [Key] public int Id { get; set; }
        [ForeignKey("Hotels")] public int HotelId { get; set; }
        public Hotels Hotels { get; set; } = null!;
        [Required] public string RoomNumber { get; set; } = string.Empty;
        [Required] public string Type { get; set; } = string.Empty;
        [Required] public decimal Price { get; set; }
        public bool IsAvailable { get; set; } = true;
    }
}
