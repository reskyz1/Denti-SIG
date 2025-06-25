import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSecretaryComponent } from './register-secretary.component';

describe('RegisterSecretaryComponent', () => {
  let component: RegisterSecretaryComponent;
  let fixture: ComponentFixture<RegisterSecretaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterSecretaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterSecretaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
