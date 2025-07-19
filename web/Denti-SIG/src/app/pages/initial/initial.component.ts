import { Component, Inject, PLATFORM_ID } from '@angular/core';
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
import { Dentista } from 'src/app/models/dentista';

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
    FullCalendarModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss'],
})
export class InitialComponent {
  selectedDate: Date = new Date();
  calendarOptions: CalendarOptions | undefined;
  eventList?: EventInput[];
  dentistas: Dentista[] = [];
  dentistaSelecionado?: Dentista 
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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

    const dentista1 : Dentista = {
      nome: "Luis Felipe",
      email: "luismarinho501@gmail.com",
      cpf: "70336034440",
      telefone: "(81)983089297",
      senha: "12345678",
      cro: "123",
      id:1
    };
    const dentista2: Dentista = {
      nome: "Ana Beatriz",
      email: "ana.bia@clinic.com",
      cpf: "12345678900",
      telefone: "(81)981234567",
      senha: "senhaAna123",
      cro: "456",
      id: 2
    };

    const dentista3: Dentista = {
      nome: "Carlos Eduardo",
      email: "carlos.edu@clinic.com",
      cpf: "98765432100",
      telefone: "(81)982345678",
      senha: "carlos2025",
      cro: "789",
      id: 3
    };

    const dentista4: Dentista = {
      nome: "Juliana Costa",
      email: "juliana.costa@clinic.com",
      cpf: "11223344556",
      telefone: "(81)980123456",
      senha: "julianaSecure!",
      cro: "321",
      id: 4
    };

    this.dentistas?.push(dentista1,dentista2,dentista3,dentista4)
  }

  selecionarDentista(dentista: Dentista){
    this.dentistaSelecionado = dentista;
  }

  abrirPopupConsulta() {
  console.log("Abrir popup de marcação de consulta");
  // futuro: abrir modal de cadastro
}
}
