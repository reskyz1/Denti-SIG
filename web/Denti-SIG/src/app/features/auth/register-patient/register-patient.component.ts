import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';

import {
  UsersApiService,
  RegisterPatientDTO,
} from '../../../services/user.service';

/* ────────── Validator para confirmar senha ────────── */
function senhaIgual(c: AbstractControl): ValidationErrors | null {
  const senha = c.get('senha')?.value;
  const confirmar = c.get('confirmarSenha')?.value;
  return senha === confirmar ? null : { senhaDivergente: true };
}

@Component({
  selector: 'app-register-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.scss'],  // plural aqui
})
export class RegisterPatientComponent {
  private fb = inject(FormBuilder);
  private usersApi = inject(UsersApiService);

  loading = false;

  form: FormGroup = this.fb.group(
    {
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      data_nascimento: ['', Validators.required],
      telefone: [''],
      endereco: [''],
      sexo: [''],
      termos: [false, Validators.requiredTrue],
    },
    { validators: senhaIgual }
  );

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto: RegisterPatientDTO = {
      ...this.form.value,
      senha: this.form.value.senha,
      data_nascimento: this.form.value.data_nascimento,
    };

    this.loading = true;
    this.usersApi.registerPatient(dto).subscribe({
      next: (res) => {
        alert(res.mensagem);
        this.form.reset();
      },
      error: (err) => {
        alert(err.error?.erro || 'Erro ao cadastrar paciente');
      },
      complete: () => (this.loading = false),
    });
  }

  hasError(ctrl: string, error: string) {
    const c = this.form.get(ctrl);
    return c?.touched && c?.hasError(error);
  }
}
