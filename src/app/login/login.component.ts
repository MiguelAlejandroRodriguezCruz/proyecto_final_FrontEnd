import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';  // Agrega esta importación
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], // FormsModule sigue siendo necesario aquí
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  onSubmit() {
    if (this.usuario && this.password) {
      const headers = new HttpHeaders()
        .set('Authorization', 'Basic ' + btoa(this.usuario + ':' + this.password));

      this.http.get('https://proyecto-final-backend-vw8r.onrender.com/api/v1/return/listar', { headers })
        .pipe(
          catchError((error) => {
            if (error.status === 401) {
              this.errorMessage = 'Credenciales incorrectas';
            } else {
              this.errorMessage = 'Error de autenticación';
            }
            return of(null); // Esto evita que el flujo de la app se interrumpa
          })
        )
        .subscribe({
          next: (response) => {
            if (response) {
              // Si la respuesta es exitosa (200), redirige al dashboard
              this.authService.setUser({ username: this.usuario, password: this.password });
              this.router.navigate(['/dashboard']);
            }
          },
        });
    } else {
      alert('Por favor, llena todos los campos.');
    }
  }
}
