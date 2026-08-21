import Decimal from 'decimal.js';
import { CreateJournalEntryInput } from './types';

export interface FixedAssetItem {
  id: string;
  assetName: string;
  assetTag: string;
  purchaseDate: string;
  costBasis: number;
  salvageValue: number;
  usefulLifeMonths: number;
  monthsDepreciated: number;
  accumulatedDepreciation: number;
  currentBookValue: number;
  assetAccountCode: string; // e.g. '1510' Computer Equipment
  depreciationExpenseAccountCode: string; // '6400'
  accumulatedDepreciationAccountCode: string; // '1520'
  status: 'ACTIVE_IN_SERVICE' | 'FULLY_DEPRECIATED' | 'DISPOSED';
}

export interface PeriodLockConfig {
  organizationId: string;
  lockedThroughDate: string; // e.g. '2026-06-30'
  lockedByUserId: string;
  lockedByUserName: string;
  lockedAt: string;
}

export class FixedAssetsEngine {
  /**
   * Calculates monthly straight-line depreciation for an active asset
   */
  public static calculateMonthlyDepreciation(asset: FixedAssetItem): number {
    if (asset.status !== 'ACTIVE_IN_SERVICE' || asset.monthsDepreciated >= asset.usefulLifeMonths) {
      return 0;
    }

    const depreciableCostDec = new Decimal(asset.costBasis).minus(new Decimal(asset.salvageValue));
    const monthlyDepDec = depreciableCostDec.dividedBy(new Decimal(asset.usefulLifeMonths));
    return parseFloat(monthlyDepDec.toFixed(2));
  }

  /**
   * Generates a balanced US GAAP Journal Entry for monthly depreciation of active fixed assets
   * Debit: 6400 Depreciation & Amortization Expense
   * Credit: 1520 Accumulated Depreciation
   */
  public static generateDepreciationJournalEntry(
    organizationId: string,
    assets: FixedAssetItem[],
    periodDate: string = new Date().toISOString().split('T')[0]
  ): {
    totalDepreciation: number;
    journalEntry: CreateJournalEntryInput;
    updatedAssets: FixedAssetItem[];
  } {
    let totalDepDec = new Decimal(0);
    const updatedAssets: FixedAssetItem[] = [];

    for (const asset of assets) {
      const monthlyDep = this.calculateMonthlyDepreciation(asset);
      totalDepDec = totalDepDec.plus(monthlyDep);

      const newMonths = asset.monthsDepreciated + 1;
      const newAccum = new Decimal(asset.accumulatedDepreciation).plus(monthlyDep).toNumber();
      const newBookVal = new Decimal(asset.costBasis).minus(newAccum).toNumber();
      const isFullyDep = newMonths >= asset.usefulLifeMonths;

      updatedAssets.push({
        ...asset,
        monthsDepreciated: newMonths,
        accumulatedDepreciation: parseFloat(newAccum.toFixed(2)),
        currentBookValue: parseFloat(newBookVal.toFixed(2)),
        status: isFullyDep ? 'FULLY_DEPRECIATED' : 'ACTIVE_IN_SERVICE',
      });
    }

    const totalDep = parseFloat(totalDepDec.toFixed(2));

    const journalEntry: CreateJournalEntryInput = {
      organizationId,
      date: new Date(periodDate),
      memo: `Monthly Straight-Line Depreciation - ${assets.length} Active Fixed Assets (${periodDate})`,
      basis: 'ACCRUAL',
      sourceType: 'DEPRECIATION',
      sourceId: `dep-${periodDate}`,
      lines: [
        {
          accountId: '6400', // Depreciation & Amortization Expense
          debit: totalDep,
          credit: 0,
          description: `Depreciation Expense on Computer & Studio Equipment`,
        },
        {
          accountId: '1520', // Accumulated Depreciation
          debit: 0,
          credit: totalDep,
          description: `Contra-Asset Accumulated Depreciation for period ${periodDate}`,
        },
      ],
    };

    return {
      totalDepreciation: totalDep,
      journalEntry,
      updatedAssets,
    };
  }

  /**
   * Validates whether a transaction date falls into a locked fiscal period (Hard Close rule)
   */
  public static validatePeriodLock(
    entryDate: string,
    lockConfig?: PeriodLockConfig
  ): { allowed: boolean; error?: string } {
    if (!lockConfig || !lockConfig.lockedThroughDate) {
      return { allowed: true };
    }

    const eDate = new Date(entryDate).getTime();
    const lDate = new Date(lockConfig.lockedThroughDate).getTime();

    if (eDate <= lDate) {
      return {
        allowed: false,
        error: `Hard Close Violation: Period through ${lockConfig.lockedThroughDate} is locked by ${lockConfig.lockedByUserName}. Retroactive entries are prohibited.`,
      };
    }

    return { allowed: true };
  }
}
