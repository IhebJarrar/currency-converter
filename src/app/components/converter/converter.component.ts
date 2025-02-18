import { inject, OnInit } from '@angular/core';
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
  styleUrl: './converter.component.scss',
  standalone: true
})
export class ConverterComponent{
  private converterService = inject(ConverterService);
  amount: number = 0;
  fixedRate: number = 0;
  currencyType: CurrencyType = 'EUR';
  history: ConversionHistory[] = [];

  get exchangeRate(): number {
    return this.converterService.exchangeRate();
  }

  get targetCurrency(): CurrencyType {
    return this.currencyType === 'EUR' ? 'USD' : 'EUR';
  }

  convertedAmount = computed(() => {
    let rate = this.converterService.currentRate();
    let result = this.currencyType === 'EUR' ? this.amount / rate : this.amount * rate;
    this.addToConversionHistory(this.amount, result);
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
