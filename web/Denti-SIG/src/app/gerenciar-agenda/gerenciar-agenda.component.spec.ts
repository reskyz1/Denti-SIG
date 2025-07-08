import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarAgendaComponent } from './gerenciar-agenda.component';

describe('GerenciarAgendaComponent', () => {
  let component: GerenciarAgendaComponent;
  let fixture: ComponentFixture<GerenciarAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarAgendaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
