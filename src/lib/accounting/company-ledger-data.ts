import { AccountWithLines } from './financial-statements';

export interface CompanyJournalEntry {
  id: string;
  date: string;
  memo: string;
  amount: number;
  basis: 'ACCRUAL' | 'CASH' | 'BOTH';
  status: 'POSTED' | 'DRAFT';
}

export class CompanyLedgerEngine {
  public static getAccountsForCompany(companyId: string, legalName?: string): AccountWithLines[] {
    const isMilla = companyId.includes('milla') || (legalName && legalName.toLowerCase().includes('milla'));
    const isHorizon = companyId.includes('002') || (legalName && legalName.toLowerCase().includes('horizon'));
    const isApexDelaware = companyId.includes('003') || (legalName && legalName.toLowerCase().includes('delaware'));

    if (isMilla) {
      return [
        {
          code: '1010',
          name: 'Initiate Business Checking & Money Market (Truist / Chase)',
          type: 'ASSET',
          subType: 'CASH_AND_CASH_EQUIVALENTS',
          lines: [
            // 2021
            { debit: 5008.98, credit: 0, date: '2021-11-15', basis: 'BOTH' },
            // 2022
            { debit: 115000.00, credit: 0, date: '2022-01-01', basis: 'BOTH' },
            { debit: 0, credit: 48500.00, date: '2022-01-10', basis: 'BOTH' },
            { debit: 342851.75, credit: 0, date: '2022-06-30', basis: 'BOTH' },
            { debit: 0, credit: 3000.00, date: '2022-12-15', basis: 'BOTH' },
            { debit: 0, credit: 40617.90, date: '2022-12-20', basis: 'BOTH' },
            { debit: 0, credit: 40088.01, date: '2022-12-31', basis: 'BOTH' },
            // 2023
            { debit: 477370.70, credit: 0, date: '2023-06-30', basis: 'BOTH' },
            { debit: 0, credit: 376986.76, date: '2023-12-15', basis: 'BOTH' },
            { debit: 0, credit: 30144.95, date: '2023-12-20', basis: 'BOTH' },
            { debit: 0, credit: 62092.05, date: '2023-12-31', basis: 'BOTH' },
            // 2024
            { debit: 412313.30, credit: 0, date: '2024-06-30', basis: 'BOTH' },
            { debit: 0, credit: 169938.00, date: '2024-12-15', basis: 'BOTH' },
            { debit: 0, credit: 141023.00, date: '2024-12-20', basis: 'BOTH' },
            { debit: 0, credit: 60484.00, date: '2024-12-28', basis: 'BOTH' },
            { debit: 0, credit: 61431.37, date: '2024-12-31', basis: 'BOTH' },
            { debit: 0, credit: 45966.94, date: '2024-12-31', basis: 'BOTH' },
            // 2025
            { debit: 364061.65, credit: 0, date: '2025-06-30', basis: 'BOTH' },
            { debit: 0, credit: 108921.00, date: '2025-12-15', basis: 'BOTH' },
            { debit: 0, credit: 108667.00, date: '2025-12-20', basis: 'BOTH' },
            { debit: 0, credit: 77606.00, date: '2025-12-28', basis: 'BOTH' },
            { debit: 0, credit: 25082.00, date: '2025-12-31', basis: 'BOTH' },
            { debit: 0, credit: 32440.00, date: '2025-12-31', basis: 'BOTH' },
            // 2026 YTD
            { debit: 209750.73, credit: 0, date: '2026-04-30', basis: 'BOTH' },
            { debit: 0, credit: 45000.00, date: '2026-06-15', basis: 'BOTH' },
            { debit: 0, credit: 53420.00, date: '2026-07-20', basis: 'BOTH' },
            { debit: 0, credit: 21000.00, date: '2026-08-15', basis: 'BOTH' },
            { debit: 0, credit: 18000.00, date: '2026-08-20', basis: 'BOTH' },
          ],
        },
        {
          code: '1200',
          name: 'Accounts Receivable (Commercial Clients)',
          type: 'ASSET',
          subType: 'ACCOUNTS_RECEIVABLE',
          lines: [
            { debit: 62400, credit: 0, date: '2025-11-30', basis: 'ACCRUAL' },
          ],
        },
        {
          code: '1510',
          name: 'Fleet Cleaning Vans & Commercial Extractors',
          type: 'ASSET',
          subType: 'PROPERTY_PLANT_EQUIPMENT',
          lines: [
            { debit: 48500, credit: 0, date: '2022-01-10', basis: 'BOTH' },
          ],
        },
        {
          code: '1590',
          name: 'Accumulated Depreciation - Fleet & Equipment',
          type: 'ASSET',
          subType: 'ACCUMULATED_DEPRECIATION',
          lines: [
            { debit: 0, credit: 12000, date: '2025-12-31', basis: 'BOTH' },
          ],
        },
        {
          code: '2010',
          name: 'Accounts Payable (Suppliers & Contractors)',
          type: 'LIABILITY',
          subType: 'ACCOUNTS_PAYABLE',
          lines: [
            { debit: 0, credit: 18795, date: '2025-12-20', basis: 'ACCRUAL' },
          ],
        },
        {
          code: '2210',
          name: 'Georgia Department of Revenue Sales Tax Payable',
          type: 'LIABILITY',
          subType: 'SALES_TAX_PAYABLE',
          lines: [
            { debit: 0, credit: 14200, date: '2025-12-31', basis: 'BOTH' },
          ],
        },
        {
          code: '3010',
          name: 'Members Capital Account (IRC 704b)',
          type: 'EQUITY',
          subType: 'COMMON_STOCK',
          lines: [
            { debit: 0, credit: 115000.00, date: '2022-01-01', basis: 'BOTH' },
          ],
        },
        {
          code: '3030',
          name: 'Partner Distributions / Draws',
          type: 'EQUITY',
          subType: 'OWNERS_DRAW',
          lines: [
            { debit: 40088.01, credit: 0, date: '2022-12-31', basis: 'BOTH' },
            { debit: 62092.05, credit: 0, date: '2023-12-31', basis: 'BOTH' },
            { debit: 45966.94, credit: 0, date: '2024-12-31', basis: 'BOTH' },
            { debit: 32440.00, credit: 0, date: '2025-12-31', basis: 'BOTH' },
            { debit: 18000.00, credit: 0, date: '2026-08-20', basis: 'BOTH' },
          ],
        },
        {
          code: '4010',
          name: 'Cleaning & Janitorial Services Revenue',
          type: 'REVENUE',
          subType: 'SERVICE_REVENUE',
          lines: [
            { debit: 0, credit: 5008.98, date: '2021-11-15', basis: 'BOTH' },
            { debit: 0, credit: 342851.75, date: '2022-06-30', basis: 'BOTH' },
            { debit: 0, credit: 477370.70, date: '2023-06-30', basis: 'BOTH' },
            { debit: 0, credit: 412313.30, date: '2024-06-30', basis: 'BOTH' },
            { debit: 0, credit: 364061.65, date: '2025-06-30', basis: 'BOTH' },
            { debit: 0, credit: 62400.00, date: '2025-11-30', basis: 'ACCRUAL' },
            { debit: 0, credit: 209750.73, date: '2026-04-30', basis: 'BOTH' },
          ],
        },
        {
          code: '5010',
          name: 'Subcontractor Labor 1099 Expenses',
          type: 'EXPENSE',
          subType: 'COST_OF_SERVICES_DIRECT_LABOR',
          lines: [
            { debit: 376986.76, credit: 0, date: '2023-12-15', basis: 'BOTH' },
            { debit: 169938.00, credit: 0, date: '2024-12-15', basis: 'BOTH' },
            { debit: 108921.00, credit: 0, date: '2025-12-15', basis: 'BOTH' },
            { debit: 45000.00, credit: 0, date: '2026-06-15', basis: 'BOTH' },
          ],
        },
        {
          code: '5020',
          name: 'Direct Labor W-2 Wages',
          type: 'EXPENSE',
          subType: 'COST_OF_SERVICES_DIRECT_LABOR',
          lines: [
            { debit: 3000.00, credit: 0, date: '2022-12-15', basis: 'BOTH' },
            { debit: 141023.00, credit: 0, date: '2024-12-20', basis: 'BOTH' },
            { debit: 108667.00, credit: 0, date: '2025-12-20', basis: 'BOTH' },
            { debit: 53420.00, credit: 0, date: '2026-07-20', basis: 'BOTH' },
          ],
        },
        {
          code: '6010',
          name: 'Legal & Accounting Professional Fees',
          type: 'EXPENSE',
          subType: 'GENERAL_ADMINISTRATIVE_SG_A',
          lines: [
            { debit: 60484.00, credit: 0, date: '2024-12-28', basis: 'BOTH' },
            { debit: 77606.00, credit: 0, date: '2025-12-28', basis: 'BOTH' },
            { debit: 21000.00, credit: 0, date: '2026-08-15', basis: 'BOTH' },
          ],
        },
        {
          code: '6040',
          name: 'Vehicle, Fuel & Road Services',
          type: 'EXPENSE',
          subType: 'GENERAL_ADMINISTRATIVE_SG_A',
          lines: [
            { debit: 15200.00, credit: 0, date: '2022-12-20', basis: 'BOTH' },
            { debit: 30144.95, credit: 0, date: '2023-12-20', basis: 'BOTH' },
            { debit: 61431.37, credit: 0, date: '2024-12-31', basis: 'BOTH' },
            { debit: 25082.00, credit: 0, date: '2025-12-31', basis: 'BOTH' },
            { debit: 14000.00, credit: 0, date: '2026-08-15', basis: 'BOTH' },
          ],
        },
        {
          code: '6050',
          name: 'Cleaning Chemical Supplies & Consumables',
          type: 'EXPENSE',
          subType: 'COST_OF_SERVICES_SUPPLIES',
          lines: [
            { debit: 25417.90, credit: 0, date: '2022-12-20', basis: 'BOTH' },
            { debit: 32995.00, credit: 0, date: '2025-12-20', basis: 'BOTH' },
          ],
        },
        {
          code: '6060',
          name: 'Depreciation Expense',
          type: 'EXPENSE',
          subType: 'GENERAL_ADMINISTRATIVE_SG_A',
          lines: [
            { debit: 12000.00, credit: 0, date: '2025-12-31', basis: 'BOTH' },
          ],
        },
      ];
    }

    if (isHorizon) {
      return [
        {
          code: '1010',
          name: 'Silicon Valley Bank / Mercury Checking',
          type: 'ASSET',
          subType: 'CASH_AND_CASH_EQUIVALENTS',
          lines: [
            { debit: 210000, credit: 0, date: '2026-01-01', basis: 'BOTH' },
            { debit: 172000, credit: 0, date: '2026-03-31', basis: 'BOTH' },
            { debit: 0, credit: 80000, date: '2026-01-05', basis: 'BOTH' },
            { debit: 0, credit: 48000, date: '2026-03-31', basis: 'BOTH' },
            { debit: 0, credit: 30000, date: '2026-03-31', basis: 'BOTH' },
          ],
        },
        {
          code: '1200',
          name: 'Accounts Receivable (SaaS Clients)',
          type: 'ASSET',
          subType: 'ACCOUNTS_RECEIVABLE',
          lines: [
            { debit: 68000, credit: 0, date: '2026-02-15', basis: 'ACCRUAL' },
          ],
        },
        {
          code: '1510',
          name: 'Proprietary IP & FinTech Software Algorithms',
          type: 'ASSET',
          subType: 'PROPERTY_PLANT_EQUIPMENT',
          lines: [
            { debit: 80000, credit: 0, date: '2026-01-05', basis: 'BOTH' },
          ],
        },
        {
          code: '2010',
          name: 'Accounts Payable',
          type: 'LIABILITY',
          subType: 'ACCOUNTS_PAYABLE',
          lines: [
            { debit: 0, credit: 22000, date: '2026-03-20', basis: 'ACCRUAL' },
          ],
        },
        {
          code: '3010',
          name: 'Common Stock & Paid-in Capital',
          type: 'EQUITY',
          subType: 'COMMON_STOCK',
          lines: [
            { debit: 0, credit: 210000, date: '2026-01-01', basis: 'BOTH' },
          ],
        },
        {
          code: '4010',
          name: 'SaaS Subscription & API License Revenue',
          type: 'REVENUE',
          subType: 'SERVICE_REVENUE',
          lines: [
            { debit: 0, credit: 172000, date: '2026-03-31', basis: 'BOTH' },
            { debit: 0, credit: 68000, date: '2026-02-15', basis: 'ACCRUAL' },
          ],
        },
        {
          code: '5010',
          name: 'Cloud Hosting & Server Infrastructure (AWS)',
          type: 'EXPENSE',
          subType: 'COST_OF_SERVICES_SUPPLIES',
          lines: [
            { debit: 48000, credit: 0, date: '2026-03-31', basis: 'BOTH' },
          ],
        },
        {
          code: '6010',
          name: 'R&D Engineering & Compliance Audits',
          type: 'EXPENSE',
          subType: 'GENERAL_ADMINISTRATIVE_SG_A',
          lines: [
            { debit: 30000, credit: 0, date: '2026-03-31', basis: 'BOTH' },
            { debit: 22000, credit: 0, date: '2026-03-20', basis: 'ACCRUAL' },
          ],
        },
      ];
    }

    if (isApexDelaware) {
      return [
        {
          code: '1010',
          name: 'JPMorgan Chase Corporate Treasury Account',
          type: 'ASSET',
          subType: 'CASH_AND_CASH_EQUIVALENTS',
          lines: [
            { debit: 400000, credit: 0, date: '2026-01-01', basis: 'BOTH' },
            { debit: 400000, credit: 0, date: '2026-06-30', basis: 'BOTH' },
            { debit: 0, credit: 110000, date: '2026-01-10', basis: 'BOTH' },
            { debit: 0, credit: 110000, date: '2026-06-30', basis: 'BOTH' },
            { debit: 0, credit: 75000, date: '2026-06-30', basis: 'BOTH' },
          ],
        },
        {
          code: '1200',
          name: 'Accounts Receivable (Enterprise Contracts)',
          type: 'ASSET',
          subType: 'ACCOUNTS_RECEIVABLE',
          lines: [
            { debit: 120000, credit: 0, date: '2026-05-15', basis: 'ACCRUAL' },
          ],
        },
        {
          code: '1510',
          name: 'High-Density Datacenter Compute Servers',
          type: 'ASSET',
          subType: 'PROPERTY_PLANT_EQUIPMENT',
          lines: [
            { debit: 110000, credit: 0, date: '2026-01-10', basis: 'BOTH' },
          ],
        },
        {
          code: '2010',
          name: 'Accounts Payable',
          type: 'LIABILITY',
          subType: 'ACCOUNTS_PAYABLE',
          lines: [
            { debit: 0, credit: 35000, date: '2026-06-25', basis: 'ACCRUAL' },
          ],
        },
        {
          code: '3010',
          name: 'C-Corporation Common Stock (Delaware)',
          type: 'EQUITY',
          subType: 'COMMON_STOCK',
          lines: [
            { debit: 0, credit: 400000, date: '2026-01-01', basis: 'BOTH' },
          ],
        },
        {
          code: '4010',
          name: 'Enterprise Cloud Infrastructure Services',
          type: 'REVENUE',
          subType: 'SERVICE_REVENUE',
          lines: [
            { debit: 0, credit: 400000, date: '2026-06-30', basis: 'BOTH' },
            { debit: 0, credit: 120000, date: '2026-05-15', basis: 'ACCRUAL' },
          ],
        },
        {
          code: '5010',
          name: 'Direct Compute Bandwidth & Colocation Costs',
          type: 'EXPENSE',
          subType: 'COST_OF_SERVICES_SUPPLIES',
          lines: [
            { debit: 110000, credit: 0, date: '2026-06-30', basis: 'BOTH' },
          ],
        },
        {
          code: '6010',
          name: 'Enterprise SG&A, Legal & Patent Filing',
          type: 'EXPENSE',
          subType: 'GENERAL_ADMINISTRATIVE_SG_A',
          lines: [
            { debit: 75000, credit: 0, date: '2026-06-30', basis: 'BOTH' },
            { debit: 35000, credit: 0, date: '2026-06-25', basis: 'ACCRUAL' },
          ],
        },
      ];
    }

    // Default: Apex CleanOps & Cloud Tech LLC (TX)
    return [
      {
        code: '1010',
        name: 'Chase Business Operating Checking',
        type: 'ASSET',
        subType: 'CASH_AND_CASH_EQUIVALENTS',
        lines: [
          { debit: 325000, credit: 0, date: '2026-01-01', basis: 'BOTH' },
          { debit: 140000, credit: 0, date: '2026-03-31', basis: 'BOTH' },
          { debit: 0, credit: 25000, date: '2026-01-05', basis: 'BOTH' },
          { debit: 0, credit: 45000, date: '2026-03-31', basis: 'BOTH' },
          { debit: 0, credit: 13000, date: '2026-03-31', basis: 'BOTH' },
        ],
      },
      {
        code: '1200',
        name: 'Accounts Receivable (A/R)',
        type: 'ASSET',
        subType: 'ACCOUNTS_RECEIVABLE',
        lines: [
          { debit: 45000, credit: 0, date: '2026-02-15', basis: 'ACCRUAL' },
        ],
      },
      {
        code: '1510',
        name: 'Industrial Cleaning Machinery & Vans',
        type: 'ASSET',
        subType: 'PROPERTY_PLANT_EQUIPMENT',
        lines: [
          { debit: 25000, credit: 0, date: '2026-01-05', basis: 'BOTH' },
        ],
      },
      {
        code: '2010',
        name: 'Accounts Payable (A/P)',
        type: 'LIABILITY',
        subType: 'ACCOUNTS_PAYABLE',
        lines: [
          { debit: 0, credit: 18200, date: '2026-03-20', basis: 'ACCRUAL' },
        ],
      },
      {
        code: '2100',
        name: 'Customer Retainer Deposits',
        type: 'LIABILITY',
        subType: 'UNEARNED_REVENUE_RETAINERS',
        lines: [
          { debit: 0, credit: 15000, date: '2026-02-28', basis: 'BOTH' },
        ],
      },
      {
        code: '3010',
        name: 'Members Capital Account (Texas LLC)',
        type: 'EQUITY',
        subType: 'COMMON_STOCK',
        lines: [
          { debit: 0, credit: 325000, date: '2026-01-01', basis: 'BOTH' },
        ],
      },
      {
        code: '4010',
        name: 'Commercial Janitorial & Cleaning Sales',
        type: 'REVENUE',
        subType: 'SERVICE_REVENUE',
        lines: [
          { debit: 0, credit: 140000, date: '2026-03-31', basis: 'BOTH' },
          { debit: 0, credit: 45000, date: '2026-02-15', basis: 'ACCRUAL' },
        ],
      },
      {
        code: '5010',
        name: 'Direct Labor Salaries (W-2 Crew)',
        type: 'EXPENSE',
        subType: 'COST_OF_SERVICES_DIRECT_LABOR',
        lines: [
          { debit: 45000, credit: 0, date: '2026-03-31', basis: 'BOTH' },
        ],
      },
      {
        code: '6010',
        name: 'Cleaning Supplies & Vehicle Operations',
        type: 'EXPENSE',
        subType: 'GENERAL_ADMINISTRATIVE_SG_A',
        lines: [
          { debit: 13000, credit: 0, date: '2026-03-31', basis: 'BOTH' },
          { debit: 33200, credit: 0, date: '2026-03-20', basis: 'ACCRUAL' },
        ],
      },
    ];
  }

