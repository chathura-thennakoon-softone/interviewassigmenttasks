using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.DTOs;
using TaskManagerAPI.Models;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        
        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }
        
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            return int.Parse(userIdClaim ?? "0");
        }
        
        [HttpGet]
        public async Task<IActionResult> GetTasks(
            [FromQuery] string? sortBy = null,
            [FromQuery] TaskPriority? priority = null,
            [FromQuery] bool? isCompleted = null)
        {
            var userId = GetCurrentUserId();
            var tasks = await _taskService.GetTasksByUserIdAsync(userId, sortBy, priority, isCompleted);
            return Ok(tasks);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(int id)
        {
            var userId = GetCurrentUserId();
            var task = await _taskService.GetTaskByIdAsync(id, userId);
            
            if (task == null)
            {
                return NotFound(new { message = "Task not found" });
            }
            
            return Ok(task);
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto createTaskDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var userId = GetCurrentUserId();
            var task = await _taskService.CreateTaskAsync(createTaskDto, userId);
            
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskDto updateTaskDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var userId = GetCurrentUserId();
            var task = await _taskService.UpdateTaskAsync(id, updateTaskDto, userId);
            
            if (task == null)
            {
                return NotFound(new { message = "Task not found" });
            }
            
            return Ok(task);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = GetCurrentUserId();
            var result = await _taskService.DeleteTaskAsync(id, userId);
            
            if (!result)
            {
                return NotFound(new { message = "Task not found" });
            }
            
            return Ok(new { message = "Task deleted successfully" });
        }
        
        [HttpPatch("{id}/toggle")]
        public async Task<IActionResult> ToggleTaskCompletion(int id)
        {
            var userId = GetCurrentUserId();
            var task = await _taskService.ToggleTaskCompletionAsync(id, userId);
            
            if (task == null)
            {
                return NotFound(new { message = "Task not found" });
            }
            
            return Ok(task);
        }
    }
}
