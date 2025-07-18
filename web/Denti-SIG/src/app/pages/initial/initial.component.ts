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
  eventList?: EventInput[]
  
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
  }

 
}
