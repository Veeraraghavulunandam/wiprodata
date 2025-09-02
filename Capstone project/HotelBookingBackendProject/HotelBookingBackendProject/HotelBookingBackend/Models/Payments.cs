using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelBookingBackend.Models
{
    public class Payments
    {
        [Key] public int Id { get; set; }
        [ForeignKey("Bookings")] public int BookingId { get; set; }
        public Bookings Bookings { get; set; } = null!;
        public DateTime PaymentDate { get; set; } = DateTime.Now;
        [Required] public decimal Amount { get; set; }
        [Required] public string PaymentMethod { get; set; } = string.Empty;
        public string Status { get; set; } = "Completed"; // Completed, Failed
    }
}
