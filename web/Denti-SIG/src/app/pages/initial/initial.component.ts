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
import {UsersApiService} from 'src/app/services/user.service';


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
  dentistas: Dentista[] = [];
  dentistaSelecionado?: Dentista
  popUp: boolean = false
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object,private dialog: MatDialog, private userService: UsersApiService) {
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
  }

  abrirPopupConsulta() {
  if (!this.popUp) {
    this.popUp = true;
    const dialogRef = this.dialog.open(AgendarConsultaComponent, {
      width: '650px',
      panelClass: 'custom-modal'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.popUp = false; 
    });
  }
}

  ngOnInit(): void {
  this.userService.listarDentistas().subscribe({
    next: (res) => {
      this.dentistas = res;

      if (isPlatformBrowser(this.platformId)) {
        const tipoUsuario = localStorage.getItem('tipo');
        const usuarioJson = localStorage.getItem('usuario');

        let dentista: Dentista | undefined;

        if (tipoUsuario === 'dentista' && usuarioJson) {
          const usuario = JSON.parse(usuarioJson);
          for (const d of this.dentistas) {
            if (d.id === usuario.id) {
              dentista = d;
              break;
            }
          }
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


}
