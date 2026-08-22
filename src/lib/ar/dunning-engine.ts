'use client';

export interface OverdueAccount {
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  contactEmail: string;
  contactPhone: string;
  companyName: string;
  companyState: string;
  companyEin: string;
  originalAmount: number;
  issueDate: string;
  dueDate: string;
  daysOverdue: number;
  agingBucket: '0-30' | '31-60' | '61-90' | '90+';
  monthlyInterestRatePct: number;
  accruedInterestAmount: number;
  lateFeePenalty: number;
  totalBalanceDue: number;
  dunningLevel: 1 | 2 | 3;
}

export interface DunningNoticeLetter {
  noticeId: string;
  date: string;
  tierLevel: 1 | 2 | 3;
  tierTitle: string;
  clientName: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  invoiceNumber: string;
  originalDueDate: string;
  daysLate: number;
  principalAmount: number;
  lateInterest: number;
  lateFee: number;
  totalSettlementDue: number;
  formalLetterBody: string;
  whatsappMessageText: string;
}

export class DunningEngine {
  /**
   * Calculates statutory monthly interest rate based on company registration state
   */
  public static getStatutoryInterestRate(state: string): number {
    switch (state.toUpperCase()) {
      case 'TX':
        return 1.0; // Texas Prompt Payment Act ~ 1.0% / month
      case 'GA':
        return 1.5; // Georgia statutory commercial rate ~ 1.5% / month (18% p.a.)
      case 'DE':
      default:
        return 1.5; // Delaware default commercial rate
    }
  }

  /**
   * Evaluates overdue invoices and generates aging reports
   */
  public static evaluateAgingAccounts(companyId: string, companyLegalName?: string): OverdueAccount[] {
    const isMilla = companyId.includes('milla') || (companyLegalName && companyLegalName.toLowerCase().includes('milla'));
    const isApex = companyId.includes('apex') || companyId.includes('cleanops') || (companyLegalName && companyLegalName.toLowerCase().includes('cleanops'));

    if (isMilla) {
      return [
        {
          invoiceId: 'inv-mila-2026-001',
          invoiceNumber: 'INV-MILA-2026-042',
          clientId: 'cli-001',
          clientName: 'Buckhead Luxury Condominiums HOA',
          contactEmail: 'accounting@buckheadhoa.com',
          contactPhone: '+1 (404) 555-0192',
          companyName: 'Milla Maid Services LLC',
          companyState: 'GA',
          companyEin: '84-3910294',
          originalAmount: 4850.00,
          issueDate: '2026-06-15',
          dueDate: '2026-07-15',
          daysOverdue: 38,
          agingBucket: '31-60',
          monthlyInterestRatePct: 1.5,
          accruedInterestAmount: 92.15,
          lateFeePenalty: 75.00,
          totalBalanceDue: 5017.15,
          dunningLevel: 2,
        },
        {
          invoiceId: 'inv-mila-2026-002',
          invoiceNumber: 'INV-MILA-2026-039',
          clientId: 'cli-002',
          clientName: 'Peachtree Midtown Corporate Tower',
          contactEmail: 'facilities@peachtreetower.com',
          contactPhone: '+1 (404) 555-0144',
          companyName: 'Milla Maid Services LLC',
          companyState: 'GA',
          companyEin: '84-3910294',
          originalAmount: 8400.00,
          issueDate: '2026-05-01',
          dueDate: '2026-05-31',
          daysOverdue: 83,
          agingBucket: '61-90',
          monthlyInterestRatePct: 1.5,
          accruedInterestAmount: 348.60,
          lateFeePenalty: 150.00,
          totalBalanceDue: 8898.60,
          dunningLevel: 3,
        },
        {
          invoiceId: 'inv-mila-2026-003',
          invoiceNumber: 'INV-MILA-2026-048',
          clientId: 'cli-003',
          clientName: 'Piedmont Heights Medical Center',
          contactEmail: 'ap@piedmontmed.org',
          contactPhone: '+1 (404) 555-0188',
          companyName: 'Milla Maid Services LLC',
          companyState: 'GA',
          companyEin: '84-3910294',
          originalAmount: 3200.00,
          issueDate: '2026-07-20',
          dueDate: '2026-08-10',
          daysOverdue: 12,
          agingBucket: '0-30',
          monthlyInterestRatePct: 1.5,
          accruedInterestAmount: 19.20,
          lateFeePenalty: 50.00,
          totalBalanceDue: 3269.20,
          dunningLevel: 1,
        },
      ];
    }

    if (isApex) {
      return [
        {
          invoiceId: 'inv-apx-2026-001',
          invoiceNumber: 'INV-APX-2026-018',
          clientId: 'cli-tx-001',
          clientName: 'Austin Tech Ridge Distribution Hub',
          contactEmail: 'billing@austintechhub.com',
          contactPhone: '+1 (512) 555-0129',
          companyName: 'Apex CleanOps Commercial Services LLC',
          companyState: 'TX',
          companyEin: '84-9281742',
          originalAmount: 12500.00,
          issueDate: '2026-06-01',
          dueDate: '2026-07-01',
          daysOverdue: 52,
          agingBucket: '31-60',
          monthlyInterestRatePct: 1.0,
          accruedInterestAmount: 216.67,
          lateFeePenalty: 125.00,
          totalBalanceDue: 12841.67,
          dunningLevel: 2,
        },
        {
          invoiceId: 'inv-apx-2026-002',
          invoiceNumber: 'INV-APX-2026-012',
          clientId: 'cli-tx-002',
          clientName: 'Dallas North Tollway Office Suites',
          contactEmail: 'ap@dallasofficesuites.com',
          contactPhone: '+1 (214) 555-0176',
          companyName: 'Apex CleanOps Commercial Services LLC',
          companyState: 'TX',
          companyEin: '84-9281742',
          originalAmount: 6800.00,
          issueDate: '2026-04-15',
          dueDate: '2026-05-15',
          daysOverdue: 99,
          agingBucket: '90+',
          monthlyInterestRatePct: 1.0,
          accruedInterestAmount: 224.40,
          lateFeePenalty: 150.00,
          totalBalanceDue: 7174.40,
          dunningLevel: 3,
        },
      ];
    }

    // Default Apex Cloud Technologies Inc. (DE)
    return [
      {
        invoiceId: 'inv-cld-2026-001',
        invoiceNumber: 'INV-CLD-2026-007',
        clientId: 'cli-de-001',
        clientName: 'VentureScale SaaS Platform Inc.',
        contactEmail: 'finance@venturescale.io',
        contactPhone: '+1 (302) 555-0165',
        companyName: 'Apex Cloud Technologies Inc.',
        companyState: 'DE',
        companyEin: '88-9182736',
        originalAmount: 15000.00,
        issueDate: '2026-07-01',
        dueDate: '2026-07-31',
        daysOverdue: 22,
        agingBucket: '0-30',
        monthlyInterestRatePct: 1.5,
        accruedInterestAmount: 165.00,
        lateFeePenalty: 100.00,
        totalBalanceDue: 15265.00,
        dunningLevel: 1,
      },
    ];
  }

