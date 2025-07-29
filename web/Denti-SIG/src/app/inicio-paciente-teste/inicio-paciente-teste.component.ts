import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {UsersApiService, ConsultasApiService} from 'src/app/services/user.service';
import {Paciente} from 'src/app/models/paciente';
interface Consulta {
  data: Date;
  hora: string;
  dentista: string;
  finalizada: boolean;
  relatorioIA?: string;
}

@Component({
  selector: 'app-inicio-paciente',
  imports: [CommonModule],
  templateUrl: './inicio-paciente-teste.component.html',
  styleUrl: './inicio-paciente-teste.component.scss'
})
export class InicioPacienteTesteComponent {
  pacientes: Paciente[] = []; 
  pacienteUser: Paciente | undefined;
  idPaciente : number | undefined;
  email = '';
  celular = '';
  dataNascimento = '';
  genero = '';
  cpf = '';
  rg = '';
  endereco = '';
  nomePaciente = '';

  consultas: Consulta[] = [
    { data: new Date(Date.now() + 24 * 60 * 60 * 1000), hora: '14:00', dentista: 'João Silva', finalizada: false },
    { data: new Date(Date.now() - 48 * 60 * 60 * 1000), hora: '07:00', dentista: 'Ana Souza', finalizada: true, relatorioIA: 'link-do-relatorio' }
  ];

  constructor(private userService: UsersApiService, private consultaService: ConsultasApiService,private router: Router,) {}

  get proximasConsultas(): Consulta[] {
    const agora = new Date();
    const limite = new Date();
    limite.setHours(limite.getHours() + 72);
    return this.consultas.filter(c => c.data > agora && c.data < limite);
  }

  irParaHistorico() {
    this.router.navigate(['/historico-consultas']);
  }

  ngOnInit(): void {
      const usuarioJson = localStorage.getItem('usuario');
      if(usuarioJson){
        const usuario = JSON.parse(usuarioJson);
        this.userService.listarPacientesNormal().subscribe({
          next: (res) => {
            this.pacientes = res;
            this.pacienteUser = this.pacientes.find(d => d.id === usuario.id);
            if(this.pacienteUser){
              this.idPaciente = this.pacienteUser.id,
              this.email = this.pacienteUser.email
              this.celular = this.pacienteUser.telefone
              this.cpf = this.pacienteUser.cpf
              this.endereco = this.pacienteUser.endereco
              this.dataNascimento = this.pacienteUser.data_nascimento
            }
            
         },
          error: (error) => {
           console.error('Erro ao buscar pacientes', error);
          }
        });
      }
  }
}
