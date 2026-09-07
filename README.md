# SmartMortgage - Mortgage Breakdown & Loan Comparison Web App

A modern, fast, and responsive financial web application designed for homebuyers and investors to calculate detailed monthly mortgage breakdowns and compare costs across different loan amounts.

## 🚀 Features

- **Monthly Payment Breakdown**:
  - Itemized breakdown of **Principal & Interest**, **Property Taxes**, **Homeowners Insurance**, **PMI (Private Mortgage Insurance)**, and **HOA Dues**.
  - Interactive **Donut Chart** with percentage distributions and instant updates.
  - Automatic PMI calculation that cancels once the loan balance reaches 80% LTV.
- **Different Loan Amount Comparison**:
  - **What-If Loan Sizing Slider**: Dynamically slide through loan amounts from $100k to $1.2M+ to see the exact delta in monthly payment and total lifetime interest vs. your baseline.
  - **Visual Comparison Bar Chart**: Compare monthly payments and total principal vs. interest across different loan amounts.
  - **Side-by-Side Comparison Matrix**: Compare multiple loan scenarios side-by-side with custom loan amount adder.
- **Amortization Schedule & Balance Trajectory**:
  - Interactive **Area Chart** showing remaining principal balance curve and cumulative interest paid over time.
  - **Annual Summary** and **Monthly Detail** table views with pagination.
  - One-click **Export to CSV** for spreadsheets (Excel, Google Sheets).
- **Extra Payments Accelerator**:
  - Model extra monthly, annual, or one-time lump-sum payments.
  - See exact interest saved in dollars and years knocked off the mortgage.
- **Customization & Guidance**:
  - Multi-currency switcher ($, €, £, C$).
  - Quick loan presets (30-Year Fixed, 15-Year Fixed, FHA 3.5% down).
  - Built-in affordability guidelines (28/36 rule, 15 vs 30-year comparison).

## 🛠️ Quick Start

```bash
# Navigate to the project directory
cd C:\Users\Habi\.gemini\antigravity\scratch\mortgage-calculator

# Install dependencies (already installed)
npm install

# Start the local development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
