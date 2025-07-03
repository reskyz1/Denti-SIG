import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteProfile } from './paciente-profile';

describe('PacienteProfile', () => {
  let component: PacienteProfile;
  let fixture: ComponentFixture<PacienteProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
