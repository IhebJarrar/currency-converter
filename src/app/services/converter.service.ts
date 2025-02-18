import { computed, Injectable, signal, Signal, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {
  private static readonly BASE_RATE = 1.1;
  private destroyRef = inject(DestroyRef);
  private _exchangeRate = signal(ConverterService.BASE_RATE);
  private _fixedRate = signal<number | null>(null);

  get exchangeRate(): Signal<number> {
    return this._exchangeRate.asReadonly();
  };

  get fixedRate(): Signal<number | null> {
    return this._fixedRate.asReadonly();
  };

  appliedRate = computed(() => {
    const currentRate = this.exchangeRate();
    const fixatedRate = this.fixedRate();
    if (fixatedRate && Math.abs(fixatedRate - currentRate) <= 0.02 * currentRate) {
      // should we restart fixated rate to initial value ?
      return fixatedRate;
    }
    return currentRate;
  });

  constructor() {
    this.initPolling();
  }

  private initPolling(): void {
    interval(3000).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      const variation = (Math.random() * 0.1) - 0.05;
      this._exchangeRate.set(ConverterService.BASE_RATE + variation);
    });
  }

  setFixedRate(fixedRate: number): void {
    this._fixedRate.set(fixedRate);
  }

  resetFixedRate(): void {
    this._fixedRate.set(null);
  }
}
