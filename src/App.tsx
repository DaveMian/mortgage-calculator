import React, { useState, useMemo, useEffect } from 'react';
import {
  PieChart,
  Sliders,
  Calendar,
  FileCheck2,
  Award,
  TrendingUp,
  Sparkles,
  Phone,
  Mail,
  Globe,
  PiggyBank,
  ArrowRightLeft,
  FileDown,
} from 'lucide-react';
import {
  CBEMortgageInputs,
  CurrencySymbol,
  CBEFinancingArrangement,
  ExchangeRateInfo,
} from './types/mortgage';
import {
  calculateCBEMortgage,
  formatCurrency,
  convertCurrency,
  fetchLiveExchangeRate,
  DEFAULT_DAILY_RATE_USD_TO_ETB,
} from './utils/mortgageCalculations';
import { Language, translations } from './utils/translations';
import { Navbar } from './components/Navbar';
import { MortgageInputsCard } from './components/MortgageInputsCard';
import { PaymentBreakdownCard } from './components/PaymentBreakdownCard';
import { LoanComparison } from './components/LoanComparison';
import { SavingsGoalPlanner } from './components/SavingsGoalPlanner';
import { CurrencyAdvisor } from './components/CurrencyAdvisor';
import { AmortizationSchedule } from './components/AmortizationSchedule';
import { ExtraPaymentsModal } from './components/ExtraPaymentsModal';
import { LoanQuotationModal } from './components/LoanQuotationModal';
import { CBEEligibilityCard } from './components/CBEEligibilityCard';

const DEFAULT_CBE_INPUTS: CBEMortgageInputs = {
  loanType: 'mortgage',
  financingArrangement: 'FCY_FCY',
  homePrice: 15000000, // 15 Million ETB (~$93,000 USD at bank rate)
  equityPercent: 20, // 20% equity -> 8% interest rate
  loanTermYears: 20, // Max 20 years
  baseCurrency: 'ETB (Birr)', // DEFAULT TO ETB
  exchangeRateUSDToETB: DEFAULT_DAILY_RATE_USD_TO_ETB,
  startMonth: new Date().getMonth() + 1,
  startYear: new Date().getFullYear(),
  extraMonthlyPayment: 0,
};

