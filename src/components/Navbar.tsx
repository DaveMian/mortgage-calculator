import React from 'react';
import {
  Building,
  Sparkles,
  RefreshCw,
  Globe,
  FileDown,
  Languages,
} from 'lucide-react';
import {
  CurrencySymbol,
  CBEMortgageInputs,
  CBEFinancingArrangement,
  ExchangeRateInfo,
} from '../types/mortgage';
import { Language, translations } from '../utils/translations';

interface NavbarProps {
  currency: CurrencySymbol;
  onCurrencyChange: (c: CurrencySymbol) => void;
  onApplyArrangement: (arr: CBEFinancingArrangement) => void;
  onReset: () => void;
  exchangeRateInfo: ExchangeRateInfo;
  onRefreshRate: () => void;
  onOpenQuotation: () => void;
  lang: Language;
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  onCurrencyChange,
  onApplyArrangement,
  onReset,
  exchangeRateInfo,
  onRefreshRate,
  onOpenQuotation,
  lang,
  onToggleLang,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-50 bg-[#501344] text-white border-b border-[#701e60] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#e6af2e] to-[#fcd34d] flex items-center justify-center text-[#501344] font-black shadow-md">
              <span className="text-xl font-black">CBE</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white">
                  {t.bankTitle}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#e6af2e] text-[#501344]">
                  {t.diasporaBanking}
                </span>
              </div>
              <p className="text-[11px] text-purple-200 hidden sm:block">
                {t.bankSubtitle}
              </p>
            </div>
          </div>

          {/* Daily Bank Rate Display */}
          <div className="hidden lg:flex items-center gap-2 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-purple-200 font-semibold">{t.bankDailyRate}:</span>
              <strong className="text-[#fcd34d] font-black tracking-wide">
                1 USD = {exchangeRateInfo.rateUSDToETB.toFixed(2)} ETB
              </strong>
            </div>
            <button
              onClick={onRefreshRate}
              disabled={exchangeRateInfo.isLoading}
              title={t.refreshRate}
              className="p-1 hover:bg-white/20 rounded-md text-purple-200 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${exchangeRateInfo.isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Actions & Currency Switcher */}
          <div className="flex items-center space-x-2">
            {/* Download Loan Quotation Button */}
            <button
              onClick={onOpenQuotation}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#e6af2e] hover:bg-[#fcd34d] text-[#501344] text-xs font-black transition-all shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{lang === 'am' ? 'ማጠቃለያ (PDF)' : 'Quotation (PDF)'}</span>
            </button>

            {/* Language Toggle (EN / አማርኛ) */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white border border-white/10 transition-colors"
              title="Switch Language / ቋንቋ ቀይር"
            >
              <Languages className="w-3.5 h-3.5 text-[#e6af2e]" />
              <span>{lang === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>

            {/* Currency Switcher (ETB is DEFAULT) */}
            <div className="flex items-center bg-black/30 rounded-lg p-0.5 border border-white/10 text-xs font-semibold">
              {(['ETB (Birr)', 'USD ($)', 'EUR (€)', 'GBP (£)'] as CurrencySymbol[]).map((cur) => (
                <button
                  key={cur}
                  onClick={() => onCurrencyChange(cur)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    currency === cur
                      ? 'bg-[#e6af2e] text-[#501344] font-black shadow-xs'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  {cur === 'ETB (Birr)' ? 'ETB' : cur.split(' ')[0]}
                </button>
              ))}
            </div>

            <button
              onClick={onReset}
              title={t.resetSettings}
              className="p-2 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