  public static getJournalEntriesForCompany(companyId: string, legalName?: string): CompanyJournalEntry[] {
    const isMilla = companyId.includes('milla') || (legalName && legalName.toLowerCase().includes('milla'));

    if (isMilla) {
      return [
        // 2021
        { id: 'JE-MILA-2021-01', date: '2021-11-15', memo: 'Contratos Iniciais de Prestação de Serviços de Limpeza', amount: 5008.98, basis: 'BOTH', status: 'POSTED' },

        // 2022
        { id: 'JE-MILA-2022-01', date: '2022-01-01', memo: 'Integralização de Capital Inicial dos Sócios (IRC 704b)', amount: 115000.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2022-02', date: '2022-01-10', memo: 'Aquisição de Frota & Vans de Limpeza Comercial', amount: 48500.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2022-03', date: '2022-06-30', memo: 'Faturamento de Serviços de Limpeza Residencial e Comercial 2022', amount: 342851.75, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2022-04', date: '2022-12-15', memo: 'Folha de Pagamento Salários Diretos Operacionais W-2', amount: 3000.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2022-05', date: '2022-12-20', memo: 'Despesas de Operação de Frota e Combustível', amount: 15200.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2022-06', date: '2022-12-20', memo: 'Produtos Químicos e Insumos de Higienização', amount: 25417.90, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2022-07', date: '2022-12-31', memo: 'Distribuição de Lucros aos Sócios (Partner Draws)', amount: 40088.01, basis: 'BOTH', status: 'POSTED' },

        // 2023
        { id: 'JE-MILA-2023-01', date: '2023-06-30', memo: 'Faturamento de Serviços de Limpeza e Facilities 2023', amount: 477370.70, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2023-02', date: '2023-12-15', memo: 'Pagamentos a Subcontratados 1099 Independent Contractors', amount: 376986.76, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2023-03', date: '2023-12-20', memo: 'Despesas de Frota e Materiais Operacionais', amount: 30144.95, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2023-04', date: '2023-12-31', memo: 'Distribuição de Lucros aos Sócios (Partner Draws)', amount: 62092.05, basis: 'BOTH', status: 'POSTED' },

        // 2024
        { id: 'JE-MILA-2024-01', date: '2024-06-30', memo: 'Faturamento Anual de Serviços de Limpeza 2024', amount: 412313.30, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2024-02', date: '2024-12-15', memo: 'Honorários de Subcontratados 1099', amount: 169938.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2024-03', date: '2024-12-20', memo: 'Salários Operacionais Diretos Equipe W-2', amount: 141023.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2024-04', date: '2024-12-28', memo: 'Honorários Jurídicos, Regulatórios e de Auditoria CPA', amount: 60484.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2024-05', date: '2024-12-31', memo: 'Despesas de Veículos, Combustível e Manutenção de Frota', amount: 61431.37, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2024-06', date: '2024-12-31', memo: 'Retiradas e Distribuição de Sócios (Partner Draws)', amount: 45966.94, basis: 'BOTH', status: 'POSTED' },

        // 2025
        { id: 'JE-MILA-2025-01', date: '2025-06-30', memo: 'Faturamento de Serviços de Limpeza à Vista (Cash Revenue)', amount: 364061.65, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2025-02', date: '2025-11-30', memo: 'Faturamento a Prazo de Clientes Corporativos (A/R)', amount: 62400.00, basis: 'ACCRUAL', status: 'POSTED' },
        { id: 'JE-MILA-2025-03', date: '2025-12-15', memo: 'Pagamentos de Prestadores de Serviços (1099 Contractors)', amount: 108921.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2025-04', date: '2025-12-20', memo: 'Salários e Encargos da Equipe Própria (W-2 Wages)', amount: 108667.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2025-05', date: '2025-12-28', memo: 'Honorários de Assessoria Contábil e Jurídica (Legal & CPA)', amount: 77606.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2025-06', date: '2025-12-31', memo: 'Despesas com Frota de Vans, Seguro e Combustível', amount: 25082.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2025-07', date: '2025-12-31', memo: 'Insumos Químicos e Materiais de Higienização (A/P)', amount: 32995.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2025-08', date: '2025-12-31', memo: 'Depreciação Anual de Vans e Equipamentos Industriais', amount: 12000.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2025-09', date: '2025-12-31', memo: 'Retiradas de Lucros pelos Sócios (Partner Draws)', amount: 32440.00, basis: 'BOTH', status: 'POSTED' },

        // 2026 YTD
        { id: 'JE-MILA-2026-01', date: '2026-04-30', memo: 'Faturamento de Serviços 2026 YTD (Jan-Abr)', amount: 209750.73, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2026-02', date: '2026-06-15', memo: 'Subcontratados 1099 2026 YTD', amount: 45000.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2026-03', date: '2026-07-20', memo: 'Salários Operacionais W-2 2026 YTD', amount: 53420.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2026-04', date: '2026-08-15', memo: 'Honorários e Materiais Operacionais 2026', amount: 21000.00, basis: 'BOTH', status: 'POSTED' },
        { id: 'JE-MILA-2026-05', date: '2026-08-20', memo: 'Retiradas de Sócios 2026 YTD', amount: 18000.00, basis: 'BOTH', status: 'POSTED' },
      ];
    }

    return [
      { id: 'JE-2026-0001', date: '2026-01-01', memo: 'Initial Capital Contribution', amount: 325000, basis: 'BOTH', status: 'POSTED' },
      { id: 'JE-2026-0002', date: '2026-01-05', memo: 'Purchase of Industrial Cleaning Machinery & Vans', amount: 25000, basis: 'BOTH', status: 'POSTED' },
      { id: 'JE-2026-0003', date: '2026-02-15', memo: 'Commercial Invoiced Revenue - Monthly Retainers', amount: 185000, basis: 'ACCRUAL', status: 'POSTED' },
      { id: 'JE-2026-0004', date: '2026-03-31', memo: 'Direct Labor Payroll Disbursed (W-2 Crew)', amount: 45000, basis: 'BOTH', status: 'POSTED' },
      { id: 'JE-2026-0005', date: '2026-03-31', memo: 'Cleaning Supplies, Eco Chemicals & Fuel Expense', amount: 13000, basis: 'BOTH', status: 'POSTED' },
    ];
  }
}
