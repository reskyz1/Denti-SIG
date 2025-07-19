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
import { Dentista } from 'src/app/models/dentista';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

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
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './agendar-consulta.component.html',
  styleUrls: ['./agendar-consulta.component.scss']
})
export class AgendarConsultaComponent {
  dentistas: Dentista[] = [
    { id: 1, nome: 'Luis Felipe', email: '', cpf: '', telefone: '', senha: '', cro: '' },
    { id: 2, nome: 'Ana Beatriz', email: '', cpf: '', telefone: '', senha: '', cro: '' },
    { id: 3, nome: 'Carlos Eduardo', email: '', cpf: '', telefone: '', senha: '', cro: '' }
  ];

  dentistaSelecionado?: Dentista;
  paciente: string = '';
  dataConsulta: Date = new Date(); // ← data atual
  horaConsulta: string = '';
  duracaoConsulta: number = 30;
  observacoes: string = '';

  cancelar() {
    console.log('Cancelado');
  }

  agendar() {
    const dataFormatada = this.dataConsulta.toLocaleDateString('pt-BR');
    console.log({
      dentista: this.dentistaSelecionado,
      paciente: this.paciente,
      data: dataFormatada,
      hora: this.horaConsulta,
      duracao: this.duracaoConsulta,
      obs: this.observacoes
    });
  }
}
