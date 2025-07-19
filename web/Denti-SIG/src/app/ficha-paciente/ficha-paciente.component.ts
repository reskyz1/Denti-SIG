import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- necessário para *ngIf
import { ActivatedRoute } from '@angular/router';
import { UsersApiService, Paciente } from '../services/user.service';

@Component({
  selector: 'app-ficha-paciente',
  standalone: true,
  imports: [CommonModule], // <-- adicione isso aqui!
  templateUrl: './ficha-paciente.component.html',
  styleUrls: ['./ficha-paciente.component.scss']
})
export class FichaPacienteComponent implements OnInit {
  paciente: Paciente | null = null;
  anamnese: any = null;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersApiService
  ) {}

  ngOnInit(): void {
    const cpf = this.route.snapshot.paramMap.get('cpf');
    console.log('CPF da rota:', cpf);
    if (cpf) {
      this.usersService.pacientePorCpf(cpf).subscribe({
        next: (data) => {
          this.paciente = data;
          this.anamnese = this.mapearAnamnese(data);
        },
        error: (err) => console.error('Erro ao buscar paciente:', err)
      });
    }
  }

  mapearAnamnese(paciente: Paciente) {
    return {
      doencasCronicas: paciente.doencas_cronicas?.split(',').map(d => d.trim()) || [],
      alergias: paciente.alergias?.split(',').map(a => a.trim()) || [],
      medicamentos: paciente.medicacoes_uso_continuo?.split(',').map(m => m.trim()) || [],
      cirurgias: paciente.historico_cirurgico?.split(',').map(c => c.trim()) || [],
      condicoes: [
        paciente.problema_cardiaco ? 'Problema cardíaco' : '',
        paciente.diabetico ? 'Diabetes' : '',
        paciente.fumante ? 'Fumante' : '',
        paciente.gestante ? 'Gestante' : ''
      ].filter(Boolean),
      ultimaConsulta: paciente.historico_tratamento_odontologico || 'Não informado',
      problemasDentarios: paciente.queixa_principal ? [paciente.queixa_principal] : [],
      sensibilidade: paciente.higiene_bucal?.toLowerCase().includes('sensibilidade') ? 'Sim' : 'Não informado',
      habitos: [
        paciente.fumante ? 'Fumo' : '',
        paciente.aparelho_ortodontico ? 'Aparelho ortodôntico' : '',
        paciente.usa_protese ? 'Prótese' : ''
      ].filter(Boolean),
      higieneBucal: {
        escovacoes: this.extrairFrequencia(paciente.higiene_bucal),
        usoFioDental: paciente.higiene_bucal?.toLowerCase().includes('fio dental') ? 'Sim' : 'Não'
      }
    };
  }

  extrairFrequencia(texto: string | undefined): string {
    const match = texto?.match(/(\d+ vezes? ao dia)/i);
    return match ? match[1] : 'Não informado';
  }
}
