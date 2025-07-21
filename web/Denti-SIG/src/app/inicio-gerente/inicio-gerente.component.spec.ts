import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioGerenteComponent } from './inicio-gerente.component';

describe('InicioGerenteComponent', () => {
  let component: InicioGerenteComponent;
  let fixture: ComponentFixture<InicioGerenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioGerenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioGerenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
