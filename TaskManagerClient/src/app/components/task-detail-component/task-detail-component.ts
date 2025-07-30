import { Component, Input } from '@angular/core';
import { PRIORITY_LABELS, Task, TaskPriority } from '../../models/task.model';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-detail-component',
  imports: [
    CommonModule,

  ],
  templateUrl: './task-detail-component.html',
  styleUrl: './task-detail-component.css',
})
export class TaskDetailComponent {
  task: Task | null = null;

  @Input() taskId: number | null = null;

  constructor(private taskService: TaskService, private route: ActivatedRoute) {
    const taskId = this.route.snapshot.paramMap.get('id');
    this.taskId = taskId ? +taskId : null;

  }

  ngOnInit(): void {
    this.loadTask();
  }

  loadTask(): void {
    if (this.taskId) {
      this.taskService.getTask(this.taskId).subscribe({
        next: (task) => {
          this.task = task;
        }
      });
    }
  }

  getPriorityLabel(priority: TaskPriority): string {
    return PRIORITY_LABELS[priority];
  }
}
