import { Component, OnInit } from '@angular/core';
import { UsersApiService, Paciente } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-pacientes',
  templateUrl: './lista-pacientes.component.html',
  styleUrls: ['./lista-pacientes.component.scss']
})
export class PacientesListaComponent implements OnInit {
  pacientes: Paciente[] = [];

  constructor(
    private usersService: UsersApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usersService.listarPacientes().subscribe({
      next: (data) => this.pacientes = data,
      error: (err) => console.error('Erro ao buscar pacientes', err)
    });
  }

  abrirFicha(paciente: Paciente): void {
    this.router.navigate(['/pacientes', paciente.cpf]);
  }
}
