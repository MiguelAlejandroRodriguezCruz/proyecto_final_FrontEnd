import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { CommonModule } from '@angular/common';  // Agrega esta importación
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-returns',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.css']
})
export class ReturnsComponent implements OnInit {
  user: { username: string; password: string } | null = null;
  listReturns: any[] = [];
  errorMessage: string = '';
  isEditing: boolean = false; // Nuevo: controla si estamos en modo edición
  showForm: boolean = false; // Control para mostrar u ocultar el formulario
  newReturn = { order_id: '', product_id: '', return_date: '', reason: '' }; // Modelo del formulario
  editReturnId: number | null = null; // Nuevo: almacena el ID del return a editar

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();

    if (!this.user) {
      alert('No estás autenticado. Regresando al login.');
      this.router.navigate(['/login']);
      return;
    }

    // Autenticación básica con las credenciales del usuario
    const headers = new HttpHeaders()
      .set('Authorization', 'Basic ' + btoa(`${this.user.username}:${this.user.password}`));

    this.http.get<any>('https://proyecto-final-backend-r3li.onrender.com/api/v1/return/listar', { headers })
      .pipe(
        catchError((error) => {
          this.errorMessage = error.status === 401
            ? 'Credenciales inválidas o sesión expirada.'
            : 'Error al cargar los datos.';
          return of(null); // Devolver null en caso de error
        })
      )
      .subscribe({
        next: (response) => {
          if (response && response.estado === 1) {
            this.listReturns = response.clientes; // Accede a la propiedad "clientes"
          } else {
            this.errorMessage = 'No se encontraron datos de returns.';
          }
        },
        error: (err) => {
          console.error(err);
        }
      });

  }
  // Método para rastrear elementos por su id
  trackById(index: number, item: any): number {
    return item.id;
  }

  // Método para alternar el formulario
  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.newReturn = { order_id: '', product_id: '', return_date: '', reason: '' };
      this.editReturnId = null;
      this.isEditing = false;
    }
  }

  // Método para agregar un nuevo return
  addReturn() {
    if (!this.user) return;

    const headers = new HttpHeaders()
      .set('Authorization', 'Basic ' + btoa(`${this.user.username}:${this.user.password}`));

    const payload = {
      user: this.user.username,
      ...this.newReturn
    };

    this.http.post('https://proyecto-final-backend-r3li.onrender.com/api/v1/return/crear', payload, { headers })
      .pipe(
        catchError((error) => {
          if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'No tienes permiso de crear.';
          } else {
            this.errorMessage = 'Error al guardar el return.';
          }
          return of(null); // Retornar null para continuar el flujo
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            alert('Return agregado correctamente.');
            this.listReturns.push(payload); // Agregar directamente a la lista
            this.toggleForm(); // Ocultar el formulario
          }
        },
        error: (err) => {
          console.error('Error en el servidor:', err);
        }
      });
  }

  editReturn(returnItem: any) {
    this.isEditing = true;
    this.editReturnId = returnItem.id;
    this.newReturn = {
      order_id: returnItem.order_id,
      product_id: returnItem.product_id,
      return_date: returnItem.return_date,
      reason: returnItem.reason
    };
    this.showForm = true;
  }

  updateReturn() {
    if (!this.user || this.editReturnId === null) return;

    const headers = new HttpHeaders()
      .set('Authorization', 'Basic ' + btoa(`${this.user.username}:${this.user.password}`));

    const payload = {
      user: this.user.username,
      ...this.newReturn
    };

    this.http.put(`https://proyecto-final-backend-r3li.onrender.com/api/v1/return/actualizar/${this.editReturnId}`, payload, { headers })
      .pipe(
        catchError((error) => {
          if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'No tienes permiso para editar.';
          } else {
            this.errorMessage = 'Error al actualizar el return.';
          }
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            alert('Return actualizado correctamente.');
            const index = this.listReturns.findIndex(r => r.id === this.editReturnId);
            if (index !== -1) this.listReturns[index] = { ...payload, id: this.editReturnId };
            this.toggleForm();
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  deleteReturn(id: number) {
    if (!this.user) return;

    const headers = new HttpHeaders()
      .set('Authorization', 'Basic ' + btoa(`${this.user.username}:${this.user.password}`));

    this.http.delete(`https://proyecto-final-backend-r3li.onrender.com/api/v1/return/eliminar/${id}`, { headers })
      .pipe(
        catchError((error) => {
          if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'No tienes permiso para eliminar.';
          } else {
            this.errorMessage = 'Error al eliminar el return.';
          }
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            alert('Return eliminado correctamente.');
            this.listReturns = this.listReturns.filter(r => r.id !== id);
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}
