using Microsoft.EntityFrameworkCore;
using HotelBookingBackend.Models;

namespace HotelBookingBackend.Data
{
    public class HotelBookingDbContext : DbContext
    {
        public HotelBookingDbContext(DbContextOptions<HotelBookingDbContext> options) : base(options) { }

        public DbSet<Users> Users { get; set; } = null!;
        public DbSet<Hotels> Hotels { get; set; } = null!;
        public DbSet<Rooms> Rooms { get; set; } = null!;
        public DbSet<Bookings> Bookings { get; set; } = null!;
        public DbSet<Payments> Payments { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>().ToTable("Users");
            modelBuilder.Entity<Hotels>().ToTable("Hotels");
            modelBuilder.Entity<Rooms>().ToTable("Rooms");
            modelBuilder.Entity<Bookings>().ToTable("Bookings");
            modelBuilder.Entity<Payments>().ToTable("Payments");
        }
    }
}
