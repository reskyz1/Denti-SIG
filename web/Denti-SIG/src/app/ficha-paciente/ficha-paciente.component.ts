import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- necessário para *ngIf
import { ActivatedRoute } from '@angular/router';
import { UsersApiService, Paciente, MensagemResposta } from '../services/user.service';
import { FormsModule } from '@angular/forms'; // <--- IMPORTANTE

@Component({
  selector: 'app-ficha-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- adicione isso aqui!
  templateUrl: './ficha-paciente.component.html',
  styleUrls: ['./ficha-paciente.component.scss']
})
export class FichaPacienteComponent implements OnInit {
  paciente: Paciente | null = null;
  anamnese: any = null;
  editando = false;
  pacienteBackup: Paciente | null = null; // para restaurar caso cancele
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
      condicoes: [
        paciente.problema_cardiaco ? 'Problema cardíaco' : '',
        paciente.diabetico ? 'Diabetes' : '',
        paciente.gestante ? 'Gestante' : ''
      ].filter(Boolean),
      sensibilidade: paciente.higiene_bucal?.toLowerCase().includes('sensibilidade') ? 'Sim' : 'Não informado',
      habitos: [
        paciente.fumante ? 'Fumo' : '',
        paciente.aparelho_ortodontico ? 'Aparelho ortodôntico' : '',
        paciente.usa_protese ? 'Prótese' : ''
      ].filter(Boolean),
      higieneBucal: {
        escovacoes: this.extrairFrequencia(paciente.higiene_bucal),
        usoFioDental: paciente.higiene_bucal?.toLowerCase().includes('fio dental') ? 'Sim' : 'Não'
      },
      observacoes: paciente.observacoes_gerais?.split(',').map(a => a.trim()) || []
    };
  }

  extrairFrequencia(texto: string | undefined): string {
    const match = texto?.match(/(\d+ vezes? ao dia)/i);
    return match ? match[1] : 'Não informado';
  }
  iniciarEdicao() {
    if (!this.paciente) return;
    this.pacienteBackup = JSON.parse(JSON.stringify(this.paciente)); // clone para backup
    this.editando = true;
  }

  cancelarEdicao() {
    this.paciente = this.pacienteBackup;
    this.pacienteBackup = null;
    this.editando = false;
  }

  salvar() {
    if (!this.paciente) return;

    this.usersService.editarPacienteInfoMedica(this.paciente.cpf, this.paciente).subscribe({
      next: (res: MensagemResposta) => {
        alert(res.mensagem);
        this.editando = false;
        this.pacienteBackup = null;
        window.location.reload();
      },
      error: (err) => {
        console.error('Erro ao salvar:', err);
        alert('Erro ao salvar informações do paciente.');
      }
    });
  }
}
