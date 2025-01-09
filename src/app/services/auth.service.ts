import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible en toda la aplicación
})
export class AuthService {
  private user: { username: string; password: string } | null = null;

  setUser(user: { username: string; password: string }): void {
    this.user = user;
  }

  getUser(): { username: string; password: string } | null {
    return this.user;
  }
}
