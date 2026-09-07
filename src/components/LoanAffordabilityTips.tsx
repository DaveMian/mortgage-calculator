import React from 'react';
import { Lightbulb, CheckCircle, AlertCircle, Percent, DollarSign, ShieldCheck } from 'lucide-react';
import { CurrencySymbol } from '../types/mortgage';

interface LoanAffordabilityTipsProps {
  currency: CurrencySymbol;
}

export const LoanAffordabilityTips: React.FC<LoanAffordabilityTipsProps> = ({ currency }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-base font-bold text-slate-900">Key Mortgage & Affordability Rules of Thumb</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            The 28/36 Rule
          </div>
          <p className="text-slate-600 leading-relaxed">
            Lenders generally recommend that your monthly housing costs (P&I, taxes, insurance) not exceed <strong>28%</strong> of your gross monthly income, and total debt payments stay below <strong>36%</strong>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            Down Payment & PMI
          </div>
          <p className="text-slate-600 leading-relaxed">
            Putting down <strong>20% or more</strong> eliminates Private Mortgage Insurance (PMI), immediately saving between $100 and $300+ each month on typical loans.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            15-Year vs 30-Year
          </div>
          <p className="text-slate-600 leading-relaxed">
            A 15-year mortgage has higher monthly payments, but you often get a <strong>0.5% - 1.0% lower interest rate</strong> and can slash total lifetime interest paid by more than <strong>60%</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
