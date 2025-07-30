using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly TaskManagerContext _context;
        
        public AuthService(TaskManagerContext context)
        {
            _context = context;
        }
        
        public async Task<User?> RegisterAsync(string username, string email, string password)
        {
            // Check if user already exists
            if (await UserExistsAsync(username, email))
            {
                return null;
            }
            
            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                CreatedAt = DateTime.UtcNow
            };
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            
            return user;
        }
        
        public async Task<User?> LoginAsync(string username, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username);
                
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return null;
            }
            
            return user;
        }
        
        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }
        
        public async Task<bool> UserExistsAsync(string username, string email)
        {
            return await _context.Users
                .AnyAsync(u => u.Username == username || u.Email == email);
        }
    }
}
