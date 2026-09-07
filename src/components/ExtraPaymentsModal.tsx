import React from 'react';
import { X, Sparkles, TrendingDown, Clock, Check } from 'lucide-react';
import { CBEMortgageInputs, CurrencySymbol, CBELoanSummary } from '../types/mortgage';
import { formatCurrency } from '../utils/mortgageCalculations';

interface ExtraPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: CBEMortgageInputs;
  onChange: (inputs: CBEMortgageInputs) => void;
  summary: CBELoanSummary;
  currency: CurrencySymbol;
  onApplyAndViewSchedule: () => void;
}

export const ExtraPaymentsModal: React.FC<ExtraPaymentsModalProps> = ({
  isOpen,
  onClose,
  inputs,
  onChange,
  summary,
  currency,
  onApplyAndViewSchedule,
}) => {
  if (!isOpen) return null;

  const isETB = inputs.baseCurrency === 'ETB (Birr)';
  const quickAmounts = isETB ? [2500, 5000, 10000, 20000] : [50, 100, 250, 500];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-purple-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#501344] text-[#e6af2e] rounded-xl font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Accelerate Your CBE Mortgage Payoff</h3>
              <p className="text-xs text-slate-500">Pay additional principal each month to eliminate years and save interest</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {summary.interestSaved > 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  Interest Saved
                </span>
                <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  -{summary.yearsSaved} Years
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-700">
                  {formatCurrency(summary.interestSaved, inputs.baseCurrency)}
                </span>
                <span className="text-xs text-emerald-800">saved in total CBE interest</span>
              </div>
              <p className="text-xs text-emerald-700">
                New payoff date: <strong>{summary.payoffDate}</strong> (originally {inputs.loanTermYears} years)
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-600 text-xs leading-relaxed">
              💡 Adding even a modest monthly principal repayment significantly reduces your compounding interest to CBE and retires your mortgage early.
            </div>
          )}

          {/* Extra Monthly Payment */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800">Extra Monthly Payment</label>
              <span className="text-xs text-slate-500 font-medium">Added to scheduled monthly payment</span>
            </div>
            <div className="relative rounded-xl shadow-sm">
              <input
                type="number"
                min="0"
                step={isETB ? '1000' : '50'}
                value={inputs.extraMonthlyPayment}
                onChange={(e) => onChange({ ...inputs, extraMonthlyPayment: Math.max(0, Number(e.target.value)) })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#6a1a5b]"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => onChange({ ...inputs, extraMonthlyPayment: amt })}
                  className={`flex-1 py-1.5 text-xs rounded-lg font-bold border transition-all cursor-pointer ${
                    inputs.extraMonthlyPayment === amt
                      ? 'bg-[#6a1a5b] text-white border-[#6a1a5b]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  +{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onChange({ ...inputs, extraMonthlyPayment: 0 })}
            className="text-xs text-slate-500 hover:text-red-600 font-bold transition-colors cursor-pointer"
          >
            Clear Extra Payment
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Done
            </button>
            <button
              type="button"
              onClick={onApplyAndViewSchedule}
              className="px-5 py-2 bg-[#501344] hover:bg-[#6a1a5b] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply & View Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
