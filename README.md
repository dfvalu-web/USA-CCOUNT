# USA-CCOUNT — Next-Gen US GAAP Financial SaaS & Enterprise Accounting Platform

An advanced, production-ready US GAAP double-entry fintech SaaS platform built for US service businesses, multi-entity holdings, and CPA firms.

---

## 🚀 Key Modules & Capabilities

1. **US GAAP Double-Entry Accounting Engine**
   - Real-time Balance Sheet, Trial Balance, Journal Entries and Fixed Assets Sec 179 Depreciation.
   - Dual-Basis Accounting: Accrual (US GAAP) vs. Cash Basis.
   - Multi-Period Comparative Income Statement (YoY & MoM with nominal & percentage growth analysis).
   - Corporate Fiscal Period Selector with custom date range filters, Quarters (Q1-Q4), and Fiscal Year switching.

2. **Banking & Payments Hub**
   - Smart Bank Reconciliation with Receipt OCR scanning and confidence scoring.
   - Plaid Webhooks Console & real-time transaction ingestion.
   - Stripe ACH & Corporate Credit Card billing with instant digital receipts.
   - NACHA ACH disbursement batch generation with SOX Dual Approval Maker-Checker.

3. **Operations & Human Resources**
   - Client B2B Self-Service Portal with direct invoice payment.
   - Worker Portal & ESIGN Act digital contracts with SHA-256 integrity hashing.
   - Multi-state payroll engine (W-2 with FIT, FICA, Medicare & 1099 contractor payments).
   - Service scheduling, timesheet approvals, and client directory.

4. **Tax & IRS Compliance**
   - 50 US States tax engine (LLC Form 1065, S-Corp 1120-S, C-Corp 1120).
   - Schedule K-1 partner equity accounts (IRC 704b, 707c, 1446 foreign partner withholding).
   - Sales Tax Wayfair Nexus & US ZIP code tax directory.
   - State Franchise Taxes (Delaware, California FTB 568, Texas No Tax Due PIR).
   - Year-End IRS Forms: 1099-NEC, W-2, W-3 Transmittal and IRS FIRE electronic transmission file generator.
   - SOC 2 Type II Merkle Tree Audit Trail.

5. **CFA Intelligence & BI**
   - Monte Carlo cash flow simulation (1,000 to 10,000 paths, P10/P50/P90, VaR 95%, Solvency %).
   - Unit Economics under ASC 606 & LTV:CAC metrics.
   - Departmental Budget vs. Actuals Variance Analysis.
   - Financial Modeling Export to CSV/Excel.
   - CFA Copilot AI Chat.

6. **System, Migration & Holding Management**
   - Software Migration Engine with AI De-Para (QuickBooks, Xero, NetSuite, Sage, FreshBooks, Excel).
   - System Audit Engine with 40+ tests, Health Score & Anomaly Auto-Fix + Automated Nightly Scan (Cron Daemon).
   - Company Sandbox Staging with isolated clone, tax simulation & Diff review before safe production promotion.
   - Multi-Entity & Holding Group Consolidation with Intercompany Eliminations (ASC 810).

---

## 🧪 Test Suite

- **115 automated tests passing** across 39 test suites with 100% integrity.
- Zero TypeScript errors (`npx tsc --noEmit` -> code 0).
- Fully synchronized i18n (English, Portuguese, Spanish).

```bash
# Run tests
npm test

# Check types
npx tsc --noEmit

# Start development server
npm run dev
```

---

## 📦 Tech Stack

- **Framework:** Next.js 14 / React 18 / TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **Math & Precision:** Decimal.js
- **Testing:** Vitest
- **Deployment:** Vercel / Cloud Run / AWS
