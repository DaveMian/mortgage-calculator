import {
  CBEMortgageInputs,
  CBEFinancingArrangement,
  CBELoanType,
  CBELoanSummary,
  MonthlyBreakdown,
  AmortizationRow,
  AnnualAmortizationRow,
  ComparisonScenario,
  ArrangementComparison,
  CurrencySymbol,
  ExchangeRateInfo,
} from '../types/mortgage';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Fallback daily rate if network is unavailable (CBE indicative market rate)
 */
export const DEFAULT_DAILY_RATE_USD_TO_ETB = 161.35;

/**
 * Fetches the daily bank market exchange rate for USD to ETB
 */
export async function fetchLiveExchangeRate(): Promise<ExchangeRateInfo> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const etb = data?.rates?.ETB;
    const eur = data?.rates?.EUR;
    const gbp = data?.rates?.GBP;

    if (typeof etb === 'number' && etb > 50) {
      return {
        rateUSDToETB: Math.round(etb * 100) / 100,
        rateEURToETB: eur ? Math.round((etb / eur) * 100) / 100 : Math.round(etb * 1.08 * 100) / 100,
        rateGBPToETB: gbp ? Math.round((etb / gbp) * 100) / 100 : Math.round(etb * 1.28 * 100) / 100,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'live',
        isLoading: false,
      };
    }
  } catch (err: any) {
    console.warn('Could not fetch live exchange rate, using bank default:', err);
  }

  return {
    rateUSDToETB: DEFAULT_DAILY_RATE_USD_TO_ETB,
    rateEURToETB: Math.round(DEFAULT_DAILY_RATE_USD_TO_ETB * 1.08 * 100) / 100,
    rateGBPToETB: Math.round(DEFAULT_DAILY_RATE_USD_TO_ETB * 1.28 * 100) / 100,
    lastUpdated: 'Default Bank Rate',
    source: 'manual',
    isLoading: false,
  };
}

/**
 * Returns the official CBE Interest Rate based on Loan Type, Financing Arrangement, and Equity Contribution %
 */
export function getCBEOfficialInterestRate(
  loanType: CBELoanType,
  arrangement: CBEFinancingArrangement,
  equityPercent: number
): number {
  if (loanType === 'mortgage') {
    if (arrangement === 'FCY_FCY') {
      if (equityPercent >= 50) return 7.00;
      if (equityPercent >= 30) return 7.50;
      if (equityPercent >= 20) return 8.00;
      return 9.00; // 10% - 19.9%
    }
    if (arrangement === 'LCY_FCY') {
      if (equityPercent >= 50) return 8.00;
      if (equityPercent >= 30) return 9.00;
      if (equityPercent >= 20) return 10.00;
      return 11.00; // 10% - 19.9%
    }
    if (arrangement === 'FCY_LCY') {
      if (equityPercent >= 50) return 11.00;
      if (equityPercent >= 30) return 12.00;
      if (equityPercent >= 20) return 13.00;
      return 13.50; // 10% - 19.9%
    }
  }

  if (loanType === 'automobile') {
    if (arrangement === 'FCY_FCY') {
      if (equityPercent >= 50) return 7.50;
      if (equityPercent >= 30) return 8.00;
      if (equityPercent >= 20) return 8.50;
      return 9.00;
    }
    if (arrangement === 'LCY_FCY') {
      if (equityPercent >= 50) return 8.50;
      if (equityPercent >= 30) return 9.00;
      if (equityPercent >= 20) return 9.50;
      return 10.00;
    }
    if (arrangement === 'FCY_LCY') {
      if (equityPercent >= 50) return 10.00;
      if (equityPercent >= 30) return 10.50;
      if (equityPercent >= 20) return 11.00;
      return 12.00;
    }
  }

  if (loanType === 'mixed_use') {
    if (arrangement === 'FCY_FCY') {
      if (equityPercent >= 70) return 7.00;
      if (equityPercent >= 60) return 7.30;
      if (equityPercent >= 50) return 7.50;
      if (equityPercent >= 40) return 8.00;
      return 8.50;
    }
    if (arrangement === 'LCY_FCY') {
      if (equityPercent >= 70) return 9.00;
      if (equityPercent >= 60) return 9.50;
      if (equityPercent >= 50) return 10.00;
      if (equityPercent >= 40) return 10.50;
      return 11.00;
    }
    if (arrangement === 'FCY_LCY') {
      if (equityPercent >= 70) return 9.00;
      if (equityPercent >= 60) return 9.50;
      if (equityPercent >= 50) return 10.00;
      if (equityPercent >= 40) return 11.00;
      return 11.50;
    }
  }

  return 8.00;
}

