import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskDetailComponent } from './components/task-detail-component/task-detail-component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'task-list',
        component: TaskListComponent,
        canActivate: [authGuard],
      }
    ]
  },
  {
    path: 'task-list',
    component: TaskListComponent,
    canActivate: [authGuard],
    children:[
      {
        path: ':id',
        component: TaskDetailComponent,
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'task/:id',
    component: TaskDetailComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/dashboard' },
];
