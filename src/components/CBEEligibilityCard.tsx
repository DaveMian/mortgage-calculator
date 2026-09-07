import React from 'react';
import {
  FileText,
  CheckCircle2,
  Building2,
  Send,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Globe,
  Award,
} from 'lucide-react';

export const CBEEligibilityCard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-[#501344] via-[#6a1a5b] to-[#80226f] text-white p-6 sm:p-8 rounded-2xl shadow-md border border-[#80226f]/40">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e6af2e]/20 text-[#fcd34d] border border-[#e6af2e]/30 mb-3">
            <Award className="w-3.5 h-3.5" /> Commercial Bank of Ethiopia (CBE) Diaspora Banking
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Eligibility & Application Guidelines
          </h2>
          <p className="text-sm text-purple-100/90 mt-2 leading-relaxed">
            Non-resident Ethiopians or foreign nationals of Ethiopian origin (Yellow Card holders) who have lived abroad for 1+ years can access subsidized mortgage financing with tenures up to 20 years.
          </p>
        </div>
      </div>

      {/* Grid of Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. General Requirements */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 bg-purple-50 text-[#6a1a5b] rounded-xl font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">General Requirements</h3>
              <p className="text-xs text-slate-500">Required from all diaspora applicants</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#e6af2e] flex-shrink-0 mt-0.5" />
              <span><strong>Credit Application Letter:</strong> Formal loan request to CBE Diaspora Banking Unit.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#e6af2e] flex-shrink-0 mt-0.5" />
              <span><strong>ID / Passport:</strong> Renewed passport and residence/work permit, or Ethiopian origin Yellow Card.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#e6af2e] flex-shrink-0 mt-0.5" />
              <span><strong>Marital Status:</strong> Valid Married or Un-Married certificate.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#e6af2e] flex-shrink-0 mt-0.5" />
              <span><strong>Photograph:</strong> One recent passport-size photograph.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#e6af2e] flex-shrink-0 mt-0.5" />
              <span><strong>TIN Number:</strong> Tax Identification Number (borrower and spouse, if applicable).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#e6af2e] flex-shrink-0 mt-0.5" />
              <span><strong>Equity Contribution:</strong> Deposit the minimum 10% – 50% equity in FCY or LCY as per arrangement.</span>
            </li>
          </ul>
        </div>

        {/* 2. Income Documentation by Applicant Type */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 bg-purple-50 text-[#6a1a5b] rounded-xl font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Income Verification</h3>
              <p className="text-xs text-slate-500">Based on your type of employment</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-900 block mb-1">If Employed:</span>
              <p className="text-slate-600">
                • Official employment letter showing annual gross and net income.<br />
                • Individual tax return form (W-2, P60, etc.) or copy of employment contract.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-900 block mb-1">If Business Owner / Self-Employed:</span>
              <p className="text-slate-600">
                • Audited financial statements for the past 3 consecutive years.<br />
                • Renewed trade license, trade registration, and tax clearance certificates.
              </p>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
              <span className="font-bold text-amber-900 block mb-1">Special Option Arrangement:</span>
              <p className="text-amber-800">
                For applicants whose income cannot be substantiated by formal documents (e.g., housemaid, babysitter, waiter, driver): entertained with <strong>50% equity contribution and 50% loan under FCY/FCY arrangement</strong> with written income disclosure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Channels to Deposit, Credit & Repay */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-[#6a1a5b]" />
            <h3 className="text-base font-bold text-slate-900">Payment & Remittance Channels</h3>
          </div>
          <div className="flex items-center gap-2 text-xs bg-purple-50 text-[#6a1a5b] font-bold px-3 py-1 rounded-lg border border-purple-200">
            <span>CBE SWIFT Code:</span>
            <code className="text-sm tracking-wider font-extrabold text-[#501344]">CBETETAA</code>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-900 flex items-center gap-1 mb-1">
              <Smartphone className="w-3.5 h-3.5 text-[#6a1a5b]" /> Digital Platforms
            </span>
            <p className="text-slate-600 leading-relaxed">
              Ethio Direct Mobile App, CBE Connect, Fast Pay, Cash Go, Botim Money, Wegen Send, Ethio Pay.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-900 flex items-center gap-1 mb-1">
              <Globe className="w-3.5 h-3.5 text-[#6a1a5b]" /> Partner MTOs
            </span>
            <p className="text-slate-600 leading-relaxed">
              Western Union, MoneyGram, WorldRemit, Thunes, Transfast, Bole Atlantic, Dhabshil, Cash Express, Al Ansari.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-900 flex items-center gap-1 mb-1">
              <ExternalLink className="w-3.5 h-3.5 text-[#6a1a5b]" /> Online Account Opening
            </span>
            <p className="text-slate-600 leading-relaxed">
              Open your diaspora account directly from your smartphone using the <strong>unite.et</strong> app or at <a href="https://unite.et" target="_blank" rel="noreferrer" className="text-[#6a1a5b] font-bold underline">https://unite.et</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
