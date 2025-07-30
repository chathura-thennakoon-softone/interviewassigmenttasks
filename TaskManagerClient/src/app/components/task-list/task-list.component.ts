import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task, TaskPriority, TaskFilters, PRIORITY_LABELS, PRIORITY_COLORS } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatCheckboxModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  isLoading = false;
  filtersForm: FormGroup;
  TaskPriority = TaskPriority;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filtersForm = this.fb.group({
      sortBy: [''],
      priority: [''],
      isCompleted: ['']
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    const filters = this.getFiltersFromForm();
    
    this.taskService.getTasks(filters).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.snackBar.open('Error loading tasks', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  onFiltersChange(): void {
    this.loadTasks();
  }

  private getFiltersFromForm(): TaskFilters {
    const formValue = this.filtersForm.value;
    const filters: TaskFilters = {};
    
    if (formValue.sortBy) filters.sortBy = formValue.sortBy;
    if (formValue.priority !== '') filters.priority = formValue.priority;
    if (formValue.isCompleted !== '') filters.isCompleted = formValue.isCompleted;
    
    return filters;
  }

  openTaskDialog(task?: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: task || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  toggleTaskCompletion(task: Task): void {
    this.taskService.toggleTaskCompletion(task.id).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.snackBar.open(
          updatedTask.isCompleted ? 'Task completed!' : 'Task reopened!',
          'Close',
          {
            duration: 2000,
            panelClass: ['success-snackbar']
          }
        );
      },
      error: (error) => {
        console.error('Error toggling task:', error);
        this.snackBar.open('Error updating task', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  deleteTask(task: Task): void {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== task.id);
          this.snackBar.open('Task deleted successfully', 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.snackBar.open('Error deleting task', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  getPriorityLabel(priority: TaskPriority): string {
    return PRIORITY_LABELS[priority];
  }

  getPriorityColor(priority: TaskPriority): string {
    return PRIORITY_COLORS[priority];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  isOverdue(dueDateString: string): boolean {
    const dueDate = new Date(dueDateString);
    const now = new Date();
    return dueDate < now;
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
}
