import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Task, TaskPriority, CreateTaskRequest, UpdateTaskRequest, PRIORITY_LABELS } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.css'
})
export class TaskDialogComponent implements OnInit {
  taskForm: FormGroup;
  isNew = false;
  isLoading = false;
  TaskPriority = TaskPriority;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null
  ) {
    this.isNew = !!data;
    
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      priority: [TaskPriority.Medium, Validators.required],
      isCompleted: [false],
      dueDate: [null],
      dueTime: ['']
    });
  }

  ngOnInit(): void {
    if (this.isNew && this.data) {
      const dueDateTime = this.data.dueDate ? new Date(this.data.dueDate) : null;
      const dueTime = dueDateTime ? 
        dueDateTime.toTimeString().substring(0, 5) : '';
      
      this.taskForm.patchValue({
        title: this.data.title,
        description: this.data.description || '',
        priority: this.data.priority,
        isCompleted: this.data.isCompleted,
        dueDate: dueDateTime,
        dueTime: dueTime
      });
    }
  }

  onSave(): void {
    if (this.taskForm.valid) {
      this.isLoading = true;
      
      const formValue = this.taskForm.value;
      
      // Combine date and time into ISO string
      let dueDateTime: string | undefined = undefined;
      if (formValue.dueDate) {
        const date = new Date(formValue.dueDate);
        if (formValue.dueTime) {
          const [hours, minutes] = formValue.dueTime.split(':');
          date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        }
        dueDateTime = date.toISOString();
      }
      
      const taskData = {
        title: formValue.title,
        description: formValue.description || undefined,
        priority: formValue.priority,
        dueDate: dueDateTime
      };

      if (this.isNew && this.data) {
        // Update existing task
        const updateData: UpdateTaskRequest = {
          ...taskData,
          isCompleted: formValue.isCompleted
        };

        this.taskService.updateTask(this.data.id, updateData).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Task updated successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error updating task:', error);
            this.snackBar.open(
              error.error?.message || 'Error updating task',
              'Close',
              {
                duration: 5000,
                panelClass: ['error-snackbar']
              }
            );
          }
        });
      } else {
        // Create new task
        const createData: CreateTaskRequest = taskData;

        this.taskService.createTask(createData).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Task created successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error creating task:', error);
            this.snackBar.open(
              error.error?.message || 'Error creating task',
              'Close',
              {
                duration: 5000,
                panelClass: ['error-snackbar']
              }
            );
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getPriorityLabel(priority: TaskPriority): string {
    return PRIORITY_LABELS[priority];
  }
}
