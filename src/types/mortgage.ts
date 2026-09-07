export type CurrencySymbol = 'ETB (Birr)' | 'USD ($)' | 'EUR (€)' | 'GBP (£)';

export type CBEFinancingArrangement = 'FCY_FCY' | 'LCY_FCY' | 'FCY_LCY';

export type CBELoanType = 'mortgage' | 'automobile' | 'mixed_use';

export interface ExchangeRateInfo {
  rateUSDToETB: number;
  rateEURToETB: number;
  rateGBPToETB: number;
  lastUpdated: string;
  source: 'live' | 'manual';
  isLoading: boolean;
  error?: string;
}

export interface CBEMortgageInputs {
  loanType: CBELoanType;
  financingArrangement: CBEFinancingArrangement;
  homePrice: number; // In selected base currency (Default ETB)
  equityPercent: number; // 10%, 20%, 30%, 50%
  customInterestRate?: number; // Override if desired
  loanTermYears: number; // Max 20 years for mortgage
  baseCurrency: CurrencySymbol; // Default 'ETB (Birr)'
  exchangeRateUSDToETB: number; // e.g. 161.35 ETB per 1 USD
  startMonth: number;
  startYear: number;
  extraMonthlyPayment: number;
}

export interface MonthlyBreakdown {
  principalAndInterest: number;
  principalAndInterestConverted: number; // In the alternate currency
  totalMonthly: number;
}

export interface CBELoanSummary {
  loanAmount: number;
  loanAmountConverted: number;
  equityAmount: number;
  equityPercent: number;
  interestRate: number;
  monthlyPayment: number;
  monthlyPaymentConverted: number;
  totalInterest: number;
  totalPayments: number;
  payoffDate: string;
  totalMonths: number;
  actualMonths: number;
  interestSaved: number;
  yearsSaved: number;
}

export interface AmortizationRow {
  period: number;
  monthName: string;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  balance: number;
  totalInterestPaid: number;
}

export interface AnnualAmortizationRow {
  year: number;
  calendarYear: number;
  principal: number;
  interest: number;
  extraPayment: number;
  totalPayment: number;
  endingBalance: number;
  totalInterestPaid: number;
}

export interface ComparisonScenario {
  id: string;
  label: string;
  loanAmount: number;
  loanAmountConverted: number;
  equityAmount: number;
  interestRate: number;
  loanTermYears: number;
  monthlyPI: number;
  monthlyPIConverted: number;
  totalInterest: number;
  totalCost: number;
  isBase?: boolean;
}

export interface ArrangementComparison {
  arrangement: CBEFinancingArrangement;
  title: string;
  description: string;
  interestRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
}
