import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, complete todos los campos';
      return;
    }

    console.log('Enviando solicitud de login...');
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error completo:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 404) {
          this.errorMessage = 'Ruta no encontrada. Verificar URL del servidor.';
        } else {
          this.errorMessage = 'Error en el servidor. Por favor, intente más tarde';
        }
      }
    );
  }
} 