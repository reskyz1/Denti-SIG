import { Component } from '@angular/core';

@Component({
  selector: 'app-ficha-paciente',
  templateUrl: './ficha-paciente.component.html',
  styleUrls: ['./ficha-paciente.component.scss']
})
export class FichaPacienteComponent {
  // Dados pessoais - placeholders
  paciente = {
    nome: 'João da Silva',
    cpf: '123.456.789-00',
    nascimento: '1990-01-01',
    sexo: 'Masculino',
    estadoCivil: 'Solteiro',
    endereco: 'Rua das Flores, 123 - Recife/PE',
    telefone: '(81) 99999-9999',
    email: 'joao@email.com',
    responsavel: null
  };

  // Anamnese - placeholders
  anamnese = {
    doencasCronicas: ['Hipertensão'],
    alergias: ['Dipirona'],
    medicamentos: ['Losartana'],
    cirurgias: ['Apendicectomia'],
    condicoes: ['Nenhuma'],
    ultimaConsulta: '2024-12-01',
    problemasDentarios: ['Cáries recorrentes'],
    sensibilidade: 'Frio e doces',
    habitos: ['Bruxismo'],
    higieneBucal: {
      escovacoes: '3x ao dia',
      usoFioDental: 'Regularmente'
    }
  };
}
