import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioPacienteTesteComponent } from './inicio-paciente-teste.component';

describe('InicioPacienteTesteComponent', () => {
  let component: InicioPacienteTesteComponent;
  let fixture: ComponentFixture<InicioPacienteTesteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioPacienteTesteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioPacienteTesteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
