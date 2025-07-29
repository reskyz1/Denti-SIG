import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {UsersApiService, ConsultasApiService, Consulta} from 'src/app/services/user.service';
import {Paciente} from 'src/app/models/paciente';

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
  cpf = '';
  rg = '';
  endereco = '';
  nomePaciente = '';

  consultas: Consulta[] = [];

  constructor(private userService: UsersApiService, private consultaService: ConsultasApiService,private router: Router,) {}

  get proximasConsultas(): Consulta[] {
    const agora = new Date();
    const limite = new Date();
    limite.setHours(limite.getHours() + 72);
    return this.consultas.filter(c => {
      const dataConsulta = new Date(c.data + 'T' + c.hora);
      return dataConsulta > agora && dataConsulta < limite;
    });
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

              // Buscar consultas do paciente
              this.carregarConsultasPaciente();
            }

         },
          error: (error) => {
           console.error('Erro ao buscar pacientes', error);
          }
        });
      }
  }

  carregarConsultasPaciente(): void {
    if (this.idPaciente) {
      this.consultaService.listarConsultasPaciente(this.idPaciente).subscribe({
        next: (consultas) => {
          this.consultas = consultas;
        },
        error: (error) => {
          console.error('Erro ao buscar consultas do paciente', error);
        }
      });
    }
  }
}
