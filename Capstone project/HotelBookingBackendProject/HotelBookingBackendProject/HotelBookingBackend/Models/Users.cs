using System.ComponentModel.DataAnnotations;

namespace HotelBookingBackend.Models
{
    public class Users
    {
        [Key] public int Id { get; set; }
        [Required] public string Name { get; set; } = string.Empty;
        [Required] public string Email { get; set; } = string.Empty;
        [Required] public string PasswordHash { get; set; } = string.Empty;
        [Required] public string Role { get; set; } = "Guest"; // Guest, Registered, Admin
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
