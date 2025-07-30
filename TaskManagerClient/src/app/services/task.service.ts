import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '../models/task.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getTasks(filters?: TaskFilters): Observable<Task[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.sortBy) {
        params = params.set('sortBy', filters.sortBy);
      }
      if (filters.priority !== undefined) {
        params = params.set('priority', filters.priority.toString());
      }
      if (filters.isCompleted !== undefined) {
        params = params.set('isCompleted', filters.isCompleted.toString());
      }
    }

    return this.http.get<Task[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders(),
      params
    });
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateTask(id: number, task: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, {
      headers: this.authService.getAuthHeaders()
    });
  }

  toggleTaskCompletion(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/toggle`, {}, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteTask(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
