import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicialSecretarioComponent } from './inicial-secretario.component';

describe('InicialSecretarioComponent', () => {
  let component: InicialSecretarioComponent;
  let fixture: ComponentFixture<InicialSecretarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicialSecretarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicialSecretarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
