import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: { username: string; password: string } | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (!this.user) {
      alert('No estás autenticado. Regresando al login.');
      this.router.navigate(['/login']);
    }
  }
}