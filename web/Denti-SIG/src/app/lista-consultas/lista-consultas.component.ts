import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { ConsultasApiService } from '../services/user.service';

@Component({
  selector: 'app-lista-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './lista-consultas.component.html',
  styleUrls: ['./lista-consultas.component.scss']
})
export class ListaConsultasComponent implements OnInit {
  consultas: any[] = [];
  consultasFiltradas: any[] = [];

  filtroNome: string = '';
  filtroStatus: string = '';

  constructor(
    private consultaService: ConsultasApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.consultaService.listarConsultas().subscribe({
      next: (data) => {
        console.log('Consultas recebidas:', data);
        this.consultas = data;
        this.consultasFiltradas = data;
      },
      error: (err) => console.error('Erro ao carregar consultas', err)
    });
  }

  filtrarConsultas(): void {
    const nome = this.filtroNome.toLowerCase();
    const status = this.filtroStatus.toLowerCase();

    this.consultasFiltradas = this.consultas.filter(c =>
      c.paciente_nome.toLowerCase().includes(nome) &&
      (status === '' || c.status.toLowerCase() === status)
    );
  }

  abrirConsulta(consulta: any): void {
    this.router.navigate(['/consulta', consulta.id]);
  }
}
