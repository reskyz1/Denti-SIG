import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core'
//import * as Calendario from "../src/javascripts/Calendario.js" ;


@Component({
  selector: 'app-gerenciar-agenda',
  imports: [],
  templateUrl: './gerenciar-agenda.component.html',
  styleUrl: './gerenciar-agenda.component.scss',
  encapsulation: ViewEncapsulation.None
  
})
export class GerenciarAgendaComponent {
  ngOnInit(): void {
    //Calendario.gerarCalendario();
  }
}
