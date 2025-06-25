import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDentistComponent } from './register-dentist.component';

describe('RegisterDentistComponent', () => {
  let component: RegisterDentistComponent;
  let fixture: ComponentFixture<RegisterDentistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterDentistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterDentistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
