export type CurrencyType = 'EUR' | 'USD';

export interface ConversionHistory {
    realRate: number,
    fixedRate: number | null,
    initialAmount: number,
    amountCurrency: CurrencyType,
    convertedAmount: number,
    convertedAmountCurrency: CurrencyType
}