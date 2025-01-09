import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule], // Importa RouterModule aquí
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router) { }

  logout(): void {
    // Navegar al login y limpiar cualquier sesión si es necesario
    this.router.navigate(['/login']);
  }
}
