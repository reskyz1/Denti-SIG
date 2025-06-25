import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicialDentistaComponent } from './inicial-dentista.component';

describe('InicialDentistaComponent', () => {
  let component: InicialDentistaComponent;
  let fixture: ComponentFixture<InicialDentistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicialDentistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicialDentistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
