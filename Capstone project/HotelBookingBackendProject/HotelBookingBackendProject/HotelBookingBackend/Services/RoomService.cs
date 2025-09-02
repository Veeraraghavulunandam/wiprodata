using HotelBookingBackend.Data;
using HotelBookingBackend.Models;
using HotelBookingBackend.Utils;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingBackend.Services
{
    public class RoomService
    {
        private readonly HotelBookingDbContext _db;
        public RoomService(HotelBookingDbContext db) => _db = db;

        // -----------------------------
        // Get all rooms
        // -----------------------------
        public async Task<ApiResponse> GetAllRooms()
        {
            var rooms = await _db.Rooms
                                 .Include(r => r.Hotels)
                                 .ToListAsync();
            return new ApiResponse { Success = true, Message = "Rooms fetched", Data = rooms };
        }

        // -----------------------------
        // Get room by Id
        // -----------------------------
        public async Task<ApiResponse> GetRoomById(int id)
        {
            var room = await _db.Rooms
                                .Include(r => r.Hotels)
                                .FirstOrDefaultAsync(r => r.Id == id);
            if (room == null)
                return new ApiResponse { Success = false, Message = "Room not found" };
            return new ApiResponse { Success = true, Message = "Room fetched", Data = room };
        }

        // -----------------------------
        // Add a new room (Admin only)
        // -----------------------------
        public async Task<ApiResponse> AddRoom(Rooms room)
        {
            _db.Rooms.Add(room);
            await _db.SaveChangesAsync();
            return new ApiResponse { Success = true, Message = "Room added", Data = room };
        }

        // -----------------------------
        // Update room (Admin only)
        // -----------------------------
        public async Task<ApiResponse> UpdateRoom(Rooms room)
        {
            var existing = await _db.Rooms.FindAsync(room.Id);
            if (existing == null)
                return new ApiResponse { Success = false, Message = "Room not found" };

            existing.RoomNumber = room.RoomNumber;
            existing.Type = room.Type;
            existing.Price = room.Price;
            existing.IsAvailable = room.IsAvailable;
            existing.HotelId = room.HotelId;

            await _db.SaveChangesAsync();
            return new ApiResponse { Success = true, Message = "Room updated", Data = existing };
        }

        // -----------------------------
        // Delete room (Admin only)
        // -----------------------------
        public async Task<ApiResponse> DeleteRoom(int id)
        {
            var room = await _db.Rooms.FindAsync(id);
            if (room == null)
                return new ApiResponse { Success = false, Message = "Room not found" };

            _db.Rooms.Remove(room);
            await _db.SaveChangesAsync();
            return new ApiResponse { Success = true, Message = "Room deleted" };
        }

        public async Task<List<Rooms>> GetRoomsByHotelId(int hotelId)
        {
            return await _db.Rooms
                .Where(r => r.HotelId == hotelId)
                .ToListAsync();
        }


    }
}
