import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaConsultasComponent } from './lista-consultas.component';

describe('ListaConsultasComponent', () => {
  let component: ListaConsultasComponent;
  let fixture: ComponentFixture<ListaConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaConsultasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
