import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  activeButton: string = '';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveButton(event.urlAfterRedirects);
    });
  }

  updateActiveButton(url: string): void {
    if (url.includes('/initial')) {
      this.activeButton = 'agenda';
    } else if (url.includes('/pacientes')) {
      this.activeButton = 'pacientes';
    } else {
      this.activeButton = '';
    }
  }
  

  setActive(button: string): void {
    this.activeButton = button;
    
    if(button == "agenda"){
      this.router.navigate(['/initial']);
    }
    else if(button == "pacientes"){
      this.router.navigate(['/pacientes']);
    }
  }


}