/**
 * Monthly PI formula: M = P * (r*(1+r)^n)/((1+r)^n - 1)
 */
export function calculateMonthlyPI(principal: number, annualRatePercent: number, years: number): number {
  if (principal <= 0 || years <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  const totalPayments = years * 12;

  if (monthlyRate === 0) {
    return principal / totalPayments;
  }

  const factor = Math.pow(1 + monthlyRate, totalPayments);
  return (principal * (monthlyRate * factor)) / (factor - 1);
}

/**
 * Currency conversion using live daily rate
 */
export function convertCurrency(
  amount: number,
  from: CurrencySymbol,
  to: CurrencySymbol,
  rateUSDToETB: number
): number {
  if (from === to) return amount;
  if (from === 'USD ($)' && to === 'ETB (Birr)') return amount * rateUSDToETB;
  if (from === 'ETB (Birr)' && to === 'USD ($)') return amount / rateUSDToETB;
  if (from === 'EUR (€)' && to === 'ETB (Birr)') return amount * (rateUSDToETB * 1.08);
  if (from === 'GBP (£)' && to === 'ETB (Birr)') return amount * (rateUSDToETB * 1.28);
  if (from === 'ETB (Birr)' && to === 'EUR (€)') return amount / (rateUSDToETB * 1.08);
  if (from === 'ETB (Birr)' && to === 'GBP (£)') return amount / (rateUSDToETB * 1.28);
  return amount;
}

/**
 * Computes full mortgage results for CBE
 */
export function calculateCBEMortgage(inputs: CBEMortgageInputs): {
  summary: CBELoanSummary;
  monthlyBreakdown: MonthlyBreakdown;
  amortization: AmortizationRow[];
  annualAmortization: AnnualAmortizationRow[];
} {
  const effectiveRate = inputs.customInterestRate !== undefined
    ? inputs.customInterestRate
    : getCBEOfficialInterestRate(inputs.loanType, inputs.financingArrangement, inputs.equityPercent);

  const equityAmount = (inputs.homePrice * inputs.equityPercent) / 100;
  const loanAmount = Math.max(0, inputs.homePrice - equityAmount);

  // Default secondary currency is USD if base is ETB, or ETB if base is USD/EUR/GBP
  const isETB = inputs.baseCurrency === 'ETB (Birr)';
  const altCurrency: CurrencySymbol = isETB ? 'USD ($)' : 'ETB (Birr)';
  const loanAmountConverted = convertCurrency(loanAmount, inputs.baseCurrency, altCurrency, inputs.exchangeRateUSDToETB);

  const monthlyPI = calculateMonthlyPI(loanAmount, effectiveRate, inputs.loanTermYears);
  const monthlyPIConverted = convertCurrency(monthlyPI, inputs.baseCurrency, altCurrency, inputs.exchangeRateUSDToETB);

  const monthlyBreakdown: MonthlyBreakdown = {
    principalAndInterest: Math.round(monthlyPI * 100) / 100,
    principalAndInterestConverted: Math.round(monthlyPIConverted * 100) / 100,
    totalMonthly: Math.round(monthlyPI * 100) / 100,
  };

  const monthlyRate = effectiveRate / 100 / 12;
  const scheduledMonths = inputs.loanTermYears * 12;

  let baseBalance = loanAmount;
  let baseTotalInterest = 0;
  for (let m = 1; m <= scheduledMonths; m++) {
    if (baseBalance <= 0) break;
    const interest = monthlyRate === 0 ? 0 : baseBalance * monthlyRate;
    const principal = Math.min(baseBalance, monthlyPI - interest);
    baseTotalInterest += interest;
    baseBalance -= principal;
  }

  const amortization: AmortizationRow[] = [];
  const annualMap = new Map<number, { principal: number; interest: number; extra: number; payment: number; endingBalance: number; totalInterestPaid: number }>();

  let currentBalance = loanAmount;
  let totalInterestPaid = 0;
  let currentMonthIndex = inputs.startMonth - 1;
  let currentYear = inputs.startYear;
  let actualMonths = 0;

  for (let period = 1; period <= scheduledMonths; period++) {
    if (currentBalance <= 0.01) break;
    actualMonths++;

    const interest = monthlyRate === 0 ? 0 : currentBalance * monthlyRate;
    let scheduledPrincipal = monthlyPI - interest;
    let extra = inputs.extraMonthlyPayment || 0;
    let principalPayment = scheduledPrincipal + extra;
    let actualPayment = monthlyPI + extra;

    if (principalPayment >= currentBalance) {
      principalPayment = currentBalance;
      actualPayment = interest + principalPayment;
      extra = Math.max(0, principalPayment - scheduledPrincipal);
      currentBalance = 0;
    } else {
      currentBalance -= principalPayment;
    }

    totalInterestPaid += interest;

    const monthName = MONTH_NAMES[currentMonthIndex];
    amortization.push({
      period,
      monthName: `${monthName} ${currentYear}`,
      year: currentYear,
      payment: Math.round(actualPayment * 100) / 100,
      principal: Math.round(scheduledPrincipal * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      extraPayment: Math.round(extra * 100) / 100,
      balance: Math.max(0, Math.round(currentBalance * 100) / 100),
      totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    });

    const existing = annualMap.get(currentYear) || {
      principal: 0,
      interest: 0,
      extra: 0,
      payment: 0,
      endingBalance: 0,
      totalInterestPaid: 0,
    };
    existing.principal += scheduledPrincipal;
    existing.interest += interest;
    existing.extra += extra;
    existing.payment += actualPayment;
    existing.endingBalance = Math.max(0, currentBalance);
    existing.totalInterestPaid = totalInterestPaid;
    annualMap.set(currentYear, existing);

    currentMonthIndex++;
    if (currentMonthIndex >= 12) {
      currentMonthIndex = 0;
      currentYear++;
    }
  }

  const annualAmortization: AnnualAmortizationRow[] = Array.from(annualMap.entries()).map(
    ([year, val], idx) => ({
      year: idx + 1,
      calendarYear: year,
      principal: Math.round(val.principal * 100) / 100,
      interest: Math.round(val.interest * 100) / 100,
      extraPayment: Math.round(val.extra * 100) / 100,
      totalPayment: Math.round(val.payment * 100) / 100,
      endingBalance: Math.round(val.endingBalance * 100) / 100,
      totalInterestPaid: Math.round(val.totalInterestPaid * 100) / 100,
    })
  );

  const actualEndMonthIdx = (inputs.startMonth - 1 + actualMonths) % 12;
  const actualEndYear = inputs.startYear + Math.floor((inputs.startMonth - 1 + actualMonths) / 12);
  const payoffDate = `${MONTH_NAMES[actualEndMonthIdx]} ${actualEndYear}`;

  const interestSaved = Math.max(0, baseTotalInterest - totalInterestPaid);
  const monthsSaved = Math.max(0, scheduledMonths - actualMonths);

  const summary: CBELoanSummary = {
    loanAmount: Math.round(loanAmount * 100) / 100,
    loanAmountConverted: Math.round(loanAmountConverted * 100) / 100,
    equityAmount: Math.round(equityAmount * 100) / 100,
    equityPercent: inputs.equityPercent,
    interestRate: effectiveRate,
    monthlyPayment: Math.round(monthlyPI * 100) / 100,
    monthlyPaymentConverted: Math.round(monthlyPIConverted * 100) / 100,
    totalInterest: Math.round(totalInterestPaid * 100) / 100,
    totalPayments: Math.round((loanAmount + totalInterestPaid) * 100) / 100,
    payoffDate,
    totalMonths: scheduledMonths,
    actualMonths,
    interestSaved: Math.round(interestSaved * 100) / 100,
    yearsSaved: Math.round((monthsSaved / 12) * 10) / 10,
  };

  return { summary, monthlyBreakdown, amortization, annualAmortization };
}

/**
 * Compares the 3 CBE Diaspora Financing Arrangements
 */
export function compareCBEArrangements(inputs: CBEMortgageInputs): ArrangementComparison[] {
  const equityAmount = (inputs.homePrice * inputs.equityPercent) / 100;
  const loanAmount = Math.max(0, inputs.homePrice - equityAmount);

  const arrangements: CBEFinancingArrangement[] = ['FCY_FCY', 'LCY_FCY', 'FCY_LCY'];

  return arrangements.map((arr) => {
    const rate = getCBEOfficialInterestRate(inputs.loanType, arr, inputs.equityPercent);
    const monthly = calculateMonthlyPI(loanAmount, rate, inputs.loanTermYears);
    const totalPayments = monthly * inputs.loanTermYears * 12;
    const totalInterest = Math.max(0, totalPayments - loanAmount);

    let title = '';
    let description = '';
    if (arr === 'FCY_FCY') {
      title = 'FCY / FCY';
      description = 'Both equity contribution & repayment in Foreign Currency (USD, EUR, GBP)';
    } else if (arr === 'LCY_FCY') {
      title = 'LCY / FCY';
      description = 'Equity contribution in Ethiopian Birr, repayment in Foreign Currency';
    } else {
      title = 'FCY / LCY';
      description = 'Equity contribution in Foreign Currency, repayment in Ethiopian Birr';
    }

    return {
      arrangement: arr,
      title,
      description,
      interestRate: rate,
      monthlyPayment: Math.round(monthly * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalCost: Math.round(totalPayments * 100) / 100,
    };
  });
}

/**
 * Generates loan amount comparisons for different CBE borrowing amounts
 */
export function generateCBELoanAmountComparisons(
  baseInputs: CBEMortgageInputs,
  customAmounts?: number[]
): ComparisonScenario[] {
  const equityAmount = (baseInputs.homePrice * baseInputs.equityPercent) / 100;
  const baseLoanAmount = Math.max(0, baseInputs.homePrice - equityAmount);
  const isETB = baseInputs.baseCurrency === 'ETB (Birr)';
  const altCurrency: CurrencySymbol = isETB ? 'USD ($)' : 'ETB (Birr)';

  let defaultAmounts: number[] = [];
  if (isETB) {
    defaultAmounts = [
      Math.max(1000000, baseLoanAmount - 6000000),
      Math.max(1000000, baseLoanAmount - 3000000),
      baseLoanAmount,
      baseLoanAmount + 3000000,
      baseLoanAmount + 6000000,
      baseLoanAmount + 12000000,
    ];
  } else {
    defaultAmounts = [
      Math.max(25000, baseLoanAmount - 50000),
      Math.max(25000, baseLoanAmount - 25000),
      baseLoanAmount,
      baseLoanAmount + 25000,
      baseLoanAmount + 50000,
      baseLoanAmount + 100000,
    ];
  }

  const amounts = customAmounts && customAmounts.length > 0 ? customAmounts : defaultAmounts;
  const uniqueSorted = Array.from(new Set(amounts)).sort((a, b) => a - b);

  const rate = baseInputs.customInterestRate !== undefined
    ? baseInputs.customInterestRate
    : getCBEOfficialInterestRate(baseInputs.loanType, baseInputs.financingArrangement, baseInputs.equityPercent);

  return uniqueSorted.map((amt) => {
    const monthly = calculateMonthlyPI(amt, rate, baseInputs.loanTermYears);
    const totalPayments = monthly * baseInputs.loanTermYears * 12;
    const totalInterest = Math.max(0, totalPayments - amt);
    const convertedLoan = convertCurrency(amt, baseInputs.baseCurrency, altCurrency, baseInputs.exchangeRateUSDToETB);
    const convertedMonthly = convertCurrency(monthly, baseInputs.baseCurrency, altCurrency, baseInputs.exchangeRateUSDToETB);

    const isBase = Math.abs(amt - baseLoanAmount) < 1;

    return {
      id: `cbe-loan-${amt}`,
      label: isBase ? `Current Loan` : `${amt.toLocaleString()}`,
      loanAmount: amt,
      loanAmountConverted: Math.round(convertedLoan),
      equityAmount: Math.round((amt / (1 - baseInputs.equityPercent / 100)) * (baseInputs.equityPercent / 100)),
      interestRate: rate,
      loanTermYears: baseInputs.loanTermYears,
      monthlyPI: Math.round(monthly * 100) / 100,
      monthlyPIConverted: Math.round(convertedMonthly * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalCost: Math.round(totalPayments * 100) / 100,
      isBase,
    };
  });
}

/**
 * Formats currency with ETB as default
 */
export function formatCurrency(
  value: number,
  currency: CurrencySymbol = 'ETB (Birr)',
  decimals: number = 0
): string {
  if (isNaN(value) || !isFinite(value)) return `0`;
  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (currency === 'ETB (Birr)') return `${formatted} ETB`;
  if (currency === 'USD ($)') return `$${formatted}`;
  if (currency === 'EUR (€)') return `€${formatted}`;
  if (currency === 'GBP (£)') return `£${formatted}`;
  return `${formatted}`;
}
