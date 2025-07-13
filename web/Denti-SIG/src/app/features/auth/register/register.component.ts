import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private router: Router) {}

  cadastroPaciente() {
    this.router.navigate(['/register-patient']);  // ou qualquer rota que você tenha definido
  }

  cadastroDentista() {
    this.router.navigate(['/register-dentist']);  // mesma coisa aqui
  }

  cadastroSecretario() {
    // Aqui você poderia limpar tokens, dados de sessão, etc.
    this.router.navigate(['/register-secretary']);
  }
}
