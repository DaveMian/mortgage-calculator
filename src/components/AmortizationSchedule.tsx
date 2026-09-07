import React, { useState } from 'react';
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
import {
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';
import {
  AmortizationRow,
  AnnualAmortizationRow,
  CurrencySymbol,
  CBELoanSummary,
  CBEMortgageInputs,
} from '../types/mortgage';
import { formatCurrency } from '../utils/mortgageCalculations';

interface AmortizationScheduleProps {
  inputs: CBEMortgageInputs;
  amortization: AmortizationRow[];
  annualAmortization: AnnualAmortizationRow[];
  summary: CBELoanSummary;
  currency: CurrencySymbol;
}

export const AmortizationSchedule: React.FC<AmortizationScheduleProps> = ({
  inputs,
  amortization,
  annualAmortization,
  summary,
  currency,
}) => {
  const [viewMode, setViewMode] = useState<'annual' | 'monthly'>('annual');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  const totalPages = Math.ceil(amortization.length / pageSize);
  const paginatedMonthly = amortization.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const chartData = annualAmortization.map((item) => ({
    year: `Yr ${item.year} (${item.calendarYear})`,
    balance: item.endingBalance,
    cumulativeInterest: item.totalInterestPaid,
  }));

  const handleExportCSV = () => {
    const headers = [
      'Period',
      'Date',
      'Year',
      'Payment',
      'Principal',
      'Interest',
      'Extra Payment',
      'Remaining Balance',
      'Cumulative Interest',
    ];

    const rows = amortization.map((row) => [
      row.period,
      `"${row.monthName}"`,
      row.year,
      row.payment.toFixed(2),
      row.principal.toFixed(2),
      row.interest.toFixed(2),
      row.extraPayment.toFixed(2),
      row.balance.toFixed(2),
      row.totalInterestPaid.toFixed(2),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cbe-diaspora-mortgage-schedule-${inputs.financingArrangement}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Trajectory Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-[#6a1a5b]" />
              <span>CBE Balance Repayment & Interest Trajectory</span>
            </h3>
            <p className="text-xs text-slate-500">
              {inputs.loanTermYears} years tenure at {summary.interestRate}% interest rate ({inputs.financingArrangement.replace('_', '/')})
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-[#501344] rounded-xl text-xs font-bold border border-purple-200 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="h-72 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="cbeBalanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6a1a5b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6a1a5b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="cbeInterestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e6af2e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#e6af2e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} />
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
              <Legend
                formatter={(val) =>
                  val === 'balance' ? 'Remaining Principal Balance' : 'Cumulative Interest Paid to CBE'
                }
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#6a1a5b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#cbeBalanceGrad)"
              />
              <Area
                type="monotone"
                dataKey="cumulativeInterest"
                stroke="#e6af2e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#cbeInterestGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">Amortization Table</h3>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setViewMode('annual')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'annual'
                    ? 'bg-white text-[#6a1a5b] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Annual Summary
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'monthly'
                    ? 'bg-white text-[#6a1a5b] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Detail
              </button>
            </div>
          </div>

          {viewMode === 'monthly' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">
                Page {currentPage} of {totalPages} ({amortization.length} payments)
              </span>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto mt-4">
          {viewMode === 'annual' ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                  <th className="py-3 px-3">Year</th>
                  <th className="py-3 px-3">Calendar Year</th>
                  <th className="py-3 px-3">Principal Paid</th>
                  <th className="py-3 px-3">Interest to CBE</th>
                  <th className="py-3 px-3">Extra Payments</th>
                  <th className="py-3 px-3">Total Annual Pmt</th>
                  <th className="py-3 px-3">Ending Balance</th>
                  <th className="py-3 px-3">Cumulative Interest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {annualAmortization.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">Year {row.year}</td>
                    <td className="py-3 px-3 text-slate-600">{row.calendarYear}</td>
                    <td className="py-3 px-3 text-[#6a1a5b] font-bold">
                      {formatCurrency(row.principal, inputs.baseCurrency)}
                    </td>
                    <td className="py-3 px-3 text-amber-800 font-bold">
                      {formatCurrency(row.interest, inputs.baseCurrency)}
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">
                      {row.extraPayment > 0 ? formatCurrency(row.extraPayment, inputs.baseCurrency) : '—'}
                    </td>
                    <td className="py-3 px-3 text-slate-900 font-black">
                      {formatCurrency(row.totalPayment, inputs.baseCurrency)}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {formatCurrency(row.endingBalance, inputs.baseCurrency)}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {formatCurrency(row.totalInterestPaid, inputs.baseCurrency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                  <th className="py-3 px-3">Period</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Monthly Payment</th>
                  <th className="py-3 px-3">Principal</th>
                  <th className="py-3 px-3">Interest</th>
                  <th className="py-3 px-3">Extra Pmt</th>
                  <th className="py-3 px-3">Remaining Balance</th>
                  <th className="py-3 px-3">Total Interest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {paginatedMonthly.map((row) => (
                  <tr key={row.period} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-800">#{row.period}</td>
                    <td className="py-3 px-3 text-slate-600">{row.monthName}</td>
                    <td className="py-3 px-3 font-black text-slate-900">
                      {formatCurrency(row.payment, inputs.baseCurrency)}
                    </td>
                    <td className="py-3 px-3 text-[#6a1a5b] font-bold">
                      {formatCurrency(row.principal, inputs.baseCurrency)}
                    </td>
                    <td className="py-3 px-3 text-amber-800 font-bold">
                      {formatCurrency(row.interest, inputs.baseCurrency)}
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">
                      {row.extraPayment > 0 ? formatCurrency(row.extraPayment, inputs.baseCurrency) : '—'}
                    </td>
                    <td className="py-3 px-3 font-black text-slate-900">
                      {formatCurrency(row.balance, inputs.baseCurrency)}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {formatCurrency(row.totalInterestPaid, inputs.baseCurrency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