export const App: React.FC = () => {
  const [inputs, setInputs] = useState<CBEMortgageInputs>(DEFAULT_CBE_INPUTS);
  const [activeTab, setActiveTab] = useState<
    'breakdown' | 'comparison' | 'savings' | 'strategy' | 'amortization' | 'eligibility'
  >('breakdown');
  const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  const t = translations[lang];

  // Live Exchange Rate State
  const [exchangeRateInfo, setExchangeRateInfo] = useState<ExchangeRateInfo>({
    rateUSDToETB: DEFAULT_DAILY_RATE_USD_TO_ETB,
    rateEURToETB: DEFAULT_DAILY_RATE_USD_TO_ETB * 1.08,
    rateGBPToETB: DEFAULT_DAILY_RATE_USD_TO_ETB * 1.28,
    lastUpdated: 'Connecting to Bank...',
    source: 'live',
    isLoading: true,
  });

  const loadDailyExchangeRate = async () => {
    setExchangeRateInfo((prev) => ({ ...prev, isLoading: true }));
    const info = await fetchLiveExchangeRate();
    setExchangeRateInfo(info);
    setInputs((prev) => ({
      ...prev,
      exchangeRateUSDToETB: info.rateUSDToETB,
    }));
  };

  useEffect(() => {
    loadDailyExchangeRate();
  }, []);

  // Compute calculation reactively
  const calculation = useMemo(() => {
    return calculateCBEMortgage(inputs);
  }, [inputs]);

  const { summary, monthlyBreakdown, amortization, annualAmortization } = calculation;

  const isETB = inputs.baseCurrency === 'ETB (Birr)';
  const altCurrency: CurrencySymbol = isETB ? 'USD ($)' : 'ETB (Birr)';

  const handleCurrencyChange = (newCur: CurrencySymbol) => {
    const newPrice = convertCurrency(inputs.homePrice, inputs.baseCurrency, newCur, inputs.exchangeRateUSDToETB);
    setInputs((prev) => ({
      ...prev,
      baseCurrency: newCur,
      homePrice: Math.round(newPrice),
    }));
  };

  const handleApplyArrangement = (arr: CBEFinancingArrangement) => {
    setInputs((prev) => ({
      ...prev,
      financingArrangement: arr,
      customInterestRate: undefined,
    }));
    setActiveTab('breakdown');
  };

  const handleApplyLoanAmountFromComparison = (amount: number) => {
    // Derived homePrice given the current equityPercent: homePrice = amount / (1 - equityPercent/100)
    const newHomePrice = Math.round(amount / (1 - inputs.equityPercent / 100));
    setInputs((prev) => ({
      ...prev,
      homePrice: newHomePrice,
    }));
    setActiveTab('breakdown');
  };

  const handleReset = () => {
    setInputs({
      ...DEFAULT_CBE_INPUTS,
      exchangeRateUSDToETB: exchangeRateInfo.rateUSDToETB,
    });
    setActiveTab('breakdown');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currency={inputs.baseCurrency}
        onCurrencyChange={handleCurrencyChange}
        onApplyArrangement={handleApplyArrangement}
        onReset={handleReset}
        exchangeRateInfo={exchangeRateInfo}
        onRefreshRate={loadDailyExchangeRate}
        onOpenQuotation={() => setIsQuotationModalOpen(true)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'am' : 'en')}
      />

      {/* Hero Quick Metrics Bar */}
      <section className="bg-white border-b border-slate-200 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            <div className="border-r border-slate-100 last:border-none pr-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.monthlyRepayment}
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#501344]">
                {formatCurrency(summary.monthlyPayment, inputs.baseCurrency)}
                <span className="text-xs font-normal text-slate-500">/mo</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500 block">
                ≈ {formatCurrency(summary.monthlyPaymentConverted, altCurrency)}/mo
              </span>
            </div>

            <div className="border-r border-slate-100 last:border-none pr-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.loanPrincipal}
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {formatCurrency(summary.loanAmount, inputs.baseCurrency)}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 block">
                {t.equityBadge.replace('{pct}', inputs.equityPercent.toString())}
              </span>
            </div>

            <div className="border-r border-slate-100 last:border-none pr-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.officialRate}
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#6a1a5b]">
                {summary.interestRate}% APR
              </span>
              <span className="text-[11px] font-semibold text-slate-500 block">
                {inputs.financingArrangement.replace('_', '/')} Arrangement
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.totalInterest}
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-800">
                {formatCurrency(summary.totalInterest, inputs.baseCurrency)}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 block">
                {t.overYears.replace('{years}', inputs.loanTermYears.toString())}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full print:hidden">
        <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('breakdown')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'breakdown'
                ? 'border-[#6a1a5b] text-[#6a1a5b]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>{t.tabCalculator}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all relative cursor-pointer ${
              activeTab === 'comparison'
                ? 'border-[#6a1a5b] text-[#6a1a5b]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{t.tabComparison}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('savings')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'savings'
                ? 'border-[#6a1a5b] text-[#6a1a5b]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <PiggyBank className="w-4 h-4" />
            <span>{t.tabSavings}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('strategy')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'strategy'
                ? 'border-[#6a1a5b] text-[#6a1a5b]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>{t.tabStrategy}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('amortization')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'amortization'
                ? 'border-[#6a1a5b] text-[#6a1a5b]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t.tabAmortization}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('eligibility')}
            className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'eligibility'
                ? 'border-[#6a1a5b] text-[#6a1a5b]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{t.tabEligibility}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        {/* Tab 1: CBE Mortgage Calculator */}
        {activeTab === 'breakdown' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <MortgageInputsCard
                  inputs={inputs}
                  onChange={setInputs}
                  currency={inputs.baseCurrency}
                  exchangeRateInfo={exchangeRateInfo}
                  onRefreshRate={loadDailyExchangeRate}
                />
              </div>

              <div className="lg:col-span-7">
                <PaymentBreakdownCard
                  inputs={inputs}
                  summary={summary}
                  currency={inputs.baseCurrency}
                  onOpenExtraPayments={() => setIsExtraModalOpen(true)}
                  onOpenQuotation={() => setIsQuotationModalOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Compare Different Loan Amounts */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <LoanComparison
              inputs={inputs}
              currency={inputs.baseCurrency}
              onApplyLoanAmount={handleApplyLoanAmountFromComparison}
            />
          </div>
        )}

        {/* Tab 3: Equity Savings Planner */}
        {activeTab === 'savings' && (
          <div className="space-y-6">
            <SavingsGoalPlanner
              inputs={inputs}
              currency={inputs.baseCurrency}
              lang={lang}
              onGoToCalculator={() => setActiveTab('breakdown')}
            />
          </div>
        )}

        {/* Tab 4: Currency Repayment Strategy Advisor */}
        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <CurrencyAdvisor
              inputs={inputs}
              currency={inputs.baseCurrency}
              lang={lang}
            />
          </div>
        )}

        {/* Tab 5: Amortization Schedule */}
        {activeTab === 'amortization' && (
          <div className="space-y-6">
            <AmortizationSchedule
              inputs={inputs}
              amortization={amortization}
              annualAmortization={annualAmortization}
              summary={summary}
              currency={inputs.baseCurrency}
            />
          </div>
        )}

        {/* Tab 6: Eligibility & Checklist */}
        {activeTab === 'eligibility' && (
          <div className="space-y-6">
            <CBEEligibilityCard />
          </div>
        )}
      </main>

      {/* Extra Payments Modal */}
      <ExtraPaymentsModal
        isOpen={isExtraModalOpen}
        onClose={() => setIsExtraModalOpen(false)}
        inputs={inputs}
        onChange={setInputs}
        summary={summary}
        currency={inputs.baseCurrency}
        onApplyAndViewSchedule={() => {
          setIsExtraModalOpen(false);
          setActiveTab('amortization');
        }}
      />

      {/* Official Loan Quotation PDF Modal */}
      <LoanQuotationModal
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
        inputs={inputs}
        summary={summary}
        currency={inputs.baseCurrency}
        exchangeRateInfo={exchangeRateInfo}
        lang={lang}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-[#501344] text-white py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-purple-800/60">
            <div>
              <span className="text-base font-black text-white block">
                Commercial Bank of Ethiopia (CBE) — Diaspora Banking Unit
              </span>
              <p className="text-xs text-purple-200 mt-0.5">
                Ras Desta Damtew St, Addis Ababa, Ethiopia | SWIFT: <strong className="text-[#fcd34d]">CBETETAA</strong>
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-purple-200">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#e6af2e]" /> +251 11300 0000
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#e6af2e]" /> DiasporaBanking@cbe.com.et
              </span>
              <a
                href="https://combanketh.et/diaspora-accounts"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#fcd34d] hover:underline font-bold"
              >
                <Globe className="w-3.5 h-3.5" /> combanketh.et
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4 text-[11px] text-purple-300">
            <p>
              Bank Daily Rate: 1 USD = {inputs.exchangeRateUSDToETB.toFixed(2)} ETB | Default Currency: Ethiopian Birr (ETB).
            </p>
            <button
              type="button"
              onClick={() => setIsQuotationModalOpen(true)}
              className="text-[#fcd34d] hover:underline font-bold cursor-pointer"
            >
              Generate Official Loan Quotation (PDF) →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
