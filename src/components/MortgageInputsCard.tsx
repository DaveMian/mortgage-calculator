import React from 'react';
import {
  Home,
  Car,
  Building,
  Info,
  Layers,
  Sparkles,
  ArrowRightLeft,
  RefreshCw,
  Zap,
} from 'lucide-react';
import {
  CBEMortgageInputs,
  CBEFinancingArrangement,
  CBELoanType,
  CurrencySymbol,
  ExchangeRateInfo,
} from '../types/mortgage';
import {
  getCBEOfficialInterestRate,
  formatCurrency,
  convertCurrency,
} from '../utils/mortgageCalculations';

interface MortgageInputsCardProps {
  inputs: CBEMortgageInputs;
  onChange: (inputs: CBEMortgageInputs) => void;
  currency: CurrencySymbol;
  exchangeRateInfo: ExchangeRateInfo;
  onRefreshRate: () => void;
}

export const MortgageInputsCard: React.FC<MortgageInputsCardProps> = ({
  inputs,
  onChange,
  currency,
  exchangeRateInfo,
  onRefreshRate,
}) => {
  const isETB = inputs.baseCurrency === 'ETB (Birr)';
  const altCurrency: CurrencySymbol = isETB ? 'USD ($)' : 'ETB (Birr)';

  const equityAmount = (inputs.homePrice * inputs.equityPercent) / 100;
  const loanAmount = Math.max(0, inputs.homePrice - equityAmount);
  const loanAmountConverted = convertCurrency(
    loanAmount,
    inputs.baseCurrency,
    altCurrency,
    inputs.exchangeRateUSDToETB
  );

  const officialRate = getCBEOfficialInterestRate(
    inputs.loanType,
    inputs.financingArrangement,
    inputs.equityPercent
  );

  const handlePriceChange = (val: number) => {
    onChange({ ...inputs, homePrice: Math.max(0, val) });
  };

  const handleEquityChange = (pct: number) => {
    onChange({ ...inputs, equityPercent: pct, customInterestRate: undefined });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-slate-900">CBE Loan Parameters</h2>
          <p className="text-xs text-slate-500">Commercial Bank of Ethiopia Diaspora Credit Facilities</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Loan Amount (Principal)
          </span>
          <span className="text-base font-black text-[#6a1a5b]">
            {formatCurrency(loanAmount, inputs.baseCurrency)}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 block">
            ≈ {formatCurrency(loanAmountConverted, altCurrency)}
          </span>
        </div>
      </div>

      {/* Daily Bank Rate Card */}
      <div className="bg-gradient-to-r from-purple-50 via-amber-50/50 to-purple-50 p-3.5 rounded-xl border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#501344] text-[#e6af2e] rounded-lg">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#501344] uppercase tracking-wide">
                Bank Daily Exchange Rate:
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                1 USD = {inputs.exchangeRateUSDToETB.toFixed(2)} ETB
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Source: {exchangeRateInfo.source === 'live' ? 'Live Bank Market Rate' : 'CBE Indicative Rate'} (Updated: {exchangeRateInfo.lastUpdated})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={onRefreshRate}
            disabled={exchangeRateInfo.isLoading}
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-purple-100 text-[#501344] rounded-lg text-xs font-bold border border-purple-200 shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${exchangeRateInfo.isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Rate</span>
          </button>
        </div>
      </div>

      {/* 1. Loan Product Type */}
      <div>
        <label className="text-xs font-black text-slate-700 block mb-2 uppercase tracking-wide">
          1. Select CBE Diaspora Loan Product
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() =>
              onChange({
                ...inputs,
                loanType: 'mortgage',
                loanTermYears: Math.min(20, inputs.loanTermYears),
                equityPercent: Math.max(10, inputs.equityPercent),
              })
            }
            className={`p-2.5 rounded-xl text-center border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
              inputs.loanType === 'mortgage'
                ? 'bg-[#501344] text-white border-[#501344] shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Residential Mortgage</span>
            <span className="text-[10px] opacity-80">Up to 20 yrs</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onChange({
                ...inputs,
                loanType: 'automobile',
                loanTermYears: Math.min(7, inputs.loanTermYears),
                equityPercent: Math.max(15, inputs.equityPercent),
              })
            }
            className={`p-2.5 rounded-xl text-center border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
              inputs.loanType === 'automobile'
                ? 'bg-[#501344] text-white border-[#501344] shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Automobile Loan</span>
            <span className="text-[10px] opacity-80">5-7 yrs</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onChange({
                ...inputs,
                loanType: 'mixed_use',
                loanTermYears: Math.min(15, inputs.loanTermYears),
                equityPercent: Math.max(30, inputs.equityPercent),
              })
            }
            className={`p-2.5 rounded-xl text-center border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
              inputs.loanType === 'mixed_use'
                ? 'bg-[#501344] text-white border-[#501344] shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Mixed-Use Building</span>
            <span className="text-[10px] opacity-80">Up to 15 yrs</span>
          </button>
        </div>
      </div>

      {/* 2. Financing Arrangement (Page 4 of CBE Brochure) */}
      <div>
        <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-wide">
          2. Financing Arrangement (Repayment Currency)
        </label>
        <div className="space-y-2">
          {[
            {
              id: 'FCY_FCY' as CBEFinancingArrangement,
              title: 'FCY / FCY',
              badge: 'Lowest Interest (7% - 9%)',
              desc: 'Both equity contribution & monthly repayment in Foreign Currency (USD, EUR, GBP)',
            },
            {
              id: 'LCY_FCY' as CBEFinancingArrangement,
              title: 'LCY / FCY',
              badge: 'Mid Interest (8% - 11%)',
              desc: 'Equity contribution in Ethiopian Birr (ETB), monthly repayment in Foreign Currency',
            },
            {
              id: 'FCY_LCY' as CBEFinancingArrangement,
              title: 'FCY / LCY',
              badge: 'Repay in Birr (11% - 13.5%)',
              desc: 'Equity contribution in Foreign Currency, monthly repayment in Ethiopian Birr (ETB)',
            },
          ].map((item) => (
            <label
              key={item.id}
              onClick={() => onChange({ ...inputs, financingArrangement: item.id })}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                inputs.financingArrangement === item.id
                  ? 'bg-purple-50/70 border-[#6a1a5b] shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <input
                type="radio"
                name="financingArrangement"
                checked={inputs.financingArrangement === item.id}
                onChange={() => onChange({ ...inputs, financingArrangement: item.id })}
                className="mt-0.5 text-[#6a1a5b] focus:ring-[#6a1a5b]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">{item.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e6af2e]/20 text-[#855e09] border border-[#e6af2e]/40">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Property / House Value (In ETB by default) */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-sm font-bold text-slate-800">
            {inputs.loanType === 'mortgage'
              ? 'Residential Property Value'
              : inputs.loanType === 'automobile'
              ? 'Vehicle Purchase Price'
              : 'Building Estimation Value'}
          </label>
          <span className="text-xs font-extrabold text-[#6a1a5b]">
            {formatCurrency(inputs.homePrice, inputs.baseCurrency)}
          </span>
        </div>
        <div className="relative rounded-xl shadow-sm">
          <input
            type="number"
            min="500000"
            step={isETB ? '500000' : '5000'}
            value={inputs.homePrice}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-black text-base focus:bg-white focus:ring-2 focus:ring-[#6a1a5b] focus:border-[#6a1a5b] transition-all"
          />
        </div>
        <input
          type="range"
          min={isETB ? 2000000 : 25000}
          max={isETB ? 40000000 : 350000}
          step={isETB ? 500000 : 5000}
          value={Math.min(inputs.homePrice, isETB ? 40000000 : 350000)}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full mt-2.5 accent-[#6a1a5b]"
        />
        <div className="flex justify-between items-center mt-1 text-[11px] text-slate-500 font-medium">
          <span>Converted: ≈ {formatCurrency(convertCurrency(inputs.homePrice, inputs.baseCurrency, altCurrency, inputs.exchangeRateUSDToETB), altCurrency)}</span>
          <span>Bank Rate: 1 USD = {inputs.exchangeRateUSDToETB} ETB</span>
        </div>
      </div>

      {/* 4. Equity Contribution (10%, 20%, 30%, 50%) */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-sm font-bold text-slate-800">
            Equity Contribution (Down Payment)
          </label>
          <span className="text-xs font-black text-[#6a1a5b]">
            {inputs.equityPercent}% ({formatCurrency(equityAmount, inputs.baseCurrency)})
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-2">
          {[10, 20, 30, 50].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => handleEquityChange(pct)}
              className={`py-2 px-1 text-center rounded-xl text-xs font-extrabold border transition-all ${
                inputs.equityPercent === pct
                  ? 'bg-[#6a1a5b] text-white border-[#6a1a5b] shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {pct}% Equity
            </button>
          ))}
        </div>

        {/* Official CBE Rate Indicator */}
        <div className="mt-2.5 p-3 rounded-xl bg-purple-50/80 border border-purple-200/80 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-[#501344] block">Official CBE Interest Rate:</span>
            <span className="text-slate-600 text-[11px]">
              Based on {inputs.financingArrangement.replace('_', '/')} & {inputs.equityPercent}% equity
            </span>
          </div>
          <span className="text-lg font-black text-[#6a1a5b]">
            {officialRate.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* 5. Loan Tenure */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-sm font-bold text-slate-800">Loan Tenure</label>
          <span className="text-xs font-bold text-slate-600">{inputs.loanTermYears} Years</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[5, 10, 15, 20].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onChange({ ...inputs, loanTermYears: term })}
              className={`py-2 text-center rounded-xl text-xs font-extrabold border transition-all ${
                inputs.loanTermYears === term
                  ? 'bg-[#6a1a5b] text-white border-[#6a1a5b] shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {term} Yrs
            </button>
          ))}
        </div>
      </div>

      {/* Custom exchange rate adjuster */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-500 font-medium">
          <ArrowRightLeft className="w-3.5 h-3.5 text-[#6a1a5b]" />
          <span>Edit Bank Rate (1 USD):</span>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            step="0.5"
            value={inputs.exchangeRateUSDToETB}
            onChange={(e) => onChange({ ...inputs, exchangeRateUSDToETB: Math.max(1, Number(e.target.value)) })}
            className="w-24 px-2 py-1 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg text-right"
          />
          <span className="text-slate-600 font-bold">ETB</span>
        </div>
      </div>
    </div>
  );
};
