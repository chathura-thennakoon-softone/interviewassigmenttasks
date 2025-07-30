import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private credentialsSubject = new BehaviorSubject<string | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();
  credentials$ = this.credentialsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredCredentials();
  }

  private loadStoredCredentials(): void {
    const storedCredentials = localStorage.getItem('taskManager_credentials');
    const storedUser = localStorage.getItem('taskManager_user');
    
    if (storedCredentials && storedUser) {
      this.credentialsSubject.next(storedCredentials);
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerData);
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          // Create Basic Auth credentials
          const credentials = btoa(`${loginData.username}:${loginData.password}`);
          
          // Store credentials and user data
          localStorage.setItem('taskManager_credentials', credentials);
          localStorage.setItem('taskManager_user', JSON.stringify(response.user));
          
          // Update subjects
          this.credentialsSubject.next(credentials);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('taskManager_credentials');
    localStorage.removeItem('taskManager_user');
    this.credentialsSubject.next(null);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.credentialsSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAuthHeaders(): HttpHeaders {
    const credentials = this.credentialsSubject.value;
    if (!credentials) {
      throw new Error('No authentication credentials available');
    }
    
    return new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    });
  }
}
