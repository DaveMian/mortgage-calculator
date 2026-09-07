import React from 'react';
import {
  ArrowRightLeft,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Award,
} from 'lucide-react';
import { CBEMortgageInputs, CurrencySymbol } from '../types/mortgage';
import {
  calculateMonthlyPI,
  formatCurrency,
  convertCurrency,
  getCBEOfficialInterestRate,
} from '../utils/mortgageCalculations';
import { Language } from '../utils/translations';

interface CurrencyAdvisorProps {
  inputs: CBEMortgageInputs;
  currency: CurrencySymbol;
  lang: Language;
}

export const CurrencyAdvisor: React.FC<CurrencyAdvisorProps> = ({
  inputs,
  currency,
  lang,
}) => {
  const isETB = inputs.baseCurrency === 'ETB (Birr)';
  const altCurrency: CurrencySymbol = isETB ? 'USD ($)' : 'ETB (Birr)';

  const equityAmount = (inputs.homePrice * inputs.equityPercent) / 100;
  const loanAmount = Math.max(0, inputs.homePrice - equityAmount);

  // Compare FCY/FCY vs FCY/LCY
  const rateFCY = getCBEOfficialInterestRate(inputs.loanType, 'FCY_FCY', inputs.equityPercent);
  const rateLCY = getCBEOfficialInterestRate(inputs.loanType, 'FCY_LCY', inputs.equityPercent);

  const monthlyFCY = calculateMonthlyPI(loanAmount, rateFCY, inputs.loanTermYears);
  const totalInterestFCY = Math.max(0, monthlyFCY * inputs.loanTermYears * 12 - loanAmount);

  const monthlyLCY = calculateMonthlyPI(loanAmount, rateLCY, inputs.loanTermYears);
  const totalInterestLCY = Math.max(0, monthlyLCY * inputs.loanTermYears * 12 - loanAmount);

  const interestDifference = totalInterestLCY - totalInterestFCY;
  const monthlyDifference = monthlyLCY - monthlyFCY;

  return (
    <div className="space-y-6">
      {/* Advisor Header */}
      <div className="bg-gradient-to-r from-[#2b0824] via-[#501344] to-[#6a1a5b] text-white p-6 sm:p-8 rounded-2xl shadow-md border border-[#80226f]/40">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e6af2e]/20 text-[#fcd34d] border border-[#e6af2e]/30 mb-3">
            <Lightbulb className="w-3.5 h-3.5" /> Diaspora Currency Strategy Advisor
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            FCY / FCY vs. FCY / LCY: Which Arrangement Should You Choose?
          </h2>
          <p className="text-xs sm:text-sm text-purple-100/90 mt-2 leading-relaxed">
            One of the most important decisions when taking a CBE diaspora loan is choosing whether to repay in **Foreign Currency (USD/EUR/GBP)** or in **Ethiopian Birr (ETB)**. Here is how they compare mathematically for your {formatCurrency(loanAmount, inputs.baseCurrency)} loan.
          </p>
        </div>
      </div>

      {/* Side by Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: FCY / FCY */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-[#6a1a5b] relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#6a1a5b] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            ★ Recommended for Earners Abroad
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <h3 className="text-lg font-black text-slate-900">Option A: FCY / FCY</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            You contribute your down payment in Foreign Currency and pay your monthly payments in Foreign Currency (USD, EUR, GBP).
          </p>

          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 space-y-3 mb-5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-semibold">CBE Interest Rate:</span>
              <strong className="text-base font-black text-[#501344]">{rateFCY}% APR</strong>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-semibold">Monthly Payment:</span>
              <strong className="text-base font-black text-[#6a1a5b]">
                {formatCurrency(monthlyFCY, inputs.baseCurrency)}/mo
              </strong>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-semibold">Total Lifetime Interest:</span>
              <strong className="text-sm font-black text-amber-800">
                {formatCurrency(totalInterestFCY, inputs.baseCurrency)}
              </strong>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-900 block">Key Advantages:</span>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>5.00% lower interest rate</strong> compared to Birr repayment.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Saves <strong>{formatCurrency(interestDifference, inputs.baseCurrency)}</strong> in lifetime interest!</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Direct remittance from overseas via CBE SWIFT or mobile transfer apps.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Card 2: FCY / LCY */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <h3 className="text-lg font-black text-slate-900">Option B: FCY / LCY</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            You contribute your down payment in Foreign Currency, but your monthly mortgage payments are settled in Ethiopian Birr (ETB).
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 mb-5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-semibold">CBE Interest Rate:</span>
              <strong className="text-base font-black text-slate-900">{rateLCY}% APR</strong>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-semibold">Monthly Payment:</span>
              <strong className="text-base font-black text-slate-800">
                {formatCurrency(monthlyLCY, inputs.baseCurrency)}/mo
              </strong>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-semibold">Total Lifetime Interest:</span>
              <strong className="text-sm font-black text-amber-900">
                {formatCurrency(totalInterestLCY, inputs.baseCurrency)}
              </strong>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-900 block">Key Considerations:</span>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span><strong>5.00% higher interest rate</strong> charged by CBE (13% vs 8%).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Ideal if you intend to rent out the property in Ethiopia and use local rental income (in ETB) to repay the loan.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Fixed Birr payment: if the Birr depreciates over 20 years, the foreign currency value of your monthly payment gets cheaper each year.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Strategic Decision Guide */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Strategic Recommendation for Diaspora Buyers</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
            <span className="font-extrabold text-[#501344] text-sm block">Choose FCY / FCY (8%) if:</span>
            <p className="text-slate-700 leading-relaxed">
              • Your primary income is earned abroad in USD, EUR, or GBP.<br />
              • You want the lowest total cost of borrowing and wish to save <strong>{formatCurrency(interestDifference, inputs.baseCurrency)}</strong>.<br />
              • You plan to pay off the mortgage faster using extra payments.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-extrabold text-slate-900 text-sm block">Choose FCY / LCY (13%) if:</span>
            <p className="text-slate-700 leading-relaxed">
              • You plan to lease or rent out the house in Ethiopia and let the rental tenants pay off your Birr mortgage.<br />
              • You expect high long-term local inflation and want a fixed debt denominated in Ethiopian Birr.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
