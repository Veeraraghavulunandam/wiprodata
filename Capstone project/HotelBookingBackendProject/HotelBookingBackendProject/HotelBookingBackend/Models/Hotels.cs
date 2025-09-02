using System.ComponentModel.DataAnnotations;

namespace HotelBookingBackend.Models
{
    public class Hotels
    {
        [Key] public int Id { get; set; }
        [Required] public string Name { get; set; } = string.Empty;
        [Required] public string Address { get; set; } = string.Empty;
        [Required] public string City { get; set; } = string.Empty;
        [Required] public string Country { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}


