using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(string username, string email, string password);
        Task<User?> LoginAsync(string username, string password);
        Task<User?> GetUserByIdAsync(int userId);
        Task<bool> UserExistsAsync(string username, string email);
    }
}
