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

  constructor(
    private consultaService: ConsultasApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.consultaService.listarConsultas().subscribe({
      next: (data) => {
        console.log('Consultas recebidas:', data);
        this.consultas = data.mensagem;
        this.consultasFiltradas = data.mensagem;
      },
      error: (err) => console.error('Erro ao carregar consultas', err)
    });
  }

  filtroStatus: string = '';
  filtroData: string = ''; // nova variável para data no formato 'yyyy-mm-dd'

  filtrarConsultas(): void {
    const status = this.filtroStatus.toLowerCase();
    const dataFiltro = this.filtroData; // já no formato correto do input date

    this.consultasFiltradas = this.consultas.filter(c => {
      const statusOk = status === '' || c.status.toLowerCase() === status;
      const dataOk = dataFiltro === '' || c.data === dataFiltro;
      return statusOk && dataOk;
    });
  }


  abrirConsulta(consulta: any): void {
    this.router.navigate(['/consulta', consulta.id]);
  }
}
