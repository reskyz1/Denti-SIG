import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { UsersApiService, RegisterDentistDTO } from '../../../services/user.service';

/* ─────── Validador para comparar senha e confirmarSenha ─────── */
function senhaIgual(c: AbstractControl): ValidationErrors | null {
  const senha = c.get('senha')?.value;
  const confirmar = c.get('confirmarSenha')?.value;
  return senha === confirmar ? null : { senhaDivergente: true };
}

@Component({
  selector: 'app-register-dentist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-dentist.component.html',
  styleUrls: ['./register-dentist.component.scss']
})
export class RegisterDentistComponent {
  private fb = inject(FormBuilder);
  private usersApi = inject(UsersApiService);

  loading = false;

  form: FormGroup = this.fb.group(
    {
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      telefone: [''],
      cro: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      termos: [false, Validators.requiredTrue],
    },
    { validators: senhaIgual }
  );

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto: RegisterDentistDTO = {
      nome: this.form.value.nome,
      email: this.form.value.email,
      cpf: this.form.value.cpf,
      telefone: this.form.value.telefone,
      senha: this.form.value.senha,
      cro: this.form.value.cro,
    };

    this.loading = true;
    this.usersApi.registerDentist(dto).subscribe({
      next: (res) => {
        alert(res.mensagem);
        this.form.reset();
      },
      error: (err) => {
        alert(err.error?.erro || 'Erro ao cadastrar dentista');
      },
      complete: () => (this.loading = false),
    });
  }

  hasError(ctrl: string, error: string) {
    const c = this.form.get(ctrl);
    return c?.touched && c?.hasError(error);
  }
}