  /**
   * Generates formal Dunning Letters and WhatsApp texts based on severity tier
   */
  public static generateDunningNotice(account: OverdueAccount): DunningNoticeLetter {
    const today = new Date().toISOString().split('T')[0];
    const noticeId = `DUN-${account.companyState}-${today.replace(/-/g, '')}-${account.invoiceNumber.replace(/[^0-9]/g, '')}`;

    let tierTitle = 'Lembrete de Cortesia de Fatura em Aberto (Courtesy Reminder)';
    let formalBody = '';
    let whatsappText = '';

    if (account.dunningLevel === 1) {
      tierTitle = 'Nível 1: Lembrete Amigável de Vencimento (Courtesy Reminder)';
      formalBody = `Prezada equipe do departamento financeiro de ${account.clientName},\n\n` +
        `Esperamos que esta mensagem o encontre bem. Notamos em nossos registros que a Fatura ${account.invoiceNumber}, ` +
        `com vencimento original em ${account.dueDate} no valor de $${account.originalAmount.toFixed(2)}, consta atualmente como pendente de liquidação ` +
        `(${account.daysOverdue} dias em atraso).\n\n` +
        `Entendemos que atrasos eventuais podem ocorrer no fluxo de processamento de contas a pagar. Solicitamos gentilmente a gentileza de verificar ` +
        `o status deste pagamento ou nos fornecer a data prevista para liquidação.\n\n` +
        `Para sua comodidade, o pagamento pode ser efetuado diretamente via transferência bancária ACH ou através do nosso Portal do Cliente.\n\n` +
        `Agradecemos antecipadamente por sua atenção e parceria comercial.`;

      whatsappText = `Olá ${account.clientName}! Gostaríamos de lembrar que a fatura ${account.invoiceNumber} no valor de $${account.originalAmount.toFixed(2)} venceu em ${account.dueDate}. Segue o link para conferência e pagamento rápido: https://uas-accounting.vercel.app/invoice/${account.invoiceId}. Qualquer dúvida estamos à disposição!`;
    } else if (account.dunningLevel === 2) {
      tierTitle = 'Nível 2: Notificação Formal de Saldo Vencido (Second Notice of Overdue Balance)';
      formalBody = `Prezada diretoria e gestão financeira de ${account.clientName},\n\n` +
        `Dirigimo-nos a V.Sas. para apresentar a Segunda Notificação Formal referente à Fatura ${account.invoiceNumber}, ` +
        `vencida desde ${account.dueDate} (${account.daysOverdue} dias decorridos).\n\n` +
        `Conforme estipulado nos termos contratuais e na legislação comercial vigente do Estado de ${account.companyState}, ` +
        `foram acrescidos juros de mora contratuais de $${account.accruedInterestAmount.toFixed(2)} (${account.monthlyInterestRatePct}% ao mês) ` +
        `e taxa administrativa de atraso de $${account.lateFeePenalty.toFixed(2)}, totalizando o saldo atualizado de $${account.totalBalanceDue.toFixed(2)}.\n\n` +
        `Solicitamos a regularização deste débito no prazo improrrogável de 5 (cinco) dias úteis para evitar a suspensão temporária ` +
        `da prestação de serviços e encargos adicionais.\n\n` +
        `Aguardamos a confirmação do comprovante de transferência bancária.`;

      whatsappText = `URGENTE: Prezado cliente ${account.clientName}, identificamos que a fatura ${account.invoiceNumber} está com ${account.daysOverdue} dias de atraso. O saldo atualizado com encargos é de $${account.totalBalanceDue.toFixed(2)}. Por favor, regularize via: https://uas-accounting.vercel.app/invoice/${account.invoiceId} para evitar a suspensão dos serviços contratados.`;
    } else {
      tierTitle = 'Nível 3: Notificação Extrajudicial Final (Final Demand for Immediate Payment)';
      formalBody = `NOTIFICAÇÃO EXTRAJUDICIAL DE COBRANÇA E EXIGÊNCIA DE PAGAMENTO IMEDIATO\n\n` +
        `À: ${account.clientName}\n` +
        `A/C: Controladoria & Representantes Legais\n\n` +
        `Por meio deste instrumento formal, NOTIFICAMOS ${account.clientName} acerca do inadimplemento grave da Fatura ${account.invoiceNumber}, ` +
        `vencida há ${account.daysOverdue} dias (Vencimento: ${account.dueDate}), referente aos serviços prestados por ${account.companyName}.\n\n` +
        `DISCRIMINAÇÃO DO DÉBITO:\n` +
        `- Valor Principal Original: $${account.originalAmount.toFixed(2)}\n` +
        `- Juros Moratórios Legais (${account.companyState}): $${account.accruedInterestAmount.toFixed(2)}\n` +
        `- Penalidade de Atraso e Custos Administrativos: $${account.lateFeePenalty.toFixed(2)}\n` +
        `- TOTAL DEVIDO PARA LIQUIDAÇÃO IMEDIATA: $${account.totalBalanceDue.toFixed(2)}\n\n` +
        `Fica concedido o prazo impreterível de 48 (quarenta e oito) horas a contar do recebimento desta para a quitação integral do montante devido. ` +
        `O não cumprimento ensejará o encaminhamento imediato do processo ao nosso departamento jurídico para cobrança judicial, ` +
        `protesto cartorário e reporte aos órgãos de proteção ao crédito (Dun & Bradstreet / Experian Commercial), além da cobrança de honorários advocatícios.\n\n` +
        `Atenciosamente,\n` +
        `${account.companyName} — Departamento de Recuperação de Crédito & Controladoria`;

      whatsappText = `NOTIFICAÇÃO FINAL: ${account.clientName}, sua fatura ${account.invoiceNumber} está vencida há ${account.daysOverdue} dias com saldo de $${account.totalBalanceDue.toFixed(2)}. Solicitamos o pagamento imediato em até 48h pelo link: https://uas-accounting.vercel.app/invoice/${account.invoiceId} para evitar o encaminhamento para cobrança jurídica e órgãos de crédito.`;
    }

    return {
      noticeId,
      date: today,
      tierLevel: account.dunningLevel,
      tierTitle,
      clientName: account.clientName,
      companyName: account.companyName,
      companyAddress: '2300 Global Forum Blvd, Suite 813 • Doraville, GA 30340',
      companyPhone: '+1 (404) 890-1234',
      companyEmail: 'finance@millamaid.com',
      invoiceNumber: account.invoiceNumber,
      originalDueDate: account.dueDate,
      daysLate: account.daysOverdue,
      principalAmount: account.originalAmount,
      lateInterest: account.accruedInterestAmount,
      lateFee: account.lateFeePenalty,
      totalSettlementDue: account.totalBalanceDue,
      formalLetterBody: formalBody,
      whatsappMessageText: whatsappText,
    };
  }
}
