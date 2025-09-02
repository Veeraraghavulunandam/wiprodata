namespace HotelBookingBackend.DTOs
{
    public class UpdateBookingStatusDto
    {
        /// <summary>
        /// The new status of the booking: Pending, Confirmed, or Cancelled
        /// </summary>
        public string Status { get; set; } = "Pending";
    }
}
