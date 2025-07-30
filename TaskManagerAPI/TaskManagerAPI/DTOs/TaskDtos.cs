using System.ComponentModel.DataAnnotations;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.DTOs
{
    public class CreateTaskDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        
        public DateTime? DueDate { get; set; }
    }
    
    public class UpdateTaskDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        public bool IsCompleted { get; set; }
        
        public TaskPriority Priority { get; set; }
        
        public DateTime? DueDate { get; set; }
    }
    
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
        public TaskPriority Priority { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int UserId { get; set; }
    }
}
