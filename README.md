# Commercial Bank of Ethiopia (CBE) Diaspora Mortgage Platform

[![Live Web App](https://img.shields.io/badge/Live%20Demo-Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://cbe-diaspora-mortgage.pages.dev)
[![CI/CD Mobile Builds](https://github.com/DaveMian/mortgage-calculator/actions/workflows/build-mobile.yml/badge.svg?style=for-the-badge)](https://github.com/DaveMian/mortgage-calculator/actions/workflows/build-mobile.yml)
[![Platform - Web | Android | iOS](https://img.shields.io/badge/Platforms-Web%20%7C%20Android%20%7C%20iOS-007ACC?style=for-the-badge)](https://github.com/DaveMian/mortgage-calculator)
[![Framework - React 18 + Capacitor 8](https://img.shields.io/badge/Stack-React%2018%20%7C%20Capacitor%208%20%7C%20Vite%206-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://vitejs.dev)

An enterprise-grade, financial modeling web and cross-platform mobile application designed specifically for the **Ethiopian Diaspora Community**. Built in compliance with the **Commercial Bank of Ethiopia (CBE) Diaspora Consumer Credit Scheme**, this platform empowers prospective diaspora homebuyers and investors to calculate itemized mortgage repayment breakdowns, analyze currency risks, plan down payment savings, and generate official loan quotations.

---

## 🌐 Live Production Deployment

- **Production URL**: [https://cbe-diaspora-mortgage.pages.dev](https://cbe-diaspora-mortgage.pages.dev)
- **Hosting**: Cloudflare Pages Global Edge Network (High availability, sub-50ms latency worldwide)
- **Primary Operating Currency**: Ethiopian Birr (**ETB**) with real-time daily **USD** bank exchange rate synchronization.

---

## ✨ Key Features & Capabilities

### 1. 🇪🇹 Official CBE Diaspora Credit Facilities
Configured with the exact lending matrices of the Commercial Bank of Ethiopia:
- **FCY / FCY** *(Foreign Currency Account & Repayment)*:
  - **7.00% – 8.50%** interest rates based on equity contribution (10% to 50%).
  - Tenures up to **20 years** with repayment in USD/EUR/GBP.
- **LCY / FCY** *(Local Currency Facility serviced from Foreign Currency)*:
  - **8.00% – 10.50%** interest rates.
  - Flexible repayment structures leveraging diaspora remittance flows.
- **FCY / LCY** *(Diaspora Birr Account serviced in Local Birr)*:
  - **11.50% – 13.50%** interest rates for domestic income or local business returns.

### 2. 💱 Real-Time Daily Bank Exchange Rate Synchronizer
- Computes all loan amounts, down payments, and monthly amortizations simultaneously in **ETB** and **USD**.
- Automatically fetches current interbank forex rates via live API with instant manual refresh and fallback safety mechanisms.

### 3. 📊 Visual Loan Sizing & Multi-Scenario Matrix
- **Interactive Sizing Slider**: Dynamically adjust loan amounts to instantly visualize monthly payment fluctuations and lifetime interest costs.
- **Side-by-Side Comparison**: Evaluate differing down payment tiers (10%, 20%, 30%, 50%) and tenures (5 to 20 years) simultaneously.
- **Amortization Schedule**: Interactive Recharts balance trajectory curve with one-click **CSV export** for bank loan officers.

### 4. 🎯 7% Equity Savings Goal Planner
- Calculates the mandatory initial equity deposit required by CBE.
- Models timeline-to-qualification (in months) based on monthly diaspora foreign currency remittances.

### 5. 💡 Currency Repayment Strategy Advisor
- Financial advisory algorithm comparing **Foreign Currency (FCY)** vs. **Local Birr (LCY)** servicing.
- Assesses foreign exchange depreciation risk against interest rate differentials (7.00% vs 13.50%) to recommend the optimal borrowing pathway.

### 6. 📄 Official 1-Page Loan Quotation PDF Modal
- Generates a branded, formatted summary statement ready for printing or digital PDF export.
- Formatted to meet CBE branch and diaspora mortgage loan application submission standards.

### 7. 🌐 Bilingual Experience (English & Amharic / አማርኛ)
- One-click language toggle across the entire platform.
- Fully localized financial terminology for domestic and overseas users.

---

## 📱 Mobile Architecture & Store Builds

The platform uses a unified modern codebase running as a **Progressive Web App (PWA)** and native mobile applications powered by **Capacitor 8**:

```
                              ┌─────────────────────────┐
                              │  React 18 + TypeScript  │
                              │  Vite 6 + Tailwind CSS  │
                              └────────────┬────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
             ▼      ▼               ▼      ▼               ▼      ▼
    ┌──────────────────────┐┌──────────────────────┐┌──────────────────────┐
    │   Cloudflare Pages   ││    Android Platform  ││     iOS Platform     │
    │  Edge Web Deployment ││  Gradle + Android SDK││ Swift Package Mgr SPM│
    │  (Live Production)   ││   (.apk / .aab)      ││   (Xcode / .ipa)     │
    └──────────────────────┘└──────────────────────┘└──────────────────────┘
```

### Downloadable Build Artifacts
Pre-built packages are generated in the [`builds/`](./builds) folder and via automated GitHub Actions:
- **Google Play Store Release**: `builds/cbe-diaspora-mortgage-release.aab` (Android App Bundle)
- **Android Device Test APK**: `builds/cbe-diaspora-mortgage.apk`
- **iOS App Store Package**: Cloud-compiled via GitHub Actions (`App.ipa` and `App.xcarchive`)

---

## 📋 CBE Diaspora Lending Policy Reference

| Product Category | Currency Source | Repayment Currency | Down Payment Tier | Annual Interest Rate | Max Tenure |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FCY / FCY** | Foreign Currency | Foreign Currency | 50% Equity | **7.00%** | Up to 20 Years |
| **FCY / FCY** | Foreign Currency | Foreign Currency | 30% Equity | **7.50%** | Up to 20 Years |
| **FCY / FCY** | Foreign Currency | Foreign Currency | 20% Equity | **8.00%** | Up to 20 Years |
| **FCY / FCY** | Foreign Currency | Foreign Currency | 10% Equity | **8.50%** | Up to 20 Years |
| **LCY / FCY** | Local Currency | Foreign Currency | 20% – 50% | **8.00% – 10.50%** | Up to 20 Years |
| **FCY / LCY** | Diaspora Birr | Local Birr (ETB) | 20% – 50% | **11.50% – 13.50%** | Up to 20 Years |

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Core Framework** | React 18 with TypeScript |
| **Bundler & Build Tool** | Vite 6 |
| **Styling & Design System** | Tailwind CSS with responsive layout and glassmorphism |
| **Data Visualization** | Recharts (Responsive Donut, Line, and Area charts) |
| **Icons & Assets** | Lucide React |
| **Native Mobile Bridge** | Capacitor 8 (Swift Package Manager for iOS, Gradle 8 for Android) |
| **Web Hosting** | Cloudflare Pages with Global CDN Edge Caching |
| **CI/CD Automation** | GitHub Actions (Ubuntu and macOS cloud runners) |

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: v20.x or v22.x
- **Git**

### Installation & Execution

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DaveMian/mortgage-calculator.git
   cd mortgage-calculator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.
   
   > **Testing on mobile?** Add `--host` to expose the server on your network: `npx vite --host` or `npm run dev -- --host`. Then open `http://<YOUR_IP>:5173` on your phone/tablet.

4. **Compile production web build**:
   ```bash
   npm run build
   ```

---

## 📦 Building Mobile Applications

### Android Build
```bash
# Sync web assets to Android
npx cap sync android

# Build release bundle (requires JDK 21 and Android SDK)
cd android
./gradlew bundleRelease
```
Output will be located at: `android/app/build/outputs/bundle/release/app-release.aab`.

### iOS Build (Cloud or Local Mac)
This project is configured with modern **Swift Package Manager (SPM)**:
```bash
# Sync web assets to iOS
npx cap sync ios

# Open native project in Xcode (on macOS)
npx cap open ios
```
Or push directly to the `main` branch to let the automated [GitHub Actions Workflow](./.github/workflows/build-mobile.yml) build your `.ipa` in the cloud on a macOS runner.

---

## 📄 License & Attribution
Designed and maintained for Ethiopian diaspora financial literacy and mortgage planning. Reference rates derived from official Commercial Bank of Ethiopia Consumer Credit Schemes.
