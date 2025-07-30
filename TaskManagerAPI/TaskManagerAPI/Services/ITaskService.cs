using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDto>> GetTasksByUserIdAsync(int userId, string? sortBy = null, TaskPriority? priority = null, bool? isCompleted = null);
        Task<TaskDto?> GetTaskByIdAsync(int taskId, int userId);
        Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto, int userId);
        Task<TaskDto?> UpdateTaskAsync(int taskId, UpdateTaskDto updateTaskDto, int userId);
        Task<bool> DeleteTaskAsync(int taskId, int userId);
        Task<TaskDto?> ToggleTaskCompletionAsync(int taskId, int userId);
    }
}
