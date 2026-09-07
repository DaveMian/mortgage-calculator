import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Sliders,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  BarChart3,
  Layers,
  ArrowRightLeft,
  Sparkles,
  CheckCircle2,
  Check,
} from 'lucide-react';
import {
  CBEMortgageInputs,
  CurrencySymbol,
  ComparisonScenario,
  ArrangementComparison,
} from '../types/mortgage';
import {
  generateCBELoanAmountComparisons,
  compareCBEArrangements,
  calculateMonthlyPI,
  formatCurrency,
  convertCurrency,
  getCBEOfficialInterestRate,
} from '../utils/mortgageCalculations';

interface LoanComparisonProps {
  inputs: CBEMortgageInputs;
  currency: CurrencySymbol;
  onApplyLoanAmount?: (amount: number) => void;
}

export const LoanComparison: React.FC<LoanComparisonProps> = ({
  inputs,
  currency,
  onApplyLoanAmount,
}) => {
  const isETB = inputs.baseCurrency === 'ETB (Birr)';
  const altCurrency: CurrencySymbol = isETB ? 'USD ($)' : 'ETB (Birr)';

  const equityAmount = (inputs.homePrice * inputs.equityPercent) / 100;
  const baseLoanAmount = Math.max(0, inputs.homePrice - equityAmount);

  // Slider target loan amount
  const [sliderAmount, setSliderAmount] = useState<number>(baseLoanAmount);

  // Custom loan amounts
  const [customAmounts, setCustomAmounts] = useState<number[]>([]);
  const [newCustomInput, setNewCustomInput] = useState<string>('');
  const [activeChartMetric, setActiveChartMetric] = useState<'monthly' | 'totalInterest'>('monthly');

  // Generate comparisons
  const scenarios = generateCBELoanAmountComparisons(inputs, customAmounts.length > 0 ? customAmounts : undefined);
  const arrangementComparisons = compareCBEArrangements({
    ...inputs,
    homePrice: sliderAmount / (1 - inputs.equityPercent / 100),
  });

  const officialRate = inputs.customInterestRate !== undefined
    ? inputs.customInterestRate
    : getCBEOfficialInterestRate(inputs.loanType, inputs.financingArrangement, inputs.equityPercent);

  // Baseline calculations
  const baseMonthly = calculateMonthlyPI(baseLoanAmount, officialRate, inputs.loanTermYears);
  const baseTotalInterest = Math.max(0, baseMonthly * inputs.loanTermYears * 12 - baseLoanAmount);

  // Slider calculations
  const sliderMonthly = calculateMonthlyPI(sliderAmount, officialRate, inputs.loanTermYears);
  const sliderMonthlyConverted = convertCurrency(sliderMonthly, inputs.baseCurrency, altCurrency, inputs.exchangeRateUSDToETB);
  const sliderTotalInterest = Math.max(0, sliderMonthly * inputs.loanTermYears * 12 - sliderAmount);
  const sliderTotalCost = sliderAmount + sliderTotalInterest;

  const monthlyDelta = sliderMonthly - baseMonthly;
  const interestDelta = sliderTotalInterest - baseTotalInterest;

  const handleAddCustomAmount = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = newCustomInput.replace(/[^0-9]/g, '');
    const parsed = parseInt(cleanNumber, 10);
    if (!isNaN(parsed) && parsed > 0) {
      const currentList = customAmounts.length > 0 ? customAmounts : scenarios.map((s) => s.loanAmount);
      if (!currentList.includes(parsed)) {
        setCustomAmounts([...currentList, parsed].sort((a, b) => a - b));
        setNewCustomInput('');
      }
    }
  };

  const handleRemoveAmount = (amountToRemove: number) => {
    const currentList = customAmounts.length > 0 ? customAmounts : scenarios.map((s) => s.loanAmount);
    if (currentList.length <= 2) return;
    setCustomAmounts(currentList.filter((a) => a !== amountToRemove));
  };

  const chartData = scenarios.map((s) => ({
    name: isETB ? `${(s.loanAmount / 1000000).toFixed(1)}M Birr` : `$${(s.loanAmount / 1000).toFixed(0)}k`,
    loanAmount: s.loanAmount,
    monthly: s.monthlyPI,
    principal: s.loanAmount,
    totalInterest: s.totalInterest,
    totalCost: s.totalCost,
    isBase: s.isBase,
  }));

  return (
    <div className="space-y-8">
      {/* 1. What-If Loan Sizing Hero Banner */}
      <div className="bg-gradient-to-br from-[#501344] via-[#651856] to-[#2b0824] text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-[#80226f]/40">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-800/60">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e6af2e]/20 text-[#fcd34d] border border-[#e6af2e]/30 mb-2">
                <Sliders className="w-3.5 h-3.5" /> CBE Diaspora Loan Sizing Explorer
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                How Much Will Different Loan Amounts Cost You at CBE?
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-2xl leading-relaxed">
                Test different borrowing amounts at {officialRate}% CBE interest for {inputs.loanTermYears} years ({inputs.financingArrangement.replace('_', '/')}) and see the exact monthly repayment in both {inputs.baseCurrency} and {altCurrency}.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-right min-w-[220px]">
              <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider block">
                Selected Loan Amount
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {formatCurrency(sliderAmount, inputs.baseCurrency)}
              </span>
              <span className="text-xs font-bold text-[#fcd34d] block mt-0.5">
                ≈ {formatCurrency(convertCurrency(sliderAmount, inputs.baseCurrency, altCurrency, inputs.exchangeRateUSDToETB), altCurrency)}
              </span>
            </div>
          </div>

          {/* Interactive Slider */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-xs text-purple-200">
              <span>{formatCurrency(isETB ? 1000000 : 25000, inputs.baseCurrency)}</span>
              <span className="font-extrabold text-white bg-[#e6af2e]/30 px-3 py-1 rounded-lg border border-[#e6af2e]/40">
                Current Test: {formatCurrency(sliderAmount, inputs.baseCurrency)}
              </span>
              <span>{formatCurrency(isETB ? 30000000 : 350000, inputs.baseCurrency)}</span>
            </div>
            <input
              type="range"
              min={isETB ? 1000000 : 25000}
              max={isETB ? 30000000 : 350000}
              step={isETB ? 500000 : 5000}
              value={sliderAmount}
              onChange={(e) => setSliderAmount(Number(e.target.value))}
              className="w-full h-3 bg-purple-950/80 rounded-lg appearance-none cursor-pointer accent-[#e6af2e]"
            />
            {/* Quick amounts chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {(isETB
                ? [3000000, 5000000, 8000000, 12000000, 18000000, 25000000]
                : [50000, 75000, 100000, 150000, 200000, 250000]
              ).map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSliderAmount(amt)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    sliderAmount === amt
                      ? 'bg-[#e6af2e] text-[#501344] font-black shadow-md'
                      : 'bg-white/10 text-purple-100 hover:bg-white/20'
                  }`}
                >
                  {formatCurrency(amt, inputs.baseCurrency)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSliderAmount(baseLoanAmount)}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-white/20 text-[#fcd34d] hover:bg-white/30 transition-all cursor-pointer"
              >
                Reset to Base ({formatCurrency(baseLoanAmount, inputs.baseCurrency)})
              </button>
              {onApplyLoanAmount && sliderAmount !== baseLoanAmount && (
                <button
                  type="button"
                  onClick={() => onApplyLoanAmount(sliderAmount)}
                  className="px-3 py-1 rounded-lg text-xs font-black bg-[#e6af2e] text-[#501344] hover:bg-[#fcd34d] transition-all cursor-pointer shadow-md flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Use {formatCurrency(sliderAmount, inputs.baseCurrency)} as Main Loan</span>
                </button>
              )}
            </div>
          </div>

          {/* Sizing Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {/* Monthly Payment */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <span className="text-xs font-semibold text-purple-200 block">
                Monthly Repayment to CBE
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">
                  {formatCurrency(sliderMonthly, inputs.baseCurrency)}
                </span>
                <span className="text-xs text-purple-200">/mo</span>
              </div>
              <span className="text-[11px] font-bold text-[#fcd34d] block mt-0.5">
                ≈ {formatCurrency(sliderMonthlyConverted, altCurrency)}/mo
              </span>
              <div className="mt-2 text-xs flex items-center gap-1 font-medium">
                {monthlyDelta === 0 ? (
                  <span className="text-purple-300">Baseline loan amount</span>
                ) : monthlyDelta > 0 ? (
                  <span className="text-[#fcd34d] flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +{formatCurrency(monthlyDelta, inputs.baseCurrency)}/mo vs current
                  </span>
                ) : (
                  <span className="text-emerald-300 flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" /> -{formatCurrency(Math.abs(monthlyDelta), inputs.baseCurrency)}/mo vs current
                  </span>
                )}
              </div>
            </div>

            {/* Total Interest */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <span className="text-xs font-semibold text-purple-200 block">
                Total CBE Interest ({inputs.loanTermYears} Yrs)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-[#fcd34d]">
                  {formatCurrency(sliderTotalInterest, inputs.baseCurrency)}
                </span>
              </div>
              <div className="mt-2 text-xs flex items-center gap-1 font-medium">
                {interestDelta === 0 ? (
                  <span className="text-purple-300">Baseline loan amount</span>
                ) : interestDelta > 0 ? (
                  <span className="text-[#fcd34d] flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +{formatCurrency(interestDelta, inputs.baseCurrency)} more interest
                  </span>
                ) : (
                  <span className="text-emerald-300 flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" /> -{formatCurrency(Math.abs(interestDelta), inputs.baseCurrency)} saved in interest
                  </span>
                )}
              </div>
            </div>

            {/* Total Repayment */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <span className="text-xs font-semibold text-purple-200 block">
                Total Lifetime Repayment (P + I)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">
                  {formatCurrency(sliderTotalCost, inputs.baseCurrency)}
                </span>
              </div>
              <p className="text-[11px] text-purple-300 mt-2">
                Principal {formatCurrency(sliderAmount, inputs.baseCurrency)} + Interest
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Compare the 3 CBE Financing Arrangements */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        <div className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#6a1a5b]" />
            <h3 className="text-lg font-bold text-slate-900">
              Compare the 3 CBE Financing Arrangements for {formatCurrency(sliderAmount, inputs.baseCurrency)}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            See how your monthly payment and interest change depending on whether you repay in Foreign Currency or Ethiopian Birr
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {arrangementComparisons.map((arr) => {
            const isCurrent = inputs.financingArrangement === arr.arrangement;
            return (
              <div
                key={arr.arrangement}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-purple-50/60 border-[#6a1a5b] ring-2 ring-[#6a1a5b]/20 shadow-md'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-base text-[#501344]">{arr.title}</span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold bg-[#6a1a5b] text-white px-2 py-0.5 rounded-full">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 h-10 leading-snug">{arr.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">Interest Rate:</span>
                    <span className="font-black text-slate-900 text-sm">{arr.interestRate}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">Monthly Repayment:</span>
                    <span className="font-extrabold text-[#6a1a5b] text-sm">
                      {formatCurrency(arr.monthlyPayment, inputs.baseCurrency)}/mo
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">Total Lifetime Interest:</span>
                    <span className="font-bold text-amber-800">
                      {formatCurrency(arr.totalInterest, inputs.baseCurrency)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Visual Comparison Bar Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#6a1a5b]" />
              <span>Comparing Loan Amounts Visually</span>
            </h3>
            <p className="text-xs text-slate-500">
              Payments and total interest across different borrowing levels
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveChartMetric('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartMetric === 'monthly'
                  ? 'bg-white text-[#6a1a5b] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Payment
            </button>
            <button
              type="button"
              onClick={() => setActiveChartMetric('totalInterest')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartMetric === 'totalInterest'
                  ? 'bg-white text-[#6a1a5b] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Principal vs Interest
            </button>
          </div>
        </div>

        <div className="h-72 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartMetric === 'monthly' ? (
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis
                  tickFormatter={(val) => formatCurrency(val, inputs.baseCurrency)}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip
                  formatter={(val: number) => [formatCurrency(val, inputs.baseCurrency), 'Monthly Payment']}
                  contentStyle={{
                    backgroundColor: '#501344',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="monthly" fill="#6a1a5b" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis
                  tickFormatter={(val) => isETB ? `${(val / 1000000).toFixed(0)}M` : `$${(val / 1000).toFixed(0)}k`}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip
                  formatter={(val: number, name: string) => [
                    formatCurrency(val, inputs.baseCurrency),
                    name === 'principal' ? 'Loan Principal' : 'Total Interest to CBE',
                  ]}
                  contentStyle={{
                    backgroundColor: '#501344',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  formatter={(val) => (val === 'principal' ? 'Principal Borrowed' : 'Total Interest Paid to CBE')}
                />
                <Bar dataKey="principal" stackId="a" fill="#6a1a5b" />
                <Bar dataKey="totalInterest" stackId="a" fill="#e6af2e" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Side-by-Side Comparison Matrix Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Side-by-Side CBE Loan Matrix</h3>
            <p className="text-xs text-slate-500">
              Compare exact monthly repayments, total interest, and apply any loan amount directly
            </p>
          </div>

          <form onSubmit={handleAddCustomAmount} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Custom ${isETB ? 'Birr' : 'USD'} amount`}
              value={newCustomInput}
              onChange={(e) => setNewCustomInput(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-40 font-semibold focus:bg-white focus:ring-1 focus:ring-[#6a1a5b]"
            />
            <button
              type="submit"
              className="flex items-center gap-1 px-3 py-1.5 bg-[#6a1a5b] hover:bg-[#501344] text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-3">Loan Amount</th>
                <th className="py-3 px-3">Equivalent ({altCurrency})</th>
                <th className="py-3 px-3">Monthly Repayment</th>
                <th className="py-3 px-3">Monthly in {altCurrency}</th>
                <th className="py-3 px-3">Total CBE Interest</th>
                <th className="py-3 px-3">Monthly Delta</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {scenarios.map((sc) => {
                const diffMo = sc.monthlyPI - baseMonthly;
                return (
                  <tr
                    key={sc.id}
                    className={`transition-colors ${
                      sc.isBase
                        ? 'bg-purple-50/50 hover:bg-purple-50/80 font-bold'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm">
                          {formatCurrency(sc.loanAmount, inputs.baseCurrency)}
                        </span>
                        {sc.isBase && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#6a1a5b] text-white">
                            Current
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-600">
                      ≈ {formatCurrency(sc.loanAmountConverted, altCurrency)}
                    </td>

                    <td className="py-3.5 px-3 font-extrabold text-[#6a1a5b]">
                      {formatCurrency(sc.monthlyPI, inputs.baseCurrency)}
                    </td>

                    <td className="py-3.5 px-3 text-slate-600">
                      ≈ {formatCurrency(sc.monthlyPIConverted, altCurrency)}
                    </td>

                    <td className="py-3.5 px-3 font-bold text-amber-800">
                      {formatCurrency(sc.totalInterest, inputs.baseCurrency)}
                    </td>

                    <td className="py-3.5 px-3">
                      {sc.isBase ? (
                        <span className="text-slate-400 font-normal">— Baseline —</span>
                      ) : diffMo > 0 ? (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-bold inline-flex items-center gap-1">
                          +{formatCurrency(diffMo, inputs.baseCurrency)}/mo
                        </span>
                      ) : (
                        <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold inline-flex items-center gap-1">
                          -{formatCurrency(Math.abs(diffMo), inputs.baseCurrency)}/mo
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onApplyLoanAmount && !sc.isBase && (
                          <button
                            type="button"
                            onClick={() => onApplyLoanAmount(sc.loanAmount)}
                            className="px-2 py-1 text-[11px] font-bold bg-purple-100 hover:bg-[#6a1a5b] text-[#501344] hover:text-white rounded-md transition-colors cursor-pointer"
                            title="Set as active loan"
                          >
                            Apply
                          </button>
                        )}
                        {!sc.isBase && scenarios.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAmount(sc.loanAmount)}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove scenario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
