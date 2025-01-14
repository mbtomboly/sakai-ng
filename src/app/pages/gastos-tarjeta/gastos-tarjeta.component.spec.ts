import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosTarjetaComponent } from './gastos-tarjeta.component';

describe('GastosTarjetaComponent', () => {
  let component: GastosTarjetaComponent;
  let fixture: ComponentFixture<GastosTarjetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastosTarjetaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastosTarjetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
