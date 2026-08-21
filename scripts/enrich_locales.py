import json

expanded_keys = {
  "common": {
    "appName": {
      "en": "Mister Contábil",
      "pt": "Mister Contábil",
      "es": "Mister Contábil"
    },
    "tagline": {
      "en": "US GAAP Financial & Tax Intelligence Platform",
      "pt": "Plataforma de Inteligência Contábil e Fiscal US GAAP",
      "es": "Plataforma de Inteligencia Contable y Fiscal US GAAP"
    },
    "search": {
      "en": "Search or type command...",
      "pt": "Buscar ou digitar comando...",
      "es": "Buscar o escribir comando..."
    },
    "commandPalette": {
      "en": "Command Palette",
      "pt": "Paleta de Comandos",
      "es": "Paleta de Comandos"
    },
    "accrual": {
      "en": "Accrual Basis",
      "pt": "Regime de Competência",
      "es": "Base de Devengado"
    },
    "cash": {
      "en": "Cash Basis",
      "pt": "Regime de Caixa",
      "es": "Base de Efectivo"
    },
    "language": {
      "en": "Language",
      "pt": "Idioma",
      "es": "Idioma"
    },
    "theme": {
      "en": "Theme",
      "pt": "Tema",
      "es": "Tema"
    },
    "dark": {
      "en": "Dark",
      "pt": "Escuro",
      "es": "Oscuro"
    },
    "light": {
      "en": "Light",
      "pt": "Claro",
      "es": "Claro"
    },
    "save": {
      "en": "Save",
      "pt": "Salvar",
      "es": "Guardar"
    },
    "cancel": {
      "en": "Cancel",
      "pt": "Cancelar",
      "es": "Cancelar"
    },
    "create": {
      "en": "Create",
      "pt": "Criar",
      "es": "Crear"
    },
    "delete": {
      "en": "Delete",
      "pt": "Excluir",
      "es": "Eliminar"
    },
    "edit": {
      "en": "Edit",
      "pt": "Editar",
      "es": "Editar"
    },
    "export": {
      "en": "Export PDF/CSV",
      "pt": "Exportar PDF/CSV",
      "es": "Exportar PDF/CSV"
    },
    "print": {
      "en": "Print (PDF)",
      "pt": "Imprimir (PDF)",
      "es": "Imprimir (PDF)"
    },
    "balanced": {
      "en": "Balanced",
      "pt": "Balanceado",
      "es": "Cuadrado"
    },
    "unbalanced": {
      "en": "Unbalanced",
      "pt": "Desbalanceado",
      "es": "Descuadrado"
    },
    "total": {
      "en": "Total",
      "pt": "Total",
      "es": "Total"
    },
    "date": {
      "en": "Date",
      "pt": "Data",
      "es": "Fecha"
    },
    "status": {
      "en": "Status",
      "pt": "Status",
      "es": "Estado"
    },
    "actions": {
      "en": "Actions",
      "pt": "Ações",
      "es": "Acciones"
    },
    "loading": {
      "en": "Loading data...",
      "pt": "Carregando dados...",
      "es": "Cargando datos..."
    },
    "close": {
      "en": "Close",
      "pt": "Fechar",
      "es": "Cerrar"
    }
  },
  "nav": {
    "dashboard": {
      "en": "Executive Cockpit",
      "pt": "Cockpit Executivo",
      "es": "Panel Ejecutivo"
    },
    "generalLedger": {
      "en": "General Ledger",
      "pt": "Livro Razão Geral",
      "es": "Libro Mayor General"
    },
    "chartOfAccounts": {
      "en": "Chart of Accounts",
      "pt": "Plano de Contas",
      "es": "Plan de Cuentas"
    },
    "journalEntries": {
      "en": "Journal Entries",
      "pt": "Livro Diário Geral",
      "es": "Libro Diario General"
    },
    "trialBalance": {
      "en": "Trial Balance",
      "pt": "Balancete de Verificação",
      "es": "Balance de Comprobación"
    },
    "incomeStatement": {
      "en": "Income Statement (P&L)",
      "pt": "Demonstração do Resultado (DRE)",
      "es": "Estado de Resultados (P&L)"
    },
    "balanceSheet": {
      "en": "Balance Sheet",
      "pt": "Balanço Patrimonial",
      "es": "Balance General"
    },
    "cashFlow": {
      "en": "Statement of Cash Flows",
      "pt": "Demonstração dos Fluxos de Caixa",
      "es": "Estado de Flujos de Efectivo"
    },
    "statementOfEquity": {
      "en": "Statement of Equity (Sch M-2)",
      "pt": "Mutações do Patrimônio Líquido",
      "es": "Estado de Cambios en el Patrimonio"
    },
    "bankReconciliation": {
      "en": "Bank Reconciliation & OCR",
      "pt": "Conciliação Bancária & OCR",
      "es": "Conciliación Bancaria y OCR"
    },
    "softwareMigration": {
      "en": "Software Data Migration",
      "pt": "Importação & Migração de Dados",
      "es": "Migración de Datos de Software"
    },
    "multiCurrency": {
      "en": "Multi-Currency & FX (ASC 830)",
      "pt": "Multi-Moeda & FX (ASC 830)",
      "es": "Multidivisa y FX (ASC 830)"
    },
    "directory": {
      "en": "Clients, Team & Vendors",
      "pt": "Clientes, Equipe & Fornecedores",
      "es": "Clientes, Equipo y Proveedores"
    },
    "clientPortal": {
      "en": "B2B Client Portal",
      "pt": "Portal do Cliente B2B",
      "es": "Portal del Cliente B2B"
    },
    "serviceCatalog": {
      "en": "Service Catalog & Pricing",
      "pt": "Catálogo de Serviços & Preços",
      "es": "Catálogo de Servicios y Precios"
    },
    "invoicing": {
      "en": "Invoices & Retainers",
      "pt": "Faturamento & Retainers",
      "es": "Facturación y Anticipos"
    },
    "scheduling": {
      "en": "Time Tracking & Dispatch",
      "pt": "Agendamento & Apontamento de Horas",
      "es": "Control de Horas y Despacho"
    },
    "payroll": {
      "en": "Payroll & W-2 / 1099",
      "pt": "Departamento Pessoal & W-2 / 1099",
      "es": "Nómina y W-2 / 1099"
    },
    "workerPortal": {
      "en": "Worker Portal & e-Sign",
      "pt": "Portal do Colaborador & e-Sign",
      "es": "Portal del Trabajador y e-Sign"
    },
    "bankingDisbursements": {
      "en": "Banking & Dual Approval",
      "pt": "Dispersão Bancária & Dupla Aprovação",
      "es": "Dispersión Bancaria y Doble Aprobación"
    },
    "companyProfile": {
      "en": "Company Tax Profile",
      "pt": "Cadastro de Empresas (Tax)",
      "es": "Perfil Fiscal de la Empresa"
    },
    "partners": {
      "en": "Members & Ownership (K-1)",
      "pt": "Sócios & Quadro Societário (K-1)",
      "es": "Socios y Cuadro Societario (K-1)"
    },
    "yearEndTax": {
      "en": "IRS Year-End Forms (1099/W-2)",
      "pt": "IRS Year-End Forms (1099/W-2)",
      "es": "Formularios de Fin de Año IRS (1099/W-2)"
    },
    "taxCompliance": {
      "en": "Tax Compliance & Sales Tax",
      "pt": "Compliance Fiscal & Sales Tax",
      "es": "Cumplimiento Fiscal y Sales Tax"
    },
    "stateTaxes": {
      "en": "State Franchise Taxes (DE/CA/TX)",
      "pt": "State Franchise Taxes (DE/CA/TX)",
      "es": "Impuestos de Franquicia Estatal (DE/CA/TX)"
    },
    "multiEntity": {
      "en": "Multi-Entity Consolidation",
      "pt": "Consolidação Multi-Empresas",
      "es": "Consolidación Multientidad"
    },
    "auditTrail": {
      "en": "Audit Trail (SOC 2 Merkle)",
      "pt": "Trilha de Auditoria (SOC 2 Merkle)",
      "es": "Pista de Auditoría (SOC 2 Merkle)"
    },
    "reports": {
      "en": "BI & Financial Reports",
      "pt": "Inteligência & Relatórios Financeiros",
      "es": "Informes Financieros y BI"
    },
    "budgetVariance": {
      "en": "Budget vs. Actual Variance",
      "pt": "Orçamento vs. Realizado",
      "es": "Presupuesto vs. Real"
    },
    "systemAudit": {
      "en": "System Audit & Anomalies",
      "pt": "Auditoria do Sistema & Anomalias",
      "es": "Auditoría del Sistema y Anomalías"
    },
    "settings": {
      "en": "Organization Settings",
      "pt": "Configurações da Empresa",
      "es": "Configuración de la Empresa"
    }
  },
  "accounting": {
    "debit": {
      "en": "Debit",
      "pt": "Débito",
      "es": "Débito"
    },
    "credit": {
      "en": "Credit",
      "pt": "Crédito",
      "es": "Crédito"
    },
    "netBalance": {
      "en": "Net Balance",
      "pt": "Saldo Líquido",
      "es": "Saldo Neto"
    },
    "startingBalance": {
      "en": "Starting Balance",
      "pt": "Saldo Inicial",
      "es": "Saldo Inicial"
    },
    "endingBalance": {
      "en": "Ending Balance",
      "pt": "Saldo Final",
      "es": "Saldo Final"
    },
    "runningBalance": {
      "en": "Running Balance",
      "pt": "Saldo Acumulado",
      "es": "Saldo Acumulado"
    },
    "carriedForwardBalance": {
      "en": "Starting Balance Carried Forward from Prior Year",
      "pt": "Saldo Inicial Transportado do Exercício Anterior",
      "es": "Saldo Inicial Transferido del Ejercicio Anterior"
    },
    "accountCode": {
      "en": "Account Code",
      "pt": "Código da Conta",
      "es": "Código de Cuenta"
    },
    "accountName": {
      "en": "Account Name",
      "pt": "Nome da Conta",
      "es": "Nombre de Cuenta"
    },
    "accountType": {
      "en": "Account Type",
      "pt": "Tipo de Conta",
      "es": "Tipo de Cuenta"
    },
    "memo": {
      "en": "Memo / Description",
      "pt": "Histórico Contábil / Descrição",
      "es": "Detalle / Concepto Contable"
    },
    "entryNumber": {
      "en": "Entry #",
      "pt": "Nº Lançamento",
      "es": "Nº Asiento"
    },
    "postEntry": {
      "en": "Post Journal Entry",
      "pt": "Registrar Lançamento",
      "es": "Registrar Asiento"
    },
    "newEntry": {
      "en": "New Journal Entry",
      "pt": "Novo Lançamento Contábil",
      "es": "Nuevo Asiento Contable"
    },
    "ruleDebitCredit": {
      "en": "Debits must strictly equal Credits (US GAAP)",
      "pt": "Os Débitos devem ser rigorosamente iguais aos Créditos (US GAAP)",
      "es": "Los Débitos deben ser estrictamente iguales a los Créditos (US GAAP)"
    },
    "assets": {
      "en": "Assets",
      "pt": "Ativos",
      "es": "Activos"
    },
    "totalAssets": {
      "en": "Total Assets",
      "pt": "Ativo Total",
      "es": "Total de Activos"
    },
    "liabilities": {
      "en": "Liabilities",
      "pt": "Passivos",
      "es": "Pasivos"
    },
    "totalLiabilities": {
      "en": "Total Liabilities",
      "pt": "Passivo Total",
      "es": "Total de Pasivos"
    },
    "equity": {
      "en": "Members’ Equity",
      "pt": "Patrimônio Líquido",
      "es": "Patrimonio Neto"
    },
    "totalEquity": {
      "en": "Total Members’ Equity",
      "pt": "Total do Patrimônio Líquido",
      "es": "Total del Patrimonio Neto"
    },
    "revenue": {
      "en": "Revenue from Services",
      "pt": "Receita de Serviços Prestados",
      "es": "Ingresos por Servicios Prestados"
    },
    "costOfServices": {
      "en": "Cost of Services (COGS)",
      "pt": "Custo dos Serviços Prestados (CSP)",
      "es": "Costo de los Servicios Prestados (CSP)"
    },
    "operatingExpenses": {
      "en": "Operating Expenses (OPEX)",
      "pt": "Despesas Operacionais (OPEX)",
      "es": "Gastos Operativos (OPEX)"
    },
    "grossProfit": {
      "en": "Gross Profit",
      "pt": "Lucro Bruto",
      "es": "Utilidad Bruta"
    },
    "grossMargin": {
      "en": "Gross Margin",
      "pt": "Margem Bruta",
      "es": "Margen Bruto"
    },
    "operatingIncome": {
      "en": "Operating Income (EBITDA)",
      "pt": "Resultado Operacional (EBITDA)",
      "es": "Resultado Operativo (EBITDA)"
    },
    "netIncome": {
      "en": "Net Income / (Loss)",
      "pt": "Lucro / (Prejuízo) Líquido",
      "es": "Utilidad / (Pérdida) Neta"
    },
    "currentAssets": {
      "en": "Current Assets",
      "pt": "Ativo Circulante",
      "es": "Activo Corriente"
    },
    "nonCurrentAssets": {
      "en": "Non-Current Assets / Property, Plant & Equipment",
      "pt": "Ativo Não Circulante / Imobilizado",
      "es": "Activo No Corriente / Activo Fijo"
    },
    "currentLiabilities": {
      "en": "Current Liabilities",
      "pt": "Passivo Circulante",
      "es": "Pasivo Corriente"
    },
    "nonCurrentLiabilities": {
      "en": "Non-Current Liabilities",
      "pt": "Passivo Não Circulante",
      "es": "Pasivo No Corriente"
    },
    "retainedEarnings": {
      "en": "Cumulative Retained Earnings",
      "pt": "Lucros Retidos Acumulados",
      "es": "Utilidades Retenidas Acumuladas"
    },
    "totalLiabilitiesAndEquity": {
      "en": "Total Liabilities & Members’ Equity",
      "pt": "Total do Passivo e Patrimônio Líquido",
      "es": "Total Pasivo y Patrimonio Neto"
    }
  },
  "reports": {
    "balanceSheetTitle": {
      "en": "STATEMENT OF FINANCIAL POSITION (BALANCE SHEET)",
      "pt": "BALANÇO PATRIMONIAL (STATEMENT OF FINANCIAL POSITION)",
      "es": "BALANCE GENERAL (ESTADO DE SITUACIÓN FINANCIERA)"
    },
    "incomeStatementTitle": {
      "en": "STATEMENT OF OPERATIONS & COMPREHENSIVE INCOME",
      "pt": "DEMONSTRAÇÃO DO RESULTADO DO EXERCÍCIO (DRE)",
      "es": "ESTADO DE RESULTADOS INTEGRALES (P&L)"
    },
    "generalLedgerTitle": {
      "en": "GENERAL LEDGER REPORT (AUDITED LEDGER)",
      "pt": "LIVRO RAZÃO CONTÁBIL GERAL ANALÍTICO",
      "es": "LIBRO MAYOR GENERAL ANALÍTICO AUDITADO"
    },
    "trialBalanceTitle": {
      "en": "TRIAL BALANCE REPORT (CHART OF ACCOUNTS)",
      "pt": "BALANCETE DE VERIFICAÇÃO CONTÁBIL",
      "es": "BALANCE DE COMPROBACIÓN DE SUMAS Y SALDOS"
    },
    "journalEntriesTitle": {
      "en": "GENERAL JOURNAL ENTRIES (DOUBLE-ENTRY LOG)",
      "pt": "LIVRO DIÁRIO GERAL CONTÁBIL",
      "es": "LIBRO DIARIO GENERAL DE PARTIDAS DOBLES"
    },
    "cashFlowTitle": {
      "en": "STATEMENT OF CASH FLOWS (US GAAP ASC 230)",
      "pt": "DEMONSTRAÇÃO DOS FLUXOS DE CAIXA (DFC - ASC 230)",
      "es": "ESTADO DE FLUJOS DE EFECTIVO (US GAAP ASC 230)"
    },
    "notesTitle": {
      "en": "NOTES TO FINANCIAL STATEMENTS (ASC 235)",
      "pt": "NOTAS EXPLICATIVAS ÀS DEMONSTRAÇÕES CONTÁBEIS",
      "es": "NOTAS EXPLICATIVAS A LOS ESTADOS FINANCIEROS"
    },
    "preparedBy": {
      "en": "Prepared By",
      "pt": "Elaborado Por",
      "es": "Elaborado Por"
    },
    "certifiedBy": {
      "en": "Reviewed & Certified By",
      "pt": "Revisado & Certificado Por",
      "es": "Revisado y Certificado Por"
    },
    "managementApproval": {
      "en": "Management Approval",
      "pt": "Aprovação da Diretoria",
      "es": "Aprobación de la Gerencia"
    },
    "auditStamp": {
      "en": "US GAAP AUDIT-READY • IMMUTABLE LEDGER",
      "pt": "AUDITADO US GAAP • LIVRO RAZÃO IMUTÁVEL",
      "es": "AUDITADO US GAAP • LIBRO MAYOR INMUTABLE"
    }
  },
  "metrics": {
    "netRunway": {
      "en": "Net Runway",
      "pt": "Runway Líquido",
      "es": "Runway Neto"
    },
    "monthlyBurn": {
      "en": "Monthly Burn Rate",
      "pt": "Burn Rate Mensal",
      "es": "Burn Rate Mensual"
    },
    "quickRatio": {
      "en": "Quick Ratio",
      "pt": "Índice de Liquidez Seca",
      "es": "Ratio de Prueba Ácida"
    },
    "workingCapital": {
      "en": "Working Capital",
      "pt": "Capital de Giro",
      "es": "Capital de Trabajo"
    },
    "dso": {
      "en": "DSO (Days Sales Outstanding)",
      "pt": "Prazo Médio de Recebimento (DSO)",
      "es": "Periodo Medio de Cobro (DSO)"
    },
    "billableUtilization": {
      "en": "Billable Utilization",
      "pt": "Utilização Faturável",
      "es": "Utilización Facturable"
    },
    "months": {
      "en": "months",
      "pt": "meses",
      "es": "meses"
    },
    "days": {
      "en": "days",
      "pt": "dias",
      "es": "días"
    }
  }
}

# Generate en.json, pt.json, es.json
for lang in ['en', 'pt', 'es']:
    res = {}
    for section, keys in expanded_keys.items():
        res[section] = {}
        for k, v in keys.items():
            res[section][k] = v[lang]
    with open(f'src/locales/{lang}.json', 'w', encoding='utf-8') as f:
        json.dump(res, f, indent=2, ensure_ascii=False)
    print(f"Generated src/locales/{lang}.json with {sum(len(v) for v in res.values())} keys")
