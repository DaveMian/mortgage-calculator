import { describe, it, expect } from 'vitest';
import {
  getCBEOfficialInterestRate,
  calculateMonthlyPI,
  convertCurrency,
  formatCurrency,
} from './mortgageCalculations';

describe('getCBEOfficialInterestRate', () => {
  it('returns 7.00% for FCY/FCY mortgage with 50% equity', () => {
    expect(getCBEOfficialInterestRate('mortgage', 'FCY_FCY', 50)).toBe(7.00);
  });

  it('returns 7.50% for FCY/FCY mortgage with 30% equity', () => {
    expect(getCBEOfficialInterestRate('mortgage', 'FCY_FCY', 30)).toBe(7.50);
  });

  it('returns 8.00% for FCY/FCY mortgage with 20% equity', () => {
    expect(getCBEOfficialInterestRate('mortgage', 'FCY_FCY', 20)).toBe(8.00);
  });

  it('returns 9.00% for FCY/FCY mortgage with 10% equity (lowest tier)', () => {
    expect(getCBEOfficialInterestRate('mortgage', 'FCY_FCY', 10)).toBe(9.00);
  });

  it('returns 13.50% for FCY/LCY mortgage with 10% equity (highest rate)', () => {
    expect(getCBEOfficialInterestRate('mortgage', 'FCY_LCY', 10)).toBe(13.50);
  });

  it('returns 8.00% for automobile FCY/FCY with 30% equity', () => {
    expect(getCBEOfficialInterestRate('automobile', 'FCY_FCY', 30)).toBe(8.00);
  });

  it('returns 7.00% for mixed_use FCY/FCY with 70% equity', () => {
    expect(getCBEOfficialInterestRate('mixed_use', 'FCY_FCY', 70)).toBe(7.00);
  });

  it('returns default 8.00% for unknown loan type', () => {
    // @ts-expect-error testing invalid loan type
    expect(getCBEOfficialInterestRate('unknown', 'FCY_FCY', 20)).toBe(8.00);
  });
});

describe('calculateMonthlyPI', () => {
  it('calculates monthly payment for 12M ETB at 8% for 20 years', () => {
    const result = calculateMonthlyPI(12_000_000, 8.00, 20);
    // Known expected: ~100,373 ETB/mo
    expect(result).toBeGreaterThan(100_000);
    expect(result).toBeLessThan(101_000);
  });

  it('returns 0 for zero principal', () => {
    expect(calculateMonthlyPI(0, 8.00, 20)).toBe(0);
  });

  it('returns 0 for zero years', () => {
    expect(calculateMonthlyPI(12_000_000, 8.00, 0)).toBe(0);
  });

  it('handles 0% interest rate (divides principal evenly)', () => {
    const result = calculateMonthlyPI(120_000, 0, 10); // 120K / 120 months
    expect(result).toBe(1000);
  });

  it('short loan: 1 year at 10%, 1M principal', () => {
    const result = calculateMonthlyPI(1_000_000, 10.00, 1);
    // Monthly payment should be well above 83K (simple division)
    expect(result).toBeGreaterThan(83_000);
    expect(result).toBeLessThan(100_000);
  });

  it('round-trip: total payments match amortization formula', () => {
    const principal = 12_000_000;
    const rate = 8.00;
    const years = 20;
    const monthly = calculateMonthlyPI(principal, rate, years);
    const totalPayments = monthly * years * 12;
    const totalInterest = totalPayments - principal;
    // Total interest for 12M at 8% over 20 years should be ~12M
    expect(totalInterest).toBeGreaterThan(11_000_000);
    expect(totalInterest).toBeLessThan(13_000_000);
  });
});

describe('convertCurrency', () => {
  const rate = 161.35; // USD to ETB

  it('converts ETB to USD', () => {
    const result = convertCurrency(12_000_000, 'ETB (Birr)', 'USD ($)', rate);
    expect(result).toBeCloseTo(12000000 / rate, 0);
  });

  it('converts USD to ETB', () => {
    const result = convertCurrency(1000, 'USD ($)', 'ETB (Birr)', rate);
    expect(result).toBe(1000 * rate);
  });

  it('converts EUR to ETB', () => {
    const result = convertCurrency(100, 'EUR (€)', 'ETB (Birr)', rate);
    expect(result).toBeCloseTo(100 * rate * 1.08, 2);
  });

  it('converts GBP to ETB', () => {
    const result = convertCurrency(100, 'GBP (£)', 'ETB (Birr)', rate);
    expect(result).toBe(100 * rate * 1.28);
  });

  it('returns same amount when from === to', () => {
    expect(convertCurrency(5000, 'ETB (Birr)', 'ETB (Birr)', rate)).toBe(5000);
    expect(convertCurrency(500, 'USD ($)', 'USD ($)', rate)).toBe(500);
  });
});

describe('formatCurrency', () => {
  it('formats ETB with commas and currency label by default', () => {
    expect(formatCurrency(12000000)).toBe('12,000,000 ETB');
  });

  it('formats with 2 decimals for cents', () => {
    const result = formatCurrency(12345.67, 'ETB (Birr)', 2);
    expect(result).toContain('12,345');
  });

  it('returns "0" for NaN', () => {
    expect(formatCurrency(NaN)).toBe('0');
  });

  it('returns "0" for Infinity', () => {
    expect(formatCurrency(Infinity)).toBe('0');
  });
});