import { Component, OnInit } from '@angular/core';

interface Paciente {
  id: number;
  nome: string;
  telefone: string;
  cpf: string;
  rg: string;
  nascimento: Date;
  genero: string;
  endereco: string;
  lembretes: string;
  naoReceber: string;
  observacoes: string;
  historico: string[];
  mensagem: string;
}

@Component({
  selector: 'app-paciente-profile',
  templateUrl: './paciente-profile.component.html',
  styleUrls: ['./paciente-profile.component.scss']
})
export class PacienteProfileComponent implements OnInit {
  paciente!: Paciente;

  ngOnInit() {
    // Aqui você buscaria via serviço HTTP os dados reais do paciente.
    this.paciente = {
      id: 1,
      nome: 'Saulo Silva',
      telefone: '(81) 97454-4852',
      cpf: '948.896.454-01',
      rg: '26/05/2025',
      nascimento: new Date(2025, 4, 26),
      genero: 'Masculino',
      endereco: 'Rua Senador, 121-sé, São Paulo, SP',
      lembretes: 'Celular',
      naoReceber: 'fulanodetal@gmail.com',
      observacoes: 'Portador de TEA',
      historico: ['Tratamento de canal no dente 23'],
      mensagem: 'Você tem uma consulta marcada para a data 22/02/2026.'
    };
  }
}
