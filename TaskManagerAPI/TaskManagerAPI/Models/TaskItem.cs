using System.ComponentModel.DataAnnotations;

namespace TaskManagerAPI.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        public bool IsCompleted { get; set; } = false;
        
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? DueDate { get; set; }
        
        public DateTime? CompletedAt { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        public User User { get; set; } = null!;
    }
    
    public enum TaskPriority
    {
        Low = 1,
        Medium = 2,
        High = 3
    }
}
