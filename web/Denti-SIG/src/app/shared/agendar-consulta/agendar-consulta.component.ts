import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Dentista } from 'src/app/services/user.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ConsultasApiService, UsersApiService } from 'src/app/services/user.service'; 
import { MensagemResposta } from 'src/app/services/user.service'; 
import {Paciente} from 'src/app/models/paciente';

@Component({
  selector: 'app-agendar-consulta-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './agendar-consulta.component.html',
  styleUrls: ['./agendar-consulta.component.scss']
})
export class AgendarConsultaComponent {
  constructor(private consultaService: ConsultasApiService,private dialogRef: MatDialogRef<AgendarConsultaComponent>, private userService: UsersApiService) {}

  dentistas: Dentista[] = []
  pacientes: Paciente[] = []

  dentistaSelecionado?: Dentista;
  pacienteSelecionado?: Paciente;
  paciente: string = '';
  dataConsulta: Date = new Date(); 
  horaConsulta: string = '';
  duracaoConsulta: number = 30;
  observacoes: string = '';

  cancelar() {
    console.log('Cancelado');
  }

  agendar() {
  if (!this.dentistaSelecionado) {
    alert('Selecione um dentista!');
    return;
  }
  if (!this.pacienteSelecionado) {
    alert('Selecione um paciente!');
    return;
  }

  const dataFormatada = this.dataConsulta.toISOString().split('T')[0]; // yyyy-MM-dd
  const body = {
    data: dataFormatada,
    hora: this.horaConsulta,
    duracao: this.duracaoConsulta,
    paciente_id: this.pacienteSelecionado.id, 
    dentista_id: this.dentistaSelecionado.id,
    observacoes: this.observacoes,
    status: 'agendada',
    procedimento: 'limpeza'
  };

  this.consultaService.criarConsulta(body).subscribe({
    next: (res: MensagemResposta) => {
      console.log('Consulta agendada com sucesso!', res);
      alert(res.mensagem);
      this.dialogRef.close(body);
    },
    error: (err) => {
      console.error('Erro ao agendar consulta', err);
      alert('Falha ao agendar consulta');
    }
  });
}

  getDentistas(): Dentista[]{
    this.userService.listarDentistas().subscribe({
      next: (res) => {
        return res;
      },
      error: (err) => {
        return [];
      }
    })
    return [];
  }

  ngOnInit(): void {
  this.userService.listarDentistas().subscribe({
    next: (res) => {
      this.dentistas = res;
    },
    error: (err) => {
      console.error('Erro ao carregar dentistas', err);
    }
  });

  this.userService.listarPacientesNormal().subscribe({
    next: (res) => {
      this.pacientes = res;
    },
    error: (err) => {
      console.error('Erro ao carregar pacientes', err);
    }
  });
}

}
