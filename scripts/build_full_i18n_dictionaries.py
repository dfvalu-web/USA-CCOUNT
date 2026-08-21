import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

full_dictionary = {
  "common": {
    "appName": { "en": "Mister Contábil", "pt": "Mister Contábil", "es": "Mister Contábil" },
    "tagline": {
      "en": "US GAAP Financial & Tax Intelligence Platform",
      "pt": "Plataforma de Inteligência Contábil e Fiscal US GAAP",
      "es": "Plataforma de Inteligencia Contable y Fiscal US GAAP"
    },
    "search": { "en": "Search or type command...", "pt": "Buscar ou digitar comando...", "es": "Buscar o escribir comando..." },
    "commandPalette": { "en": "Command Palette", "pt": "Paleta de Comandos", "es": "Paleta de Comandos" },
    "accrual": { "en": "Accrual Basis", "pt": "Regime de Competência", "es": "Base de Devengado" },
    "cash": { "en": "Cash Basis", "pt": "Regime de Caixa", "es": "Base de Efectivo" },
    "language": { "en": "Language", "pt": "Idioma", "es": "Idioma" },
    "theme": { "en": "Theme", "pt": "Tema", "es": "Tema" },
    "dark": { "en": "Dark", "pt": "Escuro", "es": "Oscuro" },
    "light": { "en": "Light", "pt": "Claro", "es": "Claro" },
    "save": { "en": "Save", "pt": "Salvar", "es": "Guardar" },
    "cancel": { "en": "Cancel", "pt": "Cancelar", "es": "Cancelar" },
    "create": { "en": "Create", "pt": "Criar", "es": "Crear" },
    "delete": { "en": "Delete", "pt": "Excluir", "es": "Eliminar" },
    "edit": { "en": "Edit", "pt": "Editar", "es": "Editar" },
    "export": { "en": "Export CSV", "pt": "Exportar CSV", "es": "Exportar CSV" },
    "print": { "en": "Print (PDF)", "pt": "Imprimir (PDF)", "es": "Imprimir (PDF)" },
    "balanced": { "en": "Balanced", "pt": "Balanceado", "es": "Cuadrado" },
    "unbalanced": { "en": "Unbalanced", "pt": "Desbalanceado", "es": "Descuadrado" },
    "total": { "en": "Total", "pt": "Total", "es": "Total" },
    "date": { "en": "Date", "pt": "Data", "es": "Fecha" },
    "status": { "en": "Status", "pt": "Status", "es": "Estado" },
    "actions": { "en": "Actions", "pt": "Ações", "es": "Acciones" },
    "loading": { "en": "Loading data...", "pt": "Carregando dados...", "es": "Cargando datos..." },
    "close": { "en": "Close", "pt": "Fechar", "es": "Cerrar" },
    "back": { "en": "Back", "pt": "Voltar", "es": "Volver" },
    "viewDetails": { "en": "View Details", "pt": "Ver Detalhes", "es": "Ver Detalles" },
    "all": { "en": "All", "pt": "Todos", "es": "Todos" },
    "active": { "en": "Active", "pt": "Ativo", "es": "Activo" },
    "inactive": { "en": "Inactive", "pt": "Inativo", "es": "Inactivo" },
    "year": { "en": "Fiscal Year", "pt": "Exercício Fiscal", "es": "Año Fiscal" }
  },
  "nav": {
    "dashboard": { "en": "Executive Cockpit", "pt": "Cockpit Executivo", "es": "Panel Ejecutivo" },
    "generalLedger": { "en": "General Ledger", "pt": "Livro Razão Geral", "es": "Libro Mayor General" },
    "chartOfAccounts": { "en": "Chart of Accounts", "pt": "Plano de Contas", "es": "Plan de Cuentas" },
    "journalEntries": { "en": "Journal Entries", "pt": "Livro Diário Geral", "es": "Libro Diario General" },
    "trialBalance": { "en": "Trial Balance", "pt": "Balancete de Verificação", "es": "Balance de Comprobación" },
    "incomeStatement": { "en": "Income Statement (P&L)", "pt": "Demonstração do Resultado (DRE)", "es": "Estado de Resultados (P&L)" },
    "balanceSheet": { "en": "Balance Sheet", "pt": "Balanço Patrimonial", "es": "Balance General" },
    "cashFlow": { "en": "Statement of Cash Flows", "pt": "Demonstração dos Fluxos de Caixa", "es": "Estado de Flujos de Efectivo" },
    "statementOfEquity": { "en": "Statement of Equity (Sch M-2)", "pt": "Mutações do Patrimônio Líquido", "es": "Estado de Cambios en el Patrimonio" },
    "bankReconciliation": { "en": "Bank Reconciliation & OCR", "pt": "Conciliação Bancária & OCR", "es": "Conciliación Bancaria y OCR" },
    "softwareMigration": { "en": "Software Data Migration", "pt": "Importação & Migração de Dados", "es": "Migración de Datos de Software" },
    "multiCurrency": { "en": "Multi-Currency & FX (ASC 830)", "pt": "Multi-Moeda & FX (ASC 830)", "es": "Multidivisa y FX (ASC 830)" },
    "directory": { "en": "Clients, Team & Vendors", "pt": "Clientes, Equipe & Fornecedores", "es": "Clientes, Equipo y Proveedores" },
    "clientPortal": { "en": "B2B Client Portal", "pt": "Portal do Cliente B2B", "es": "Portal del Cliente B2B" },
    "serviceCatalog": { "en": "Service Catalog & Pricing", "pt": "Catálogo de Serviços & Preços", "es": "Catálogo de Servicios y Precios" },
    "invoicing": { "en": "Invoices & Retainers", "pt": "Faturamento & Retainers", "es": "Facturación y Anticipos" },
    "scheduling": { "en": "Time Tracking & Dispatch", "pt": "Agendamento & Apontamento de Horas", "es": "Control de Horas y Despacho" },
    "payroll": { "en": "Payroll & W-2 / 1099", "pt": "Departamento Pessoal & W-2 / 1099", "es": "Nómina y W-2 / 1099" },
    "workerPortal": { "en": "Worker Portal & e-Sign", "pt": "Portal do Colaborador & e-Sign", "es": "Portal del Trabajador y e-Sign" },
    "bankingDisbursements": { "en": "Banking & Dual Approval", "pt": "Dispersão Bancária & Dupla Aprovação", "es": "Dispersión Bancaria y Doble Aprobación" },
    "companyProfile": { "en": "Company Tax Profile", "pt": "Cadastro de Empresas (Tax)", "es": "Perfil Fiscal de la Empresa" },
    "partners": { "en": "Members & Ownership (K-1)", "pt": "Sócios & Quadro Societário (K-1)", "es": "Socios y Cuadro Societario (K-1)" },
    "yearEndTax": { "en": "IRS Year-End Forms (1099/W-2)", "pt": "IRS Year-End Forms (1099/W-2)", "es": "Formularios de Fin de Año IRS (1099/W-2)" },
    "taxCompliance": { "en": "Tax Compliance & Sales Tax", "pt": "Compliance Fiscal & Sales Tax", "es": "Cumplimiento Fiscal y Sales Tax" },
    "stateTaxes": { "en": "State Franchise Taxes (DE/CA/TX)", "pt": "State Franchise Taxes (DE/CA/TX)", "es": "Impuestos de Franquicia Estatal (DE/CA/TX)" },
    "multiEntity": { "en": "Multi-Entity Consolidation", "pt": "Consolidação Multi-Empresas", "es": "Consolidación Multientidad" },
    "auditTrail": { "en": "Audit Trail (SOC 2 Merkle)", "pt": "Trilha de Auditoria (SOC 2 Merkle)", "es": "Pista de Auditoría (SOC 2 Merkle)" },
    "reports": { "en": "BI & Financial Reports", "pt": "Inteligência & Relatórios Financeiros", "es": "Informes Financieros y BI" },
    "budgetVariance": { "en": "Budget vs. Actual Variance", "pt": "Orçamento vs. Realizado", "es": "Presupuesto vs. Real" },
    "systemAudit": { "en": "System Audit & Anomalies", "pt": "Auditoria do Sistema & Anomalias", "es": "Auditoría del Sistema y Anomalías" },
    "settings": { "en": "Organization Settings", "pt": "Configurações da Empresa", "es": "Configuración de la Empresa" }
  },
  "accounting": {
    "debit": { "en": "Debit", "pt": "Débito", "es": "Débito" },
    "credit": { "en": "Credit", "pt": "Crédito", "es": "Crédito" },
    "netBalance": { "en": "Net Balance", "pt": "Saldo Líquido", "es": "Saldo Neto" },
    "startingBalance": { "en": "Starting Balance", "pt": "Saldo Inicial", "es": "Saldo Inicial" },
    "endingBalance": { "en": "Ending Balance", "pt": "Saldo Final", "es": "Saldo Final" },
    "runningBalance": { "en": "Running Balance", "pt": "Saldo Acumulado", "es": "Saldo Acumulado" },
    "carriedForwardBalance": {
      "en": "Starting Balance Carried Forward from Prior Year",
      "pt": "Saldo Inicial Transportado do Exercício Anterior",
      "es": "Saldo Inicial Transferido del Ejercicio Anterior"
    },
    "accountCode": { "en": "Account Code", "pt": "Código da Conta", "es": "Código de Cuenta" },
    "accountName": { "en": "Account Name", "pt": "Nome da Conta", "es": "Nombre de Cuenta" },
    "accountType": { "en": "Account Type", "pt": "Tipo de Conta", "es": "Tipo de Cuenta" },
    "memo": { "en": "Memo / Description", "pt": "Histórico Contábil / Descrição", "es": "Detalle / Concepto Contable" },
    "entryNumber": { "en": "Entry #", "pt": "Nº Lançamento", "es": "Nº Asiento" },
    "postEntry": { "en": "Post Journal Entry", "pt": "Registrar Lançamento", "es": "Registrar Asiento" },
    "newEntry": { "en": "New Journal Entry", "pt": "Novo Lançamento Contábil", "es": "Nuevo Asiento Contable" },
    "ruleDebitCredit": {
      "en": "Debits must strictly equal Credits (US GAAP)",
      "pt": "Os Débitos devem ser rigorosamente iguais aos Créditos (US GAAP)",
      "es": "Los Débitos deben ser estrictamente iguales a los Créditos (US GAAP)"
    },
    "assets": { "en": "Assets", "pt": "Ativos", "es": "Activos" },
    "totalAssets": { "en": "Total Assets", "pt": "Ativo Total", "es": "Total de Activos" },
    "liabilities": { "en": "Liabilities", "pt": "Passivos", "es": "Pasivos" },
    "totalLiabilities": { "en": "Total Liabilities", "pt": "Passivo Total", "es": "Total de Pasivos" },
    "equity": { "en": "Members’ Equity", "pt": "Patrimônio Líquido", "es": "Patrimonio Neto" },
    "totalEquity": { "en": "Total Members’ Equity", "pt": "Total do Patrimônio Líquido", "es": "Total del Patrimonio Neto" },
    "revenue": { "en": "Revenue from Services", "pt": "Receita de Serviços Prestados", "es": "Ingresos por Servicios Prestados" },
    "costOfServices": { "en": "Cost of Services (COGS)", "pt": "Custo dos Serviços Prestados (CSP)", "es": "Costo de los Servicios Prestados (CSP)" },
    "operatingExpenses": { "en": "Operating Expenses (OPEX)", "pt": "Despesas Operacionais (OPEX)", "es": "Gastos Operativos (OPEX)" },
    "grossProfit": { "en": "Gross Profit", "pt": "Lucro Bruto", "es": "Utilidad Bruta" },
    "grossMargin": { "en": "Gross Margin", "pt": "Margem Bruta", "es": "Margen Bruto" },
    "operatingIncome": { "en": "Operating Income (EBITDA)", "pt": "Resultado Operacional (EBITDA)", "es": "Resultado Operativo (EBITDA)" },
    "netIncome": { "en": "Net Income / (Loss)", "pt": "Lucro / (Prejuízo) Líquido", "es": "Utilidad / (Pérdida) Neta" },
    "currentAssets": { "en": "Current Assets", "pt": "Ativo Circulante", "es": "Activo Corriente" },
    "nonCurrentAssets": { "en": "Non-Current Assets / Property, Plant & Equipment", "pt": "Ativo Não Circulante / Imobilizado", "es": "Activo No Corriente / Activo Fijo" },
    "currentLiabilities": { "en": "Current Liabilities", "pt": "Passivo Circulante", "es": "Pasivo Corriente" },
    "nonCurrentLiabilities": { "en": "Non-Current Liabilities", "pt": "Passivo Não Circulante", "es": "Pasivo No Corriente" },
    "retainedEarnings": { "en": "Cumulative Retained Earnings", "pt": "Lucros Retidos Acumulados", "es": "Utilidades Retenidas Acumuladas" },
    "totalLiabilitiesAndEquity": { "en": "Total Liabilities & Members’ Equity", "pt": "Total do Passivo e Patrimônio Líquido", "es": "Total Pasivo y Patrimonio Neto" },
    "balanceSheetEquation": {
      "en": "Fundamental Balance Sheet Equation: Assets = Liabilities + Equity",
      "pt": "Equação Fundamental do Balanço: Ativo = Passivo + Patrimônio Líquido",
      "es": "Ecuación Contable Fundamental: Activo = Pasivo + Patrimonio Neto"
    },
    "balancedProof": { "en": "BALANCED ($0.00 Variance)", "pt": "BALANCEADO (Variância $0,00)", "es": "CUADRADO (Varianza $0.00)" }
  },
  "reports": {
    "balanceSheetTitle": {
      "en": "STATEMENT OF FINANCIAL POSITION (BALANCE SHEET)",
      "pt": "BALANÇO PATRIMONIAL (STATEMENT OF FINANCIAL POSITION)",
      "es": "BALANCE GENERAL (ESTADO DE SITUACIÓN FINANCIERA)"
    },
    "incomeStatementTitle": {
      "en": "STATEMENT OF OPERATIONS & COMPREHENSIVE INCOME (P&L)",
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
    "preparedBy": { "en": "Prepared By", "pt": "Elaborado Por", "es": "Elaborado Por" },
    "preparerTitle": { "en": "Staff Accountant / Controller", "pt": "Contador Responsável / Controller", "es": "Contador Encargado / Controller" },
    "certifiedBy": { "en": "Reviewed & Certified By", "pt": "Revisado & Certificado Por", "es": "Revisado y Certificado Por" },
    "certifierTitle": { "en": "Certified Public Accountant (CPA) / EA", "pt": "Contador Público Certificado (CPA) / EA", "es": "Contador Público Certificado (CPA) / EA" },
    "managementApproval": { "en": "Management Approval", "pt": "Aprovação da Diretoria / Sócios", "es": "Aprobación de la Gerencia / Socios" },
    "auditStamp": { "en": "US GAAP AUDIT-READY • IMMUTABLE LEDGER", "pt": "AUDITADO US GAAP • LIVRO RAZÃO IMUTÁVEL", "es": "AUDITADO US GAAP • LIBRO MAYOR INMUTABLE" },
    "asOfDate": { "en": "As of", "pt": "Posição em", "es": "Al" },
    "comparative": { "en": "Comparative Multi-Year Analysis", "pt": "Análise Comparativa Multianual", "es": "Análisis Comparativo Multianual" },
    "yoyRevenueGrowth": { "en": "YoY Revenue Growth", "pt": "Crescimento de Receita (YoY)", "es": "Crecimiento de Ingresos (YoY)" },
    "grossMarginComp": { "en": "Comparative Gross Margin", "pt": "Margem Bruta Comparada", "es": "Margen Bruto Comparativo" },
    "netIncomeExpansion": { "en": "Net Income Expansion", "pt": "Expansão de Lucro Líquido", "es": "Expansión de Utilidad Neta" },
    "noActivity": { "en": "Fiscal Year with No Activity Recorded", "pt": "Exercício Fiscal Sem Movimentação Contábil", "es": "Ejercicio Fiscal Sin Actividad Registrada" }
  },
  "reconciliation": {
    "title": { "en": "Bank Reconciliation & Smart OCR Hub", "pt": "Central de Conciliação Bancária & OCR", "es": "Central de Conciliación Bancaria y OCR" },
    "periodTransactions": { "en": "Period Transactions", "pt": "Transações do Período", "es": "Transacciones del Periodo" },
    "selectedPeriod": { "en": "Selected Fiscal Period", "pt": "Período Fiscal Selecionado", "es": "Periodo Fiscal Seleccionado" },
    "threeWayMatching": { "en": "3-Way Matching Engine", "pt": "Motor de 3-Way Matching", "es": "Motor de 3-Way Matching" },
    "matchingSubtitle": { "en": "Bank Feed vs. General Ledger vs. Receipt OCR", "pt": "Extrato Bancário vs. Razão Contábil vs. OCR", "es": "Extracto Bancario vs. Libro Mayor vs. OCR" },
    "statusFilter": { "en": "Status Filter:", "pt": "Filtro de Status:", "es": "Filtro de Estado:" },
    "searchPlaceholder": { "en": "Search entry, FITID or amount...", "pt": "Buscar lançamento, FITID ou valor...", "es": "Buscar asiento, FITID o monto..." },
    "bankFeed": { "en": "Bank Statement (Description & Bank)", "pt": "Extrato Bancário (Descrição & Banco)", "es": "Extracto Bancario (Descripción y Banco)" },
    "glAccount": { "en": "General Ledger Account (US GAAP)", "pt": "Conta no Razão Contábil (US GAAP)", "es": "Cuenta en Libro Mayor (US GAAP)" },
    "bankAmount": { "en": "Bank Amount", "pt": "Valor Bancário", "es": "Monto Bancario" },
    "matched": { "en": "100% Matched", "pt": "100% Conciliado", "es": "100% Conciliado" },
    "pending": { "en": "Pending Verification", "pt": "Verificação Pendente", "es": "Verificación Pendiente" },
    "discrepancy": { "en": "Discrepancy Detected", "pt": "Discrepância Detectada", "es": "Discrepancia Detectada" }
  },
  "taxCompliance": {
    "cpaBinderTitle": {
      "en": "Annual CPA Tax Return Binder & Workpapers",
      "pt": "Pacote Anual de Declaração Fiscal & Papéis de Trabalho CPA",
      "es": "Carpeta Anual de Declaración Fiscal y Papeles de Trabajo CPA"
    },
    "entityAndEin": { "en": "Entity & EIN", "pt": "Entidade & EIN", "es": "Entidad y EIN" },
    "irsTaxMapping": { "en": "IRS Tax Mapping", "pt": "Mapeamento Fiscal do IRS", "es": "Mapeo Fiscal del IRS" },
    "form1065": { "en": "Form 1065 (Partnership/LLC)", "pt": "Form 1065 (Partnership/LLC)", "es": "Form 1065 (Partnership/LLC)" },
    "auditStatus": { "en": "Audit & Compliance Status", "pt": "Status de Auditoria & Conformidade", "es": "Estado de Auditoría y Cumplimiento" },
    "salesTaxTitle": {
      "en": "State Sales Tax Return Filing Schedule",
      "pt": "Cronograma de Declaração do Imposto sobre Vendas Estadual",
      "es": "Cronograma de Declaración de Impuestos sobre Ventas Estatales"
    },
    "grossSales": { "en": "Gross Sales (Box 1):", "pt": "Vendas Brutas (Box 1):", "es": "Ventas Brutas (Box 1):" },
    "exemptSales": { "en": "Exempt Sales (Box 2):", "pt": "Vendas Isentas (Box 2):", "es": "Ventas Exentas (Box 2):" },
    "taxableSales": { "en": "Taxable Sales (Box 3):", "pt": "Vendas Tributáveis (Box 3):", "es": "Ventas Gravables (Box 3):" },
    "netTaxDue": { "en": "Net Tax Due (Box 4):", "pt": "Imposto Líquido Devido (Box 4):", "es": "Impuesto Neto a Pagar (Box 4):" }
  },
  "stateTaxes": {
    "title": {
      "en": "State Franchise Taxes & Annual Reports Hub (DE / CA / TX)",
      "pt": "Central de State Franchise Taxes & Relatórios Anuais (DE / CA / TX)",
      "es": "Central de Impuestos de Franquicia Estatal e Informes Anuales (DE / CA / TX)"
    },
    "recalcSubtitle": {
      "en": "Adjust capital data to recalculate taxes in real time",
      "pt": "Ajuste os dados de capital para recalcular a taxa em tempo real",
      "es": "Ajuste los datos de capital para recalcular impuestos en tiempo real"
    },
    "entityType": { "en": "Entity Structure:", "pt": "Tipo Societário:", "es": "Estructura Societaria:" },
    "delawareCorpComparison": {
      "en": "Delaware Statutory Comparator: Authorized Shares vs Assumed Par Value",
      "pt": "Comparador Estatutário Delaware: Authorized Shares vs Assumed Par Value",
      "es": "Comparador Estatutario Delaware: Acciones Autorizadas vs Valor Par Asumido"
    },
    "delawareLlcFlat": { "en": "Delaware LLC Annual Flat Tax:", "pt": "Taxa Anual Fixa Delaware LLC:", "es": "Impuesto Fijo Anual Delaware LLC:" },
    "californiaForm568": { "en": "California Form 568 Progressive LLC Fee", "pt": "Cálculo de Form 568 e taxa progressiva da CA", "es": "Cálculo de Form 568 y tarifa progresiva de CA" }
  },
  "auth": {
    "loginTitle": { "en": "Sign In to Platform", "pt": "Acesso à Plataforma", "es": "Iniciar Sesión" },
    "loginSubtitle": { "en": "US GAAP Accounting & Tax SaaS", "pt": "SaaS Contábil & Fiscal US GAAP", "es": "SaaS Contable y Fiscal US GAAP" },
    "rememberMe": { "en": "Remember this device", "pt": "Lembrar este dispositivo", "es": "Recordar este dispositivo" },
    "sslProtected": { "en": "256-bit SSL Protected", "pt": "Protegido por SSL 256-bit", "es": "Protegido por SSL 256-bit" },
    "authenticating": { "en": "Authenticating...", "pt": "Autenticando...", "es": "Autenticando..." },
    "signInButton": { "en": "Sign In to System", "pt": "Entrar no Sistema", "es": "Entrar al Sistema" },
    "registerTitle": { "en": "Corporate Registration", "pt": "Cadastro Empresarial", "es": "Registro Corporativo" },
    "registerSubtitle": { "en": "Create your enterprise accounting profile", "pt": "Crie sua conta contábil institucional", "es": "Cree su cuenta contable institucional" },
    "companyType": { "en": "Company / LLC / Corp", "pt": "Empresa / LLC / Corp", "es": "Empresa / LLC / Corp" },
    "cpaOfficeType": { "en": "CPA Firm / Accounting Office", "pt": "Escritório de CPA / Contador", "es": "Firma de CPA / Despacho Contable" },
    "companyName": { "en": "Company Legal Name", "pt": "Razão Social da Empresa", "es": "Razón Social de la Empresa" },
    "einLabel": { "en": "Employer Identification Number (EIN)", "pt": "Número Federal do EIN", "es": "Número de Identificación Federal (EIN)" },
    "fullName": { "en": "Your Full Name", "pt": "Seu Nome Completo", "es": "Su Nombre Completo" },
    "emailLabel": { "en": "Corporate E-mail", "pt": "E-mail Corporativo", "es": "Correo Electrónico Corporativo" },
    "passwordLabel": { "en": "Password", "pt": "Senha", "es": "Contraseña" },
    "creatingAccount": { "en": "Creating Account...", "pt": "Criando Conta...", "es": "Creando Cuenta..." },
    "backToHome": { "en": "Back to Main Site", "pt": "Voltar ao Site Principal", "es": "Volver al Sitio Principal" },
    "demoQuickAccess": { "en": "1-Click Instant Demo Access", "pt": "Acesso Demo Instantâneo em 1 Clique", "es": "Acceso Demo Instantáneo en 1 Clic" },
    "switchUser": { "en": "Switch User / Profile", "pt": "Alternar Usuário / Perfil", "es": "Cambiar de Usuario / Perfil" },
    "logout": { "en": "Sign Out / Logout", "pt": "Sair da Sessão / Logout", "es": "Cerrar Sesión / Salir" }
  },
  "landing": {
    "heroBadge": {
      "en": "Official US GAAP Accounting & Tax Compliance Platform",
      "pt": "Plataforma Oficial de Contabilidade & Compliance Fiscal US GAAP",
      "es": "Plataforma Oficial de Contabilidad y Cumplimiento Fiscal US GAAP"
    },
    "heroTitle1": {
      "en": "The Ultimate Financial & Tax Intelligence for the",
      "pt": "A Inteligência Contábil & Fiscal Definitiva nos",
      "es": "La Inteligencia Contable y Fiscal Definitiva en los"
    },
    "heroTitle2": {
      "en": "United States",
      "pt": "Estados Unidos",
      "es": "Estados Unidos"
    },
    "heroSubtitle": {
      "en": "Full double-entry bookkeeping with $0.00 variance, Balance Sheet, General Ledger, P&L, Cash Flows, and IRS tax filings (Form 1065, K-1, 1099, and W-2) in Diamond Standard.",
      "pt": "Escrituração completa em partidas dobradas com $0.00 de variância, Balanço Patrimonial, Livro Razão, DRE, Fluxo de Caixa e declarações fiscais do IRS (Form 1065, K-1, 1099 e W-2) em padrão Diamante.",
      "es": "Contabilidad completa por partida doble con $0.00 de varianza, Balance General, Libro Mayor, Estado de Resultados, Flujo de Efectivo y declaraciones fiscales del IRS (Form 1065, K-1, 1099 y W-2) en estándar Diamante."
    },
    "ctaAccess": { "en": "Access Platform Now", "pt": "Acessar Plataforma Agora", "es": "Acceder a la Plataforma Ahora" },
    "ctaDemo": { "en": "1-Click Demo Login", "pt": "Login com 1 Clique (Demo)", "es": "Iniciar Sesión Demo (1 Clic)" },
    "interactiveTitle": {
      "en": "Financial Statements with Exact Mathematical Balance",
      "pt": "Demonstrações Contábeis com Fechamento Exato",
      "es": "Estados Financieros con Cierre Matemático Exacto"
    },
    "interactiveSubtitle": {
      "en": "Select the fiscal year to review equity progression and real-time double-entry proof.",
      "pt": "Selecione o ano fiscal para verificar a evolução patrimonial e a conciliação matemática de partidas dobradas em tempo real.",
      "es": "Seleccione el año fiscal para verificar la evolución patrimonial y la conciliación matemática por partida doble en tiempo real."
    },
    "featureGridTitle": {
      "en": "Everything Your Business Needs to Operate in the US",
      "pt": "Tudo que sua Empresa Precisa para Operar nos EUA",
      "es": "Todo lo que su Empresa Necesita para Operar en EE.UU."
    },
    "featureGridSubtitle": {
      "en": "Designed specifically for business owners, holdings, and accounting firms requiring absolute compliance with US regulations.",
      "pt": "Projetado especificamente para empresários, holdings e escritórios de contabilidade que exigem precisão absoluta perante a legislação americana.",
      "es": "Diseñado específicamente para empresarios, holdings y despachos contables que exigen precisión absoluta ante la legislación estadounidense."
    },
    "pricingTitle": {
      "en": "Invest in Your Company's Compliance & Growth",
      "pt": "Invista na Conformidade & Crescimento da sua Empresa",
      "es": "Invierta en el Cumplimiento y Crecimiento de su Empresa"
    },
    "pricingSubtitle": {
      "en": "Save thousands of dollars in tax penalties and accounting rework with an institutional platform.",
      "pt": "Economize milhares de dólares em multas fiscais e retrabalho contábil com uma plataforma institucional.",
      "es": "Ahorre miles de dólares en multas fiscales y reprocesos contables con una plataforma institucional."
    },
    "monthlyBilling": { "en": "Monthly Billing", "pt": "Cobrança Mensal", "es": "Facturación Mensual" },
    "annualBilling": { "en": "Annual Billing", "pt": "Cobrança Anual", "es": "Facturación Anual" },
    "save20": { "en": "Save 20%", "pt": "Economize 20%", "es": "Ahorre 20%" },
    "securityTitle": {
      "en": "Legal Shielding & Uncompromising Data Integrity",
      "pt": "Blindagem Jurídica & Integridade de Dados",
      "es": "Blindaje Jurídico e Integridad de Datos"
    },
    "securitySubtitle": {
      "en": "Built to withstand forensic audits and meet the strictest requirements of US federal and state tax authorities.",
      "pt": "Construído para suportar auditorias forenses e atender às mais rígidas exigências de órgãos fiscais federais e estaduais dos EUA.",
      "es": "Construido para resistir auditorías forenses y cumplir con los requisitos más estrictos de los organismos fiscales federales y estatales de EE.UU."
    }
  },
  "filters": {
    "accountTypeFilter": { "en": "Filter by Account Type:", "pt": "Filtrar por Tipo de Conta:", "es": "Filtrar por Tipo de Cuenta:" },
    "allTypes": { "en": "All Account Types", "pt": "Todos os Tipos de Conta", "es": "Todos los Tipos de Cuenta" },
    "assetsOnly": { "en": "Assets (1000s)", "pt": "Ativos (1000s)", "es": "Activos (1000s)" },
    "liabilitiesOnly": { "en": "Liabilities (2000s)", "pt": "Passivos (2000s)", "es": "Pasivos (2000s)" },
    "equityOnly": { "en": "Equity (3000s)", "pt": "Patrimônio Líquido (3000s)", "es": "Patrimonio Neto (3000s)" },
    "revenueOnly": { "en": "Revenue (4000s)", "pt": "Receitas (4000s)", "es": "Ingresos (4000s)" },
    "expensesOnly": { "en": "Costs & Expenses (5000s & 6000s)", "pt": "Custos & Despesas (5000s & 6000s)", "es": "Costos y Gastos (5000s y 6000s)" },
    "searchAccounts": { "en": "Search account by code or name...", "pt": "Buscar conta por código ou nome...", "es": "Buscar cuenta por código o nombre..." },
    "searchJournal": { "en": "Search by number, memo or amount...", "pt": "Buscar por número, histórico ou valor...", "es": "Buscar por número, concepto o monto..." },
    "accountingBasis": { "en": "Accounting Basis:", "pt": "Regime Contábil:", "es": "Criterio Contable:" },
    "accrualOnly": { "en": "Accrual Basis Only", "pt": "Apenas Competência (Accrual)", "es": "Solo Devengado (Accrual)" },
    "cashOnly": { "en": "Cash Basis Only", "pt": "Apenas Caixa (Cash)", "es": "Solo Efectivo (Cash)" },
    "dualBasis": { "en": "Dual Basis (Accrual & Cash)", "pt": "Ambos os Regimes (Dual)", "es": "Ambos Criterios (Dual)" }
  },
  "metrics": {
    "netRunway": { "en": "Net Runway", "pt": "Runway Líquido", "es": "Runway Neto" },
    "monthlyBurn": { "en": "Monthly Burn Rate", "pt": "Burn Rate Mensal", "es": "Burn Rate Mensual" },
    "quickRatio": { "en": "Quick Ratio", "pt": "Índice de Liquidez Seca", "es": "Ratio de Prueba Ácida" },
    "workingCapital": { "en": "Working Capital", "pt": "Capital de Giro", "es": "Capital de Trabajo" },
    "dso": { "en": "DSO (Days Sales Outstanding)", "pt": "Prazo Médio de Recebimento (DSO)", "es": "Periodo Medio de Cobro (DSO)" },
    "billableUtilization": { "en": "Billable Utilization", "pt": "Utilização Faturável", "es": "Utilización Facturable" },
    "months": { "en": "months", "pt": "meses", "es": "meses" },
    "days": { "en": "days", "pt": "dias", "es": "días" }
  }
}

for lang in ['en', 'pt', 'es']:
    res = {}
    for section, keys in full_dictionary.items():
        res[section] = {}
        for k, v in keys.items():
            res[section][k] = v[lang]
    with open(f'src/locales/{lang}.json', 'w', encoding='utf-8') as f:
        json.dump(res, f, indent=2, ensure_ascii=False)
    print(f"✅ Generated src/locales/{lang}.json with {sum(len(v) for v in res.values())} keys")
