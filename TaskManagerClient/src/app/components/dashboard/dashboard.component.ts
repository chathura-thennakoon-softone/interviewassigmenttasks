import { Component } from '@angular/core';
import { TaskListComponent } from '../task-list/task-list.component';
import { HeaderComponent } from '../header/header.component';
import { NavigationComponent } from '../navigation-component/navigation-component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TaskListComponent,
    HeaderComponent,
    NavigationComponent,
    RouterOutlet
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
