import { inject } from '@angular/core';
import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConverterService } from '@services/converter.service';
import { ConversionHistory, CurrencyType } from '@models/converter.model';
import { ConverterHistoryComponent } from '@components/converter-history/converter-history.component';

@Component({
  selector: 'app-converter',
  imports: [CommonModule, FormsModule, ConverterHistoryComponent],
  templateUrl: './converter.component.html',
  styles: [`
    .converter-container {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #cccccc4f;
      border-radius: 10px;
    }  
  `],
  standalone: true
})
export class ConverterComponent{
  private converterService = inject(ConverterService);
  private _lastConvertedAmount: number = 0;
  private _currencyType: CurrencyType = 'EUR';
  selectedAmount: number = 0;
  fixedRate: number = 0;
  history: ConversionHistory[] = [];

  get exchangeRate(): number {
    return this.converterService.exchangeRate();
  }

  get currencyType(): CurrencyType {
    return this._currencyType;
  }

  set currencyType(currency: CurrencyType) {
    if (currency !== this._currencyType) {
      this._currencyType = currency;
      this.selectedAmount = +this._lastConvertedAmount.toFixed(2);
    }
  }

  get targetCurrency(): CurrencyType {
    return this.currencyType === 'EUR' ? 'USD' : 'EUR';
  }

  convertedAmount = computed(() => {
    let rate = this.converterService.appliedRate();
    let result = this.currencyType === 'EUR' ? this.selectedAmount / rate : this.selectedAmount * rate;
    this._lastConvertedAmount = result;
    result ? this.addToConversionHistory(this.selectedAmount, result) : null;
    return result;
  });

  addToConversionHistory(usedAmount: number, conversionResult: number): void {
    const fixedRate = this.converterService.fixedRate();
    const realRate = this.converterService.exchangeRate();
    const entry: ConversionHistory = {
      realRate,
      fixedRate,
      initialAmount: usedAmount,
      amountCurrency: this.currencyType,
      convertedAmount: conversionResult,
      convertedAmountCurrency: this.targetCurrency
    }
    // I was thinking by using signal to be consistent, but we can't update a signal within computed function
    // computed signal are ReadableSignal
    // Maybe use LinkedSignal: to check
    this.history.unshift(entry);
    if (this.history.length > 5) {
      this.history.pop();
    }
  }

  applyFixedRate(): void {
    if (this.fixedRate) {
      this.converterService.setFixedRate(this.fixedRate);
    }
  }

  resetFixedRate(): void {
    this.converterService.resetFixedRate();
    this.fixedRate = 0;
  }
}
