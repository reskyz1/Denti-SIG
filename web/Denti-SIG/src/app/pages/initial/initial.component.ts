import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; 
import ptLocale from '@fullcalendar/core/locales/pt-br';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { EventInput } from '@fullcalendar/core';
import { Dentista } from 'src/app/services/user.service';
import { AgendarConsultaComponent } from 'src/app/shared/agendar-consulta/agendar-consulta.component';
import { MatDialog } from '@angular/material/dialog';
import {UsersApiService, ConsultasApiService} from 'src/app/services/user.service';
import {ConsultaRetornada} from 'src/app/models/consultaRetornada';
import {Paciente} from 'src/app/models/paciente';

@Component({
  selector: 'app-initial',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FullCalendarModule,
    AgendarConsultaComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss'],
})
export class InitialComponent implements OnInit{
  selectedDate: Date = new Date();
  calendarOptions: CalendarOptions | undefined;
  eventList?: EventInput[];
  pacientes: Paciente[] = [];
  consultas: ConsultaRetornada[] = [];
  consultasDentista: ConsultaRetornada[] = [];
  dentistas: Dentista[] = [];
  dentistaSelecionado?: Dentista
  popUp: boolean = false
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private dialog: MatDialog, private userService: UsersApiService, private consultaService: ConsultasApiService) {
    if (isPlatformBrowser(this.platformId)) {
      this.calendarOptions = {
        initialView: 'timeGridWeek',
        plugins: [dayGridPlugin, timeGridPlugin],
        allDaySlot: false,
        slotMinTime: '07:00:00',
        slotMaxTime: '21:00:00',
        slotDuration: '00:15:00',
        slotLabelInterval: '01:00:00',
        locale: ptLocale,
       titleFormat: { year: 'numeric', month: 'long' },
       height: 'auto'
      };
    }
  }

  selecionarDentista(dentista: Dentista){
    this.dentistaSelecionado = dentista;
    this.filtrarConsultasPorDentista();
  }

  abrirPopupConsulta() {
  if (!this.popUp) {
    this.popUp = true;
    const dialogRef = this.dialog.open(AgendarConsultaComponent, {
      width: '650px',
      panelClass: 'custom-modal'
    });

    dialogRef.afterClosed().subscribe((novaConsulta) => {
      this.popUp = false; 

      if (novaConsulta) {
       this.carregarConsultasComPacientes();
      }
    });
  }
}


getNomePacientePorId(id: number): string {
    const paciente = this.pacientes.find(p => p.id === id);
    return paciente ? paciente.nome : 'Paciente não encontrado';
  }
  

  montarEventos(consultas: ConsultaRetornada[]): EventInput[] {
    return consultas.map((consulta) => ({
      title: `${this.getNomePacientePorId(consulta.paciente_id)}`,
      start: consulta.inicio,
      end: consulta.fim
    }));
  }

  carregarDentistas(): void {
  this.userService.listarDentistas().subscribe({
    next: (res) => {
      this.dentistas = res;

      if (isPlatformBrowser(this.platformId)) {
        const tipoUsuario = localStorage.getItem('tipo');
        const usuarioJson = localStorage.getItem('usuario');

        let dentista: Dentista | undefined;

        if (tipoUsuario === 'dentista' && usuarioJson) {
          const usuario = JSON.parse(usuarioJson);
          dentista = this.dentistas.find(d => d.id === usuario.id);
        } else {
          dentista = this.dentistas[0];
        }

        if (dentista) {
          this.selecionarDentista(dentista);
        }
      }
    },
    error: (error) => {
      console.error('erro ao buscar os dentistas', error);
    }
  });
}


  carregarConsultasComPacientes(): void {
    this.consultaService.listarConsultas().subscribe({
      next: (res) => {
        this.consultas = res;

        this.userService.listarPacientesNormal().subscribe({
          next: (res) => {
            this.pacientes = res;

            if (this.calendarOptions) {
             this.filtrarConsultasPorDentista();
            }
         },
          error: (error) => {
           console.error('Erro ao buscar pacientes', error);
          }
        });
      },
       error: (error) => {
        console.error('Erro ao buscar consultas', error);
      }
    });
}

filtrarConsultasPorDentista(): void {
  if (!this.dentistaSelecionado) return;
  console.log('as minhas consultas são')
  console.log(this.consultas)
  this.consultasDentista = this.consultas.filter(
    (consulta) => consulta.dentista_id === this.dentistaSelecionado!.id
  );

  if (this.calendarOptions) {
    console.log(this.consultasDentista);
    this.calendarOptions.events = this.montarEventos(this.consultasDentista);
  }
}


  ngOnInit(): void {
  this.carregarDentistas();
  this.carregarConsultasComPacientes();
}


}
