import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Calendar,
  Sparkles,
  Award,
  TrendingDown,
  Info,
  DollarSign,
  FileDown,
} from 'lucide-react';
import {
  CBELoanSummary,
  MonthlyBreakdown,
  CBEMortgageInputs,
  CurrencySymbol,
} from '../types/mortgage';
import { formatCurrency, convertCurrency } from '../utils/mortgageCalculations';

interface PaymentBreakdownCardProps {
  inputs: CBEMortgageInputs;
  summary: CBELoanSummary;
  currency: CurrencySymbol;
  onOpenExtraPayments: () => void;
  onOpenQuotation?: () => void;
}

const COLORS = {
  principal: '#6a1a5b',  // CBE Purple
  interest: '#e6af2e',   // CBE Gold
};

export const PaymentBreakdownCard: React.FC<PaymentBreakdownCardProps> = ({
  inputs,
  summary,
  currency,
  onOpenExtraPayments,
  onOpenQuotation,
}) => {
  const isETB = inputs.baseCurrency === 'ETB (Birr)';
  const altCurrency: CurrencySymbol = isETB ? 'USD ($)' : 'ETB (Birr)';

  const chartData = [
    { name: 'Loan Principal', value: summary.loanAmount, color: COLORS.principal },
    { name: 'Total Interest to CBE', value: summary.totalInterest, color: COLORS.interest },
  ];

  const totalRepaid = summary.loanAmount + summary.totalInterest;
  const principalPct = totalRepaid > 0 ? (summary.loanAmount / totalRepaid) * 100 : 0;
  const interestPct = totalRepaid > 0 ? (summary.totalInterest / totalRepaid) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between">
      <div>
        {/* Header with Monthly Payment (ETB Default) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="text-[11px] font-bold text-[#6a1a5b] uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                CBE {inputs.financingArrangement.replace('_', '/')}
              </span>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {summary.interestRate}% APR
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                1 USD = {inputs.exchangeRateUSDToETB.toFixed(2)} ETB
              </span>
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Monthly Repayment (Default in ETB)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-black text-[#501344] tracking-tight">
                {formatCurrency(summary.monthlyPayment, inputs.baseCurrency)}
              </span>
              <span className="text-xs font-bold text-slate-500">/ month</span>
            </div>
            <p className="text-xs font-extrabold text-[#6a1a5b] mt-0.5">
              ≈ {formatCurrency(summary.monthlyPaymentConverted, altCurrency)} / month
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {onOpenQuotation && (
              <button
                type="button"
                onClick={onOpenQuotation}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#e6af2e] hover:bg-[#fcd34d] text-[#501344] text-xs font-black transition-all shadow-xs cursor-pointer"
                title="Generate printable quotation"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Quotation</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenExtraPayments}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#501344] text-xs font-bold border border-purple-200 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e6af2e]" />
              <span>Extra Payments</span>
              {summary.interestSaved > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#6a1a5b] text-white text-[10px]">
                  Active
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Savings banner if extra payments applied */}
        {summary.interestSaved > 0 && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
            <span className="font-medium">
              🎉 Accelerated Payoff: Saving{' '}
              <strong>{formatCurrency(summary.interestSaved, inputs.baseCurrency)}</strong> and paying off{' '}
              <strong>{summary.yearsSaved} years earlier</strong>!
            </span>
            <span className="font-bold text-[11px] bg-emerald-200/60 px-2 py-0.5 rounded-full">
              Payoff: {summary.payoffDate}
            </span>
          </div>
        )}

        {/* Chart + Lifetime Cost Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-6">
          {/* Donut Chart */}
          <div className="md:col-span-5 relative flex items-center justify-center min-h-[190px]">
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [formatCurrency(val, inputs.baseCurrency)]}
                    contentStyle={{
                      backgroundColor: '#501344',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Rate</span>
              <span className="text-base font-black text-[#6a1a5b]">
                {summary.interestRate}%
              </span>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="md:col-span-7 space-y-3">
            {/* Principal */}
            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#6a1a5b] flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Principal Borrowed</span>
                  <span className="text-[11px] text-slate-500">{principalPct.toFixed(1)}% of total repayment</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-[#501344] block">
                  {formatCurrency(summary.loanAmount, inputs.baseCurrency)}
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  ≈ {formatCurrency(summary.loanAmountConverted, altCurrency)}
                </span>
              </div>
            </div>

            {/* Total Interest to CBE */}
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#e6af2e] flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Total CBE Interest</span>
                  <span className="text-[11px] text-slate-500">{interestPct.toFixed(1)}% of total repayment</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-[#855e09] block">
                  {formatCurrency(summary.totalInterest, inputs.baseCurrency)}
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Over {inputs.loanTermYears} years
                </span>
              </div>
            </div>

            {/* Equity Required */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-md bg-slate-400 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Equity Required ({inputs.equityPercent}%)
                  </span>
                  <span className="text-[11px] text-slate-500">Minimum down payment</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-slate-800 block">
                  {formatCurrency(summary.equityAmount, inputs.baseCurrency)}
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  ≈ {formatCurrency(convertCurrency(summary.equityAmount, inputs.baseCurrency, altCurrency, inputs.exchangeRateUSDToETB), altCurrency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stat Grid */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wide">Loan Principal</span>
          <span className="text-xs sm:text-sm font-black text-slate-900">
            {formatCurrency(summary.loanAmount, inputs.baseCurrency)}
          </span>
        </div>
        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wide">CBE Interest Rate</span>
          <span className="text-xs sm:text-sm font-black text-[#6a1a5b]">
            {summary.interestRate}% APR
          </span>
        </div>
        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wide">Total Repayment</span>
          <span className="text-xs sm:text-sm font-black text-slate-900">
            {formatCurrency(summary.totalPayments, inputs.baseCurrency)}
          </span>
        </div>
        <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wide">Payoff Date</span>
          <span className="text-xs sm:text-sm font-black text-emerald-700">
            {summary.payoffDate}
          </span>
        </div>
      </div>
    </div>
  );
};
