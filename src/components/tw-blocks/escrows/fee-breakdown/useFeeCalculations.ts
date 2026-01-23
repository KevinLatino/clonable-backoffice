"use client";

import { useMemo } from "react";
import { GetEscrowsFromIndexerResponse } from "@trustless-work/escrow/types";
import { MultiReleaseMilestone } from "@trustless-work/escrow";

const TRUSTLESS_WORK_FEE_PERCENT = 0.3;

export interface FeeCalculation {
  totalAmount: number;
  platformFeePercent: number;
  platformFeeAmount: number;
  trustlessWorkPercent: number;
  trustlessWorkAmount: number;
  receiverPercent: number;
  receiverAmount: number;
}

export interface MilestoneFeeCalculation extends FeeCalculation {
  milestoneIndex: number;
  description: string;
  status: string;
}

export interface FeeBreakdownSummary {
  totalAmount: number;
  totalPlatformFees: number;
  totalTrustlessWorkFees: number;
  totalReceiverAmount: number;
  platformFeePercent: number;
}

function calculateFees(
  amount: number,
  platformFeePercent: number,
): FeeCalculation {
  const platformFeeAmount = (amount * platformFeePercent) / 100;
  const trustlessWorkAmount = (amount * TRUSTLESS_WORK_FEE_PERCENT) / 100;
  const receiverPercent = 100 - platformFeePercent - TRUSTLESS_WORK_FEE_PERCENT;
  const receiverAmount = (amount * receiverPercent) / 100;

  return {
    totalAmount: amount,
    platformFeePercent,
    platformFeeAmount,
    trustlessWorkPercent: TRUSTLESS_WORK_FEE_PERCENT,
    trustlessWorkAmount,
    receiverPercent,
    receiverAmount,
  };
}

export const useFeeCalculations = (
  escrow: GetEscrowsFromIndexerResponse | null,
) => {
  const isMultiRelease = escrow?.type === "multi-release";

  const singleReleaseFees = useMemo<FeeCalculation | null>(() => {
    if (!escrow || isMultiRelease) return null;
    return calculateFees(escrow.amount, escrow.platformFee);
  }, [escrow, isMultiRelease]);

  const milestoneFees = useMemo<MilestoneFeeCalculation[]>(() => {
    if (!escrow || !isMultiRelease) return [];

    const milestones = escrow.milestones as MultiReleaseMilestone[];
    return milestones.map((milestone, index) => {
      const fees = calculateFees(Number(milestone.amount), escrow.platformFee);
      return {
        ...fees,
        milestoneIndex: index,
        description: milestone.description || `Milestone ${index + 1}`,
        status: milestone.status || "pending",
      };
    });
  }, [escrow, isMultiRelease]);

  const summary = useMemo<FeeBreakdownSummary | null>(() => {
    if (!escrow) return null;

    if (isMultiRelease) {
      const milestones = escrow.milestones as MultiReleaseMilestone[];
      const totalAmount = milestones.reduce(
        (acc, m) => acc + Number(m.amount),
        0,
      );
      const totalPlatformFees = milestoneFees.reduce(
        (acc, m) => acc + m.platformFeeAmount,
        0,
      );
      const totalTrustlessWorkFees = milestoneFees.reduce(
        (acc, m) => acc + m.trustlessWorkAmount,
        0,
      );
      const totalReceiverAmount = milestoneFees.reduce(
        (acc, m) => acc + m.receiverAmount,
        0,
      );

      return {
        totalAmount,
        totalPlatformFees,
        totalTrustlessWorkFees,
        totalReceiverAmount,
        platformFeePercent: escrow.platformFee,
      };
    } else {
      return {
        totalAmount: escrow.amount,
        totalPlatformFees: singleReleaseFees?.platformFeeAmount ?? 0,
        totalTrustlessWorkFees: singleReleaseFees?.trustlessWorkAmount ?? 0,
        totalReceiverAmount: singleReleaseFees?.receiverAmount ?? 0,
        platformFeePercent: escrow.platformFee,
      };
    }
  }, [escrow, isMultiRelease, milestoneFees, singleReleaseFees]);

  return {
    isMultiRelease,
    singleReleaseFees,
    milestoneFees,
    summary,
    trustlessWorkFeePercent: TRUSTLESS_WORK_FEE_PERCENT,
  };
};
