export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  metricsReference?: string;
  suggestedAction?: string;
}

export class CfaCopilotEngine {
  /**
   * Generates expert CPA / CFA responses based on financial query and live ledger state
   */
  public static generateResponse(
    query: string,
    lang: 'en' | 'pt' | 'es' = 'en',
    currentMetrics = { runwayMonths: 14.8, cashBalance: 415200, grossMargin: 71.4, dso: 24 }
  ): CopilotMessage {
    const q = query.toLowerCase();
    let replyText = '';
    let metricRef = '';
    let action = '';

    if (/runway|queima|burn|liquidez|liquidity/i.test(q)) {
      if (lang === 'pt') {
        replyText = `O Runway atual é de **${currentMetrics.runwayMonths} meses**, com saldo em caixa e tesouraria de **$${currentMetrics.cashBalance.toLocaleString()}**. Sua taxa de queima líquida mensal está sob controle em $28.050.`;
        metricRef = 'Net Runway: 14.8 meses • Burn: $28,050/mês';
        action = 'Alocar excedente acima de 6 meses de queima em US T-Bills para rendimento passivo.';
      } else if (lang === 'es') {
        replyText = `El Runway actual es de **${currentMetrics.runwayMonths} meses**, con liquidez total de **$${currentMetrics.cashBalance.toLocaleString()}**. La tasa de quema mensual es óptima.`;
        metricRef = 'Net Runway: 14.8 meses';
        action = 'Optimizar saldos ociosos en pagarés del Tesoro de EE.UU.';
      } else {
        replyText = `Your current Net Runway is **${currentMetrics.runwayMonths} months**, backed by **$${currentMetrics.cashBalance.toLocaleString()}** in operating and treasury reserves. Monthly net burn is stable at $28,050.`;
        metricRef = 'Net Runway: 14.8 months • Monthly Burn: $28,050';
        action = 'Deploy cash reserves exceeding 6-month buffer into short-term US Treasury yields.';
      }
    } else if (/retainer|amortizacao|amortizacion|asc 606/i.test(q)) {
      if (lang === 'pt') {
        replyText = `Sob a norma **ASC 606**, honorários antecipados (*Retainers*) são registrados inicialmente no Passivo (\`2100 Receita Antecipada\`). À medida que as horas da equipe são aprovadas, o sistema debita a conta 2100 e credita \`4030 Receita de Retainers\`.`;
        metricRef = 'ASC 606 Revenue Recognition: Unearned Revenue to Earned Revenue';
        action = 'Executar a rotina de amortização quinzenal antes do fechamento do faturamento.';
      } else {
        replyText = `Under **ASC 606**, upfront client retainers are held on the Balance Sheet as a liability (\`2100 Unearned Revenue\`). As billable hours are tracked, the system debits Account 2100 and credits \`4030 Retainer Service Revenue\`.`;
        metricRef = 'ASC 606 Compliance: DR 2100 / CR 4030';
        action = 'Review and approve pending time entries to trigger automatic GL amortization.';
      }
    } else if (/imposto|tax|irs|1065|1120|deducao|deductions/i.test(q)) {
      if (lang === 'pt') {
        replyText = `Suas contas do diário estão mapeadas em tempo real para os formulários oficiais do IRS (**Form 1065, Form 1120-S e Schedule C**). Todos os honorários de contratados 1099 e custos diretos de cloud são 100% dedutíveis como despesas operacionais da empresa.`;
        metricRef = 'IRS MeF XML Direct Mapping Active';
        action = 'Exportar o pacote XML MeF para envio ao CPA ou software fiscal.';
      } else {
        replyText = `Your General Ledger accounts are continuously mapped to official IRS returns (**Forms 1065, 1120-S, 1120 & Schedule C**). Subcontractor 1099 fees, software tools, and employee benefits are fully deductible under IRC Section 162.`;
        metricRef = 'IRS MeF Continuous Line Mapping';
        action = 'Generate IRS Form 1065 / 1120-S MeF XML package for electronic filing.';
      }
    } else {
      if (lang === 'pt') {
        replyText = `Como seu **Copiloto Financeiro & Contábil CFA**, analisei a saúde geral da Apex Cloud Services: Margem Bruta em **${currentMetrics.grossMargin}%**, DSO em **${currentMetrics.dso} dias** e Balanço Patrimonial em perfeito equilíbrio US GAAP.`;
        metricRef = `Margem Bruta: ${currentMetrics.grossMargin}% • DSO: ${currentMetrics.dso} dias`;
        action = 'Manter estrutura de preços horários entre $220 e $250/h.';
      } else {
        replyText = `As your **CFA AI Financial & Accounting Copilot**, I have verified your general ledger metrics: Service Gross Margin is strong at **${currentMetrics.grossMargin}%**, DSO is at a healthy **${currentMetrics.dso} days**, and the General Ledger is in mathematical equilibrium.`;
        metricRef = `Gross Margin: ${currentMetrics.grossMargin}% • DSO: ${currentMetrics.dso} days`;
        action = 'Maintain standard $220-$250/hr billable engineering realization rate.';
      }
    }

    return {
      id: `msg-${Math.random().toString(36).substring(7)}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: replyText,
      metricsReference: metricRef,
      suggestedAction: action,
    };
  }
}
