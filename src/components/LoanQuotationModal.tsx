import React from 'react';
import {
  X,
  Printer,
  FileText,
  Building,
  CheckCircle,
  Calendar,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import {
  CBEMortgageInputs,
  CBELoanSummary,
  CurrencySymbol,
  ExchangeRateInfo,
} from '../types/mortgage';
import { formatCurrency, convertCurrency } from '../utils/mortgageCalculations';
import { Language, translations } from '../utils/translations';

interface LoanQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: CBEMortgageInputs;
  summary: CBELoanSummary;
  currency: CurrencySymbol;
  exchangeRateInfo: ExchangeRateInfo;
  lang: Language;
}

export const LoanQuotationModal: React.FC<LoanQuotationModalProps> = ({
  isOpen,
  onClose,
  inputs,
  summary,
  currency,
  exchangeRateInfo,
  lang,
}) => {
  if (!isOpen) return null;

  const isETB = inputs.baseCurrency === 'ETB (Birr)';
  const altCurrency: CurrencySymbol = isETB ? 'USD ($)' : 'ETB (Birr)';
  const todayStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const quoteRef = `CBE-DIA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 my-8 flex flex-col max-h-[92vh]">
        {/* Action Header (Hidden during print) */}
        <div className="print:hidden flex items-center justify-between p-4 px-6 border-b border-slate-100 bg-purple-50/70">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#6a1a5b]" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {translations[lang].quotationTitle}
              </h3>
              <p className="text-[11px] text-slate-500">Official Diaspora Credit Facility Quotation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#501344] hover:bg-[#6a1a5b] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-900/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{translations[lang].printOrSave}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="quotation-print-area" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-900 font-sans print:p-0 print:overflow-visible">
          {/* Document Letterhead */}
          <div className="flex items-start justify-between pb-6 border-b-2 border-[#501344] gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#501344] text-[#e6af2e] flex items-center justify-center font-black text-xl shadow-md">
                CBE
              </div>
              <div>
                <h1 className="text-xl font-black text-[#501344] tracking-tight">
                  Commercial Bank of Ethiopia
                </h1>
                <p className="text-xs font-bold text-slate-700">
                  የኢትዮጵያ ንግድ ባንክ — Diaspora Banking Unit
                </p>
                <p className="text-[11px] text-slate-500">
                  Ras Desta Damtew St, Addis Ababa, Ethiopia | SWIFT: <strong className="text-[#501344]">CBETETAA</strong>
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wide block">Quote Reference</span>
              <span className="font-mono font-bold text-slate-900 text-sm block">{quoteRef}</span>
              <span className="text-slate-500 text-[11px] block mt-0.5">{todayStr}</span>
            </div>
          </div>

          {/* Quotation Title */}
          <div className="text-center py-2 bg-purple-50/60 rounded-xl border border-purple-100">
            <h2 className="text-base font-black text-[#501344] uppercase tracking-wider">
              Diaspora Mortgage Loan Quotation & Cost Breakdown
            </h2>
            <p className="text-[11px] text-slate-600">
              Prepared for presentation to CBE Diaspora Banking Branch or Foreign Embassies
            </p>
          </div>

          {/* Summary Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="font-extrabold text-slate-900 uppercase tracking-wide block pb-1 border-b border-slate-200">
                Loan Facility Details
              </span>
              <div className="flex justify-between">
                <span className="text-slate-600">Product:</span>
                <strong className="text-slate-900 capitalize">Diaspora {inputs.loanType}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Financing Arrangement:</span>
                <strong className="text-[#6a1a5b]">{inputs.financingArrangement.replace('_', '/')}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Loan Tenure:</span>
                <strong className="text-slate-900">{inputs.loanTermYears} Years ({inputs.loanTermYears * 12} Months)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Official CBE Rate:</span>
                <strong className="text-[#501344] font-black">{summary.interestRate}% APR</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Bank Daily Rate:</span>
                <strong className="text-slate-800">1 USD = {inputs.exchangeRateUSDToETB.toFixed(2)} ETB</strong>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="font-extrabold text-slate-900 uppercase tracking-wide block pb-1 border-b border-slate-200">
                Property & Equity Breakdown
              </span>
              <div className="flex justify-between">
                <span className="text-slate-600">Property / Asset Value:</span>
                <strong className="text-slate-900">{formatCurrency(inputs.homePrice, inputs.baseCurrency)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Required Equity ({inputs.equityPercent}%):</span>
                <strong className="text-slate-900">{formatCurrency(summary.equityAmount, inputs.baseCurrency)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Approved Loan Amount:</span>
                <strong className="text-[#6a1a5b] font-black">{formatCurrency(summary.loanAmount, inputs.baseCurrency)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Foreign Currency Value:</span>
                <strong className="text-slate-800">≈ {formatCurrency(summary.loanAmountConverted, altCurrency)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Estimated Payoff:</span>
                <strong className="text-emerald-700">{summary.payoffDate}</strong>
              </div>
            </div>
          </div>

          {/* Repayment Highlights Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-purple-100/40 to-amber-50 border border-purple-200 text-center space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              Scheduled Monthly Repayment Installment
            </span>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#501344]">
                {formatCurrency(summary.monthlyPayment, inputs.baseCurrency)}
              </span>
              <span className="text-sm font-bold text-slate-600">/ month</span>
            </div>
            <p className="text-xs font-bold text-[#6a1a5b]">
              ≈ {formatCurrency(summary.monthlyPaymentConverted, altCurrency)} per month
            </p>
            <div className="flex justify-center gap-6 text-xs text-slate-600 pt-2 border-t border-purple-200/60 mt-3">
              <span>Total Lifetime Interest: <strong>{formatCurrency(summary.totalInterest, inputs.baseCurrency)}</strong></span>
              <span>Total Repaid: <strong>{formatCurrency(summary.totalPayments, inputs.baseCurrency)}</strong></span>
            </div>
          </div>

          {/* Submission Checklist & Channels */}
          <div className="border-t border-slate-200 pt-4 space-y-3 text-xs">
            <span className="font-bold text-slate-900 block uppercase">
              Documents Required to Finalize Application (Per CBE Guidelines):
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#e6af2e]" />
                <span>Renewed Passport & Residence/Work Permit (or Yellow Card)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#e6af2e]" />
                <span>Married / Un-Married Certificate from Country of Residence</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#e6af2e]" />
                <span>Income proof (Tax returns, W-2, or 3-yr business audit)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#e6af2e]" />
                <span>Deposit of {inputs.equityPercent}% equity into CBE Diaspora Account</span>
              </div>
            </div>
          </div>

          {/* Signatures & Branch Review */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-500">
            <div>
              <div className="border-b border-slate-300 pb-8 mb-1" />
              <span className="font-bold text-slate-800 block">Applicant Signature</span>
              <span className="text-[10px]">I acknowledge receipt of this official quotation.</span>
            </div>
            <div>
              <div className="border-b border-slate-300 pb-8 mb-1" />
              <span className="font-bold text-slate-800 block">CBE Loan Officer / Legal Agent</span>
              <span className="text-[10px]">Commercial Bank of Ethiopia Diaspora Unit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
