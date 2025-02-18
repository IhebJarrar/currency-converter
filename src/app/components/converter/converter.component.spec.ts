import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ConverterComponent } from './converter.component';
import { ConverterService } from '@services/converter.service';

describe('ConverterComponent', () => {
  let component: ConverterComponent;
  let fixture: ComponentFixture<ConverterComponent>;
  let converterService: ConverterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConverterComponent],
      providers: [ConverterService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConverterComponent);
    component = fixture.componentInstance;
    converterService = TestBed.inject(ConverterService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch between currencies (EUR/USD)', () => {
    component.selectedAmount = 100;
    component.currencyType = 'USD';
    expect(component.targetCurrency).toBe('EUR');
  });

  it('should add conversion to history array', <any>fakeAsync(() => {
    component.selectedAmount = 200;
    component.currencyType = 'EUR';
    fixture.detectChanges();
    tick(3000);
    expect(component.history.length).toBe(1);
    expect(component.history[0].initialAmount).toBe(200);
    expect(component.history[0].amountCurrency).toBe('EUR');
  }));

  it('should maintain only last 5 conversions in history', () => {
    for (let i = 0; i < 6; i++) {
      component.selectedAmount = 100 + i;
    }
    expect(component.history.length).toBe(5);
  });

  it('should use real rate when fixed rate variation exceeds 2%', fakeAsync(() => {
    component.fixedRate = 1.2;
    component.applyFixedRate();
    expect(converterService.appliedRate()).not.toBe(1.2);
  }));
});
