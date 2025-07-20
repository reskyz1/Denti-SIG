import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, // <- ESSENCIAL para standalone component
  imports: [CommonModule, ReactiveFormsModule], // <- ESSENCIAL para usar formGroup, formControlName, etc.
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      type: ['paciente', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password, type } = this.loginForm.value;
      this.authService.login({ email: username, senha: password, tipo: type }).subscribe({
        next: (response) => {
          console.log('Login bem-sucedido', response);
        },
        error: (err) => {
          console.error('Erro no login', err);
          alert('Falha no login! Verifique suas credenciais.');
        }
      });
    }
  }
}