using HotelBookingBackend.Data;
using HotelBookingBackend.Models;
using HotelBookingBackend.DTOs;
using HotelBookingBackend.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace HotelBookingBackend.Services
{
    public class AuthService
    {
        private readonly HotelBookingDbContext _db;
        private readonly IConfiguration _config;

        public AuthService(HotelBookingDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        // -----------------------------
        // Register a new user
        // -----------------------------
        public async Task<ApiResponse> Register(UserRegisterDto dto)
        {
            // Check if email already exists
            var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (existingUser != null)
                return new ApiResponse { Success = false, Message = "Email already exists" };

            // Hash password safely using BCrypt
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new Users
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = hashedPassword,
                Role = "Guest" // Default role
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return new ApiResponse
            {
                Success = true,
                Message = "User registered successfully",
                Data = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role,
                    user.CreatedAt
                }
            };
        }

        // -----------------------------
        // Login user
        // -----------------------------
        public async Task<ApiResponse> Login(UserLoginDto dto)
        {
            var email = dto.Email.Trim().ToLower();

            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email);

            if (user == null)
                return new ApiResponse { Success = false, Message = "Invalid credentials (email not found)" };

            // Debugging
            Console.WriteLine("=== DEBUG LOGIN ===");
            Console.WriteLine($"Email Input: {dto.Email}");
            Console.WriteLine($"Password Input: {dto.Password}");
            Console.WriteLine($"Stored Hash: {user.PasswordHash}");
            Console.WriteLine("===================");

            bool validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            Console.WriteLine($"BCrypt Verification: {validPassword}");

            if (!validPassword)
                return new ApiResponse { Success = false, Message = "Invalid credentials (wrong password)" };

            var token = GenerateJwtToken(user);

            return new ApiResponse
            {
                Success = true,
                Message = "Login successful",
                Data = new
                {
                    Token = token,
                    User = new { user.Id, user.Name, user.Email, user.Role }
                }
            };
        }



        // -----------------------------
        // JWT Token generation
        // -----------------------------
        private string GenerateJwtToken(Users user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? ""));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim("id", user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
