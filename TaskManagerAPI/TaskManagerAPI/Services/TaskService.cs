using Microsoft.EntityFrameworkCore;
using TaskManagerAPI.Data;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services
{
    public class TaskService : ITaskService
    {
        private readonly TaskManagerContext _context;
        
        public TaskService(TaskManagerContext context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<TaskDto>> GetTasksByUserIdAsync(int userId, string? sortBy = null, TaskPriority? priority = null, bool? isCompleted = null)
        {
            var query = _context.Tasks.Where(t => t.UserId == userId);
            
            // Apply filters
            if (priority.HasValue)
            {
                query = query.Where(t => t.Priority == priority.Value);
            }
            
            if (isCompleted.HasValue)
            {
                query = query.Where(t => t.IsCompleted == isCompleted.Value);
            }
            
            // Apply sorting
            query = sortBy?.ToLower() switch
            {
                "title" => query.OrderBy(t => t.Title),
                "duedate" => query.OrderBy(t => t.DueDate ?? DateTime.MaxValue),
                "priority" => query.OrderByDescending(t => t.Priority),
                "created" => query.OrderByDescending(t => t.CreatedAt),
                _ => query.OrderByDescending(t => t.CreatedAt)
            };
            
            var tasks = await query.ToListAsync();
            
            return tasks.Select(MapToDto);
        }
        
        public async Task<TaskDto?> GetTaskByIdAsync(int taskId, int userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);
                
            return task != null ? MapToDto(task) : null;
        }
        
        public async Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto, int userId)
        {
            var task = new TaskItem
            {
                Title = createTaskDto.Title,
                Description = createTaskDto.Description,
                Priority = createTaskDto.Priority,
                DueDate = createTaskDto.DueDate,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };
            
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            
            return MapToDto(task);
        }
        
        public async Task<TaskDto?> UpdateTaskAsync(int taskId, UpdateTaskDto updateTaskDto, int userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);
                
            if (task == null)
            {
                return null;
            }
            
            task.Title = updateTaskDto.Title;
            task.Description = updateTaskDto.Description;
            task.Priority = updateTaskDto.Priority;
            task.DueDate = updateTaskDto.DueDate;
            
            // Handle completion status change
            if (updateTaskDto.IsCompleted && !task.IsCompleted)
            {
                task.IsCompleted = true;
                task.CompletedAt = DateTime.UtcNow;
            }
            else if (!updateTaskDto.IsCompleted && task.IsCompleted)
            {
                task.IsCompleted = false;
                task.CompletedAt = null;
            }
            
            await _context.SaveChangesAsync();
            
            return MapToDto(task);
        }
        
        public async Task<bool> DeleteTaskAsync(int taskId, int userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);
                
            if (task == null)
            {
                return false;
            }
            
            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            
            return true;
        }
        
        public async Task<TaskDto?> ToggleTaskCompletionAsync(int taskId, int userId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);
                
            if (task == null)
            {
                return null;
            }
            
            task.IsCompleted = !task.IsCompleted;
            task.CompletedAt = task.IsCompleted ? DateTime.UtcNow : null;
            
            await _context.SaveChangesAsync();
            
            return MapToDto(task);
        }
        
        private static TaskDto MapToDto(TaskItem task)
        {
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                IsCompleted = task.IsCompleted,
                Priority = task.Priority,
                CreatedAt = task.CreatedAt,
                DueDate = task.DueDate,
                CompletedAt = task.CompletedAt,
                UserId = task.UserId
            };
        }
    }
}
