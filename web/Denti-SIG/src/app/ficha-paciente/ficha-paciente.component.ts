import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersApiService, Paciente } from '../services/user.service';

@Component({
  selector: 'app-ficha-paciente',
  templateUrl: './ficha-paciente.component.html',
  styleUrls: ['./ficha-paciente.component.scss']
})
export class FichaPacienteComponent implements OnInit {
  paciente: Paciente | null = null;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersApiService
  ) {}

  ngOnInit(): void {
    const cpf = this.route.snapshot.paramMap.get('cpf');
    if (cpf) {
      this.usersService.pacientePorCpf(cpf).subscribe({
        next: (data) => this.paciente = data,
        error: (err) => console.error('Erro ao buscar paciente:', err)
      });
    }
  }
}
