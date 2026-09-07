import React, { useState } from 'react';
import {
  PiggyBank,
  TrendingUp,
  Sparkles,
  Calendar,
  DollarSign,
  CheckCircle2,
  ExternalLink,
  Percent,
  Check,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CBEMortgageInputs, CurrencySymbol } from '../types/mortgage';
import { formatCurrency, convertCurrency } from '../utils/mortgageCalculations';
import { Language, translations } from '../utils/translations';

interface SavingsGoalPlannerProps {
  inputs: CBEMortgageInputs;
  currency: CurrencySymbol;
  lang: Language;
  onGoToCalculator?: () => void;
}

export const SavingsGoalPlanner: React.FC<SavingsGoalPlannerProps> = ({
  inputs,
  currency,
  lang,
  onGoToCalculator,
}) => {
  const isETB = inputs.baseCurrency === 'ETB (Birr)';
  const altCurrency: CurrencySymbol = isETB ? 'USD ($)' : 'ETB (Birr)';

  // Required equity from current mortgage inputs
  const targetEquity = (inputs.homePrice * inputs.equityPercent) / 100;

  // Monthly deposit state (default ~50,000 ETB or $400 USD)
  const defaultMonthlyDeposit = isETB ? 50000 : 400;
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(defaultMonthlyDeposit);
  const [initialBalance, setInitialBalance] = useState<number>(0);

  // CBE Diaspora Mortgage Saving Account annual interest rate = 7%
  const savingRate = 0.07;
  const monthlyRate = savingRate / 12;

  // Simulate month by month growth
  let balance = initialBalance;
  let totalDeposited = initialBalance;
  let totalInterestEarned = 0;
  let monthsCount = 0;

  const chartData = [];
  chartData.push({
    month: 0,
    label: 'Start',
    deposits: Math.round(totalDeposited),
    interest: 0,
    balance: Math.round(balance),
  });

  while (balance < targetEquity && monthsCount < 120) {
    monthsCount++;
    balance += monthlyDeposit;
    totalDeposited += monthlyDeposit;

    const interest = balance * monthlyRate;
    balance += interest;
    totalInterestEarned += interest;

    if (monthsCount % 3 === 0 || balance >= targetEquity || monthsCount <= 12) {
      chartData.push({
        month: monthsCount,
        label: `M${monthsCount}`,
        deposits: Math.round(totalDeposited),
        interest: Math.round(totalInterestEarned),
        balance: Math.round(balance),
      });
    }
  }

  const yearsCount = Math.floor(monthsCount / 12);
  const remainingMonths = monthsCount % 12;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#501344] via-[#6a1a5b] to-[#80226f] text-white p-6 sm:p-8 rounded-2xl shadow-md border border-[#80226f]/40">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e6af2e]/20 text-[#fcd34d] border border-[#e6af2e]/30 mb-3">
            <PiggyBank className="w-3.5 h-3.5" /> CBE Diaspora Mortgage Saving Account (7% Interest)
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {lang === 'am' ? 'የሞርጌጅ ቅድመ ክፍያ ማከማቻ እቅድ' : 'Plan Your Down Payment Savings at 7% Interest'}
          </h2>
          <p className="text-xs sm:text-sm text-purple-100/90 mt-2 leading-relaxed">
            {lang === 'am'
              ? 'የኢትዮጵያ ንግድ ባንክ ለዳያስፖራ ደንበኞች በዓመት 7% ወለድ የሚከፍል ልዩ የሞርጌጅ ቁጠባ ሒሳብ ያቀርባል። ይህ እቅድ የቤት መግዣ ቅድመ ክፍያዎን በምን ያህል ጊዜ ማሟላት እንደሚችሉ ያሳያል።'
              : 'Commercial Bank of Ethiopia offers a dedicated Diaspora Mortgage Saving Account yielding a 7% annual interest rate. Use this planner to project how quickly you can accumulate your required equity contribution.'}
          </p>
        </div>
      </div>

      {/* Input Controls & Outcome Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Controls */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Savings Parameters</h3>
            <span className="text-xs font-bold text-[#6a1a5b] bg-purple-50 px-2 py-0.5 rounded-full">
              7.00% Annual APY
            </span>
          </div>

          {/* Target Down Payment Goal */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Target Down Payment</label>
              <span className="text-xs font-black text-[#501344]">
                {formatCurrency(targetEquity, inputs.baseCurrency)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Based on {inputs.equityPercent}% equity for your {formatCurrency(inputs.homePrice, inputs.baseCurrency)} property.
            </p>
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between">
              <span className="text-xs text-slate-700 font-semibold">Foreign Currency Goal:</span>
              <span className="text-xs font-black text-[#6a1a5b]">
                ≈ {formatCurrency(convertCurrency(targetEquity, inputs.baseCurrency, altCurrency, inputs.exchangeRateUSDToETB), altCurrency)}
              </span>
            </div>
          </div>

          {/* Planned Monthly Deposit */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Monthly Deposit Amount</label>
              <span className="text-xs font-black text-[#6a1a5b]">
                {formatCurrency(monthlyDeposit, inputs.baseCurrency)}/mo
              </span>
            </div>
            <div className="relative rounded-xl shadow-sm">
              <input
                type="number"
                min="50"
                step={isETB ? '5000' : '50'}
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Math.max(10, Number(e.target.value)))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#6a1a5b]"
              />
            </div>
            {/* Quick chips */}
            <div className="flex gap-2 mt-2">
              {(isETB ? [25000, 50000, 100000, 200000] : [250, 500, 1000, 1500]).map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setMonthlyDeposit(amt)}
                  className={`flex-1 py-1 text-xs rounded-lg font-bold border transition-all cursor-pointer ${
                    monthlyDeposit === amt
                      ? 'bg-[#6a1a5b] text-white border-[#6a1a5b]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {formatCurrency(amt, inputs.baseCurrency)}
                </button>
              ))}
            </div>
          </div>

          {/* Initial Starting Balance */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
              Current Savings Balance (Optional)
            </label>
            <input
              type="number"
              min="0"
              step={isETB ? '50000' : '500'}
              value={initialBalance}
              onChange={(e) => setInitialBalance(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#6a1a5b]"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold block">💡 CBE Account Feature:</span>
            <p className="text-[11px] text-amber-800 leading-snug">
              Under CBE rules, deposits into your Diaspora Mortgage Saving account count directly toward your required equity contribution when applying for the mortgage loan!
            </p>
          </div>
        </div>

        {/* Right: Results & Trajectory */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                  Time to Reach Target Down Payment
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-[#501344]">
                    {yearsCount > 0 ? `${yearsCount} Yrs ` : ''}
                    {remainingMonths > 0 ? `${remainingMonths} Mos` : ''}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    ({monthsCount} total months)
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
                  +{formatCurrency(totalInterestEarned, inputs.baseCurrency)} Interest Earned
                </span>
              </div>
            </div>

            {/* Savings Curve Chart */}
            <div className="h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6a1a5b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6a1a5b" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e6af2e" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#e6af2e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis
                    tickFormatter={(val) => formatCurrency(val, inputs.baseCurrency)}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(val: number) => [formatCurrency(val, inputs.baseCurrency)]}
                    contentStyle={{
                      backgroundColor: '#501344',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="deposits"
                    name="Your Deposits"
                    stroke="#6a1a5b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#savingsGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    name="Total with 7% Interest"
                    stroke="#e6af2e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#interestGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Pills & Action Button */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="grid grid-cols-3 gap-2 w-full sm:w-auto flex-1 text-center text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 font-semibold block text-[10px]">Target Equity</span>
                <strong className="text-slate-900 font-black text-xs">
                  {formatCurrency(targetEquity, inputs.baseCurrency)}
                </strong>
              </div>
              <div className="p-2.5 bg-purple-50 rounded-xl text-[#501344]">
                <span className="text-purple-700 font-semibold block text-[10px]">Your Deposits</span>
                <strong className="font-black text-xs">
                  {formatCurrency(totalDeposited, inputs.baseCurrency)}
                </strong>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl text-amber-900">
                <span className="text-amber-700 font-semibold block text-[10px]">7% Interest</span>
                <strong className="font-black text-xs text-[#855e09]">
                  +{formatCurrency(totalInterestEarned, inputs.baseCurrency)}
                </strong>
              </div>
            </div>

            {onGoToCalculator && (
              <button
                type="button"
                onClick={onGoToCalculator}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#501344] hover:bg-[#6a1a5b] text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <span>Go to Loan Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
