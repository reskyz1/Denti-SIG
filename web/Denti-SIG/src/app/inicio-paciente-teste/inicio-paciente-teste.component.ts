import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Consulta {
  data: Date;
  hora: string;
  dentista: string;
  finalizada: boolean;
  relatorioIA?: string;
}

@Component({
  selector: 'app-inicio-paciente-teste',
  imports: [CommonModule],
  templateUrl: './inicio-paciente-teste.component.html',
  styleUrl: './inicio-paciente-teste.component.scss'
})
export class InicioPacienteTesteComponent {
  codigoPaciente = '123456';
  email = 'maria@email.com';
  celular = '(11) 91234-5678';
  dataNascimento = '01/01/1990';
  genero = 'Feminino';
  cpf = '123.456.789-00';
  rg = '12.345.678-9';
  endereco = 'Rua das Flores, 123, Centro, São Paulo - SP';

  nomePaciente = 'Maria';
  consultas: Consulta[] = [
    { data: new Date(Date.now() + 24 * 60 * 60 * 1000), hora: '14:00', dentista: 'João Silva', finalizada: false },
    { data: new Date(Date.now() - 48 * 60 * 60 * 1000), hora: '07:00', dentista: 'Ana Souza', finalizada: true, relatorioIA: 'link-do-relatorio' }
  ];

  constructor(private router: Router) {}

  get proximasConsultas(): Consulta[] {
    const agora = new Date();
    const limite = new Date();
    limite.setHours(limite.getHours() + 72);
    return this.consultas.filter(c => c.data > agora && c.data < limite);
  }

  irParaHistorico() {
    this.router.navigate(['/historico-consultas']);
  }
}
