import { Component, OnInit } from '@angular/core';
import { UsersApiService, Paciente } from '../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- necessário para ngModel
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-lista-pacientes',
  standalone: true, // <-- marca como standalone
  imports: [CommonModule, FormsModule, RouterModule,HeaderComponent],
  templateUrl: './lista-pacientes.component.html',
  styleUrls: ['./lista-pacientes.component.scss']
})
export class PacientesListaComponent implements OnInit {
  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];

  filtroNome: string = '';
  filtroCpf: string = '';

  constructor(
    private usersService: UsersApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usersService.listarPacientes().subscribe({
      next: (data) => {
        console.log('Pacientes recebidos:', data);
        this.pacientes = data;
        this.pacientesFiltrados = data;
      },
      error: (err) => console.error('Erro ao buscar pacientes', err)
    });
  }

  filtrarPacientes(): void {
    const nome = this.filtroNome.toLowerCase();
    const cpf = this.filtroCpf.replace(/\D/g, '');

    this.pacientesFiltrados = this.pacientes.filter(p =>
      p.nome.toLowerCase().includes(nome) &&
      p.cpf.replace(/\D/g, '').includes(cpf)
    );
  }

abrirFicha(paciente: Paciente): void {
  this.router.navigate(['/ficha', paciente.cpf]);
}
}
