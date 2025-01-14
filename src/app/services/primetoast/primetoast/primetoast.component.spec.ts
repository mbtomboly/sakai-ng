import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimetoastComponent } from './primetoast.component';

describe('PrimetoastComponent', () => {
  let component: PrimetoastComponent;
  let fixture: ComponentFixture<PrimetoastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimetoastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimetoastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
