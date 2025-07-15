import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  activeButton: string = '';

  constructor(){}
  

  setActive(button: string): void {
  this.activeButton = button;
  }
  

}
