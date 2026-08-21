'use client';

import React, { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency } from '@/lib/i18n/formatters';
import {
  AdvancedMonteCarloEngine,
  SensitivityScenarioParams,
  AdvancedMonteCarloResult,
} from '@/lib/bi/advanced-monte-carlo';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Sliders, Flame, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';

export function SensitivityAnalysisMatrix() {
  const { locale, t } = useI18n();

  const [params, setParams] = useState<SensitivityScenarioParams>({
    revenueShockPercent: 0,
    dsoDelayDays: 0,
    fixedCostEscalationPercent: 0,
  });

  const simResult: AdvancedMonteCarloResult = useMemo(() => {
    return AdvancedMonteCarloEngine.runSensitivitySimulation(
      415200, // Current cash
      28050, // Base monthly burn
      65000, // Base monthly inflow
      params,
      10000 // 10,000 iterations
    );
  }, [params]);

  return (
    <Card className="border-purple-500/20 bg-slate-950">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Stochastic Sensitivity Matrix (10,000 Monte Carlo Paths)</CardTitle>
              <CardDescription>
                Multi-Factor Stress Testing: Revenue Shocks, Receivables Delay & Cost Escalation
              </CardDescription>
            </div>
          </div>
          <Badge variant={simResult.insolvencyRiskPercent === 0 ? 'success' : 'warning'}>
            Insolvency Risk: {simResult.insolvencyRiskPercent}%
          </Badge>
        </div>
      </CardHeader>

      <div className="space-y-6">
        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
          {/* Revenue Shock */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Revenue Shock:</span>
              <span
                className={`font-mono font-bold ${
                  params.revenueShockPercent < 0
                    ? 'text-rose-400'
                    : params.revenueShockPercent > 0
                    ? 'text-emerald-400'
                    : 'text-white'
                }`}
              >
                {params.revenueShockPercent > 0 ? `+${params.revenueShockPercent}%` : `${params.revenueShockPercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="5"
              value={params.revenueShockPercent}
              onChange={(e) => setParams({ ...params, revenueShockPercent: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-30% Drop</span>
              <span>Baseline</span>
              <span>+30% Surge</span>
            </div>
          </div>

          {/* DSO Receivables Delay */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">DSO Collection Delay:</span>
              <span className="font-mono font-bold text-amber-400">+{params.dsoDelayDays} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              step="5"
              value={params.dsoDelayDays}
              onChange={(e) => setParams({ ...params, dsoDelayDays: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 (Immediate)</span>
              <span>+20 days</span>
              <span>+45 days delay</span>
            </div>
          </div>

          {/* Cost Escalation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Cost & Wage Inflation:</span>
              <span className="font-mono font-bold text-rose-400">+{params.fixedCostEscalationPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="2"
              value={params.fixedCostEscalationPercent}
              onChange={(e) => setParams({ ...params, fixedCostEscalationPercent: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% Normal</span>
              <span>+10% Inflation</span>
              <span>+20% High Burn</span>
            </div>
          </div>
        </div>

        {/* Dynamic Simulation Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Stress Runway Horizon</span>
            <span className="text-xl font-mono font-bold text-emerald-400 mt-1 block">
              {simResult.projectedRunwayMonths} months
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Under current simulated parameters</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">95% Cash-at-Risk (CVaR)</span>
            <span className="text-xl font-mono font-bold text-rose-400 mt-1 block">
              {formatCurrency(simResult.cashAtRisk95Percent, 'USD', locale)}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">5th percentile downside threshold</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">90-Day P50 Median Cash</span>
            <span className="text-xl font-mono font-bold text-sky-400 mt-1 block">
              {formatCurrency(simResult.p50Median90d, 'USD', locale)}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Expected median treasury balance</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">90-Day P10 Downside Cash</span>
            <span className="text-xl font-mono font-bold text-amber-400 mt-1 block">
              {formatCurrency(simResult.p10WorstCase90d, 'USD', locale)}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">10th percentile stress boundary</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
