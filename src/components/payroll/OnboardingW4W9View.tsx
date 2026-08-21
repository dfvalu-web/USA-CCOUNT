'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { formatCurrency, formatDate } from '@/lib/i18n/formatters';
import {
  OnboardingEngine,
  ItemizedPaystubBreakdown,
} from '@/lib/payroll/onboarding-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { UserPlus, FileText, CheckCircle2, ShieldCheck, Download, AlertCircle } from 'lucide-react';

export function OnboardingW4W9View() {
  const { locale, t } = useI18n();

  const [activeForm, setActiveForm] = useState<'W4' | 'W9'>('W4');
  const [ssnInput, setSsnInput] = useState('123-45-6789');
  const [fullName, setFullName] = useState('Alexander Rivera');
  const [grossInput, setGrossInput] = useState('6250');
  const [stateInput, setStateInput] = useState('CA');

  const [validationResult, setValidationResult] = useState<{ isValid: boolean; error?: string } | null>(null);
  const [generatedPaystub, setGeneratedPaystub] = useState<ItemizedPaystubBreakdown | null>(null);

  const handleValidateAndGenerate = () => {
    const valid = OnboardingEngine.validateSSN(ssnInput);
    setValidationResult(valid);

    if (valid.isValid) {
      const stub = OnboardingEngine.generateItemizedPaystub(
        fullName,
        ssnInput,
        parseFloat(grossInput) || 6250,
        stateInput,
        250, // Health
        5 // 5% 401k
      );
      setGeneratedPaystub(stub);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-emerald-500/20 bg-slate-950">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>Worker Tax Onboarding (IRS Form W-4 & W-9)</CardTitle>
                <CardDescription>
                  Algorithmic TIN/SSN Validation • Real-Time Pre-Tax Deductions (401k & Section 125)
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={activeForm === 'W4' ? 'primary' : 'outline'}
                onClick={() => setActiveForm('W4')}
              >
                Form W-4 (W-2 Employee)
              </Button>
              <Button
                size="sm"
                variant={activeForm === 'W9' ? 'primary' : 'outline'}
                onClick={() => setActiveForm('W9')}
              >
                Form W-9 (1099 Contractor)
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">SSN or TIN (9 Digits)</label>
              <input
                type="text"
                value={ssnInput}
                onChange={(e) => setSsnInput(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Gross Semi-Monthly Salary ($)</label>
              <input
                type="number"
                value={grossInput}
                onChange={(e) => setGrossInput(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Work State (SIT/SUTA)</label>
              <select
                value={stateInput}
                onChange={(e) => setStateInput(e.target.value)}
                className="w-full h-8 rounded bg-slate-900 border border-slate-800 px-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="CA">California (CA - 6.0% SIT)</option>
                <option value="NY">New York (NY - 5.85% SIT)</option>
                <option value="TX">Texas (TX - 0.0% No SIT)</option>
                <option value="FL">Florida (FL - 0.0% No SIT)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              {validationResult && !validationResult.isValid && (
                <span className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {validationResult.error}
                </span>
              )}
            </div>

            <Button size="sm" variant="primary" onClick={handleValidateAndGenerate}>
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verify IRS TIN & Generate Official Paystub
            </Button>
          </div>
        </div>

        {/* Generated Official Itemized Paystub */}
        {generatedPaystub && (
          <div className="m-4 p-5 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  Official Itemized Paystub • {generatedPaystub.employeeName}
                  <Badge variant="success" className="text-[10px]">
                    IRS & State Verified
                  </Badge>
                </h4>
                <p className="text-xs text-slate-400">
                  SSN: {generatedPaystub.ssnMasked} • Pay Date: {generatedPaystub.payDate} • State: {stateInput}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">Net Direct Deposit Payout</span>
                <span className="text-xl font-mono font-bold text-emerald-400">
                  {formatCurrency(generatedPaystub.netPay, 'USD', locale)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Earnings & Pre-tax */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                  Gross Earnings & Pre-Tax
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-300">Gross Salary:</span>
                  <span className="font-mono text-white font-semibold">
                    {formatCurrency(generatedPaystub.grossWages, 'USD', locale)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Sec 125 Health Plan:</span>
                  <span className="font-mono">
                    -{formatCurrency(generatedPaystub.preTaxDeductions.section125HealthInsurance, 'USD', locale)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>401(k) Retirement (5%):</span>
                  <span className="font-mono">
                    -{formatCurrency(generatedPaystub.preTaxDeductions.retirement401k, 'USD', locale)}
                  </span>
                </div>
              </div>

              {/* Employee Taxes */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                  Employee Taxes Withheld
                </span>
                <div className="flex justify-between text-rose-400">
                  <span>Federal Income Tax (FIT):</span>
                  <span className="font-mono">
                    -{formatCurrency(generatedPaystub.employeeTaxesWithheld.federalIncomeTax, 'USD', locale)}
                  </span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>Social Security (6.2%):</span>
                  <span className="font-mono">
                    -{formatCurrency(generatedPaystub.employeeTaxesWithheld.socialSecurityTax, 'USD', locale)}
                  </span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>Medicare (1.45%):</span>
                  <span className="font-mono">
                    -{formatCurrency(generatedPaystub.employeeTaxesWithheld.medicareTax, 'USD', locale)}
                  </span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>State SIT ({stateInput}):</span>
                  <span className="font-mono">
                    -{formatCurrency(generatedPaystub.employeeTaxesWithheld.stateIncomeTax, 'USD', locale)}
                  </span>
                </div>
              </div>

              {/* Employer Contributions */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                  Employer Matching Burden
                </span>
                <div className="flex justify-between text-slate-300">
                  <span>FICA SS Match (6.2%):</span>
                  <span className="font-mono">
                    +{formatCurrency(generatedPaystub.employerTaxesPaid.socialSecurityMatch, 'USD', locale)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Medicare Match (1.45%):</span>
                  <span className="font-mono">
                    +{formatCurrency(generatedPaystub.employerTaxesPaid.medicareMatch, 'USD', locale)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>FUTA (0.6%) & SUTA:</span>
                  <span className="font-mono">
                    +{formatCurrency(
                      generatedPaystub.employerTaxesPaid.futaTax + generatedPaystub.employerTaxesPaid.sutaTax,
                      'USD',
                      locale
                    )}
                  </span>
                </div>
                <div className="pt-1 border-t border-slate-800 flex justify-between font-bold text-sky-400">
                  <span>Total Employer Burden:</span>
                  <span className="font-mono">
                    {formatCurrency(generatedPaystub.employerTaxesPaid.totalEmployerTaxes, 'USD', locale)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
