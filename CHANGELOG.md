# Changelog

All notable changes to the CBE Diaspora Mortgage Calculator project are documented here.

## [1.0.0] — 2026-09-07

### Added
- Full CBE Diaspora Credit Facility calculations (FCY/FCY, LCY/FCY, FCY/LCY)
- Real-time daily ETB/USD exchange rate synchronization with live API
- Interactive loan sizing sliders with multi-scenario matrix comparison
- 7% Equity Savings Goal Planner with timeline-to-qualification modeling
- Currency Repayment Strategy Advisor (FCY vs LCY analysis)
- Official 1-page Loan Quotation PDF generation
- Bilingual support (English & Amharic)
- Responsive design with mobile-first layout
- Capacitor 8 mobile bridge for Android & iOS native apps

### Fixed
- iOS build pipeline: removed CocoaPods dependency, configured modern Swift Package Manager (SPM)
- Android build workflow for Gradle 8 compatibility
- Node.js version updated from 20 to 22 across CI workflows

### Infrastructure
- Cloudflare Pages deployment with global edge CDN
- GitHub Actions CI/CD for automated Android APK and iOS IPA builds
- PWA support with service worker and manifest