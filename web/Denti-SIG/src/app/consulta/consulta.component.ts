import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultasApiService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-consulta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {
  consulta: any = {
    data: '',
    hora: '',
    duracao: 30,
    status: 'agendada',
    procedimento: '',
    observacoes: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultaService: ConsultasApiService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam); // converte para número

    if (!isNaN(id)) {
      this.consultaService.getConsultaPorId(id).subscribe({
      next: (data) => {
        this.consulta = data;
        console.log('Consulta carregada:', data); // pra garantir que chegou dado
      },
        error: (err) => console.error('Erro ao buscar consulta:', err)
      });
    } else {
      console.error('ID inválido:', idParam);
    }
  }


  salvarConsulta() {
    this.consultaService.atualizarConsulta(this.consulta.id, this.consulta).subscribe(() => {
      this.router.navigate(['/initial']);
    });
  }

  cancelar() {
    this.router.navigate(['/initial']);
  }
}
