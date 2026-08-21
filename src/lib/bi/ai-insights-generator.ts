export interface AIFinancialInsight {
  category: 'LIQUIDITY' | 'MARGIN' | 'PRICING' | 'TAX_EFFICIENCY';
  severity: 'POSITIVE' | 'NEUTRAL' | 'CRITICAL';
  title: string;
  narrative: string;
  actionRecommendation: string;
}

export class AIFinancialInsightsEngine {
  /**
   * Generates actionable narrative intelligence from financial metrics
   */
  public static generateInsights(
    runwayMonths: number,
    grossMarginPercent: number,
    dsoDays: number,
    billableUtilization: number
  ): AIFinancialInsight[] {
    const insights: AIFinancialInsight[] = [];

    // Runway & Liquidity
    if (runwayMonths >= 12) {
      insights.push({
        category: 'LIQUIDITY',
        severity: 'POSITIVE',
        title: 'Exceptional Runway Health (> 12 Months)',
        narrative: `Current treasury cash balance provides ${runwayMonths} months of operation under standard burn rate. Cash reserves exceed safe seed/growth venture benchmarks.`,
        actionRecommendation: 'Deploy idle capital above 6-month buffer into short-term US Treasury yield instruments to maximize interest income.',
      });
    } else if (runwayMonths < 6) {
      insights.push({
        category: 'LIQUIDITY',
        severity: 'CRITICAL',
        title: 'Runway Below 6 Months — Immediate Action Needed',
        narrative: `Runway has contracted to ${runwayMonths} months. Accelerated collection of open receivables is required.`,
        actionRecommendation: 'Enforce upfront retainer deposits on all new service contracts and shorten invoice terms to Net 15.',
      });
    }

    // Gross Margin
    if (grossMarginPercent >= 70) {
      insights.push({
        category: 'MARGIN',
        severity: 'POSITIVE',
        title: 'Top-Decile Service Gross Margin (70%+)',
        narrative: `Delivering service gross margins of ${grossMarginPercent}%, placing the company in the top quartile of tech consulting and specialized engineering firms.`,
        actionRecommendation: 'Maintain standard billable hourly rate structure ($220-$250/hr) across newly signed SOWs.',
      });
    }

    // DSO (Receivable Velocity)
    if (dsoDays <= 30) {
      insights.push({
        category: 'PRICING',
        severity: 'POSITIVE',
        title: 'Accelerated Collection Velocity (DSO <= 30 Days)',
        narrative: `Days Sales Outstanding is at ${dsoDays} days. Clients are clearing invoices promptly, minimizing working capital lockup.`,
        actionRecommendation: 'Continue incentivizing ACH direct payment links embedded directly inside invoice emails.',
      });
    }

    // Team Utilization
    if (billableUtilization >= 80) {
      insights.push({
        category: 'MARGIN',
        severity: 'POSITIVE',
        title: 'High Team Capacity Utilization (80%+)',
        narrative: `Billable utilization is at ${billableUtilization}%. The engineering delivery team is operating near peak productivity.`,
        actionRecommendation: 'Evaluate onboarding additional 1099 contractors to avoid developer burnout on upcoming Q4 deliverables.',
      });
    }

    return insights;
  }
}
