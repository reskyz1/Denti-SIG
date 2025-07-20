import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormGroup
} from '@angular/forms';
import { UsersApiService, RegisterSecretaryDTO } from '../../../services/user.service';

/* Validador para confirmar senha */
function senhaIgual(c: AbstractControl): ValidationErrors | null {
  const senha = c.get('senha')?.value;
  const confirmar = c.get('confirmarSenha')?.value;
  return senha === confirmar ? null : { senhaDivergente: true };
}

@Component({
  selector: 'app-register-secretary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-secretary.component.html',
  styleUrls: ['./register-secretary.component.scss']
})
export class RegisterSecretaryComponent {
  private fb = inject(FormBuilder);
  private usersApi = inject(UsersApiService);

  loading = false;

  form: FormGroup = this.fb.group(
    {
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      telefone: [''],
      matricula: ['', Validators.required], // antigo "RG" ou "ID clínica"
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      termos: [false, Validators.requiredTrue]
    },
    { validators: senhaIgual }
  );

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto: RegisterSecretaryDTO = {
      nome: this.form.value.nome,
      email: this.form.value.email,
      cpf: this.form.value.cpf,
      telefone: this.form.value.telefone,
      senha: this.form.value.senha,
      matricula: this.form.value.matricula,
    };

    this.loading = true;
    this.usersApi.registerSecretary(dto).subscribe({
      next: (res) => {
        alert(res.mensagem);
        this.form.reset();
      },
      error: (err) => {
        alert(err.error?.erro || 'Erro ao cadastrar secretário');
      },
      complete: () => (this.loading = false)
    });
  }

  hasError(ctrl: string, error: string) {
    const c = this.form.get(ctrl);
    return c?.touched && c?.hasError(error);
  }
}
