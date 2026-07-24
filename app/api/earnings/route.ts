import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import * as Sentry from "@sentry/nextjs";
import type { ApiResponse } from "../types";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  cryptoAmount?: number;
  cryptoCurrency?: "ETH" | "SOL" | "USDC";
  platform: "YouTube" | "TikTok" | "Instagram" | "Twitch";
  type: "payout" | "royalty" | "mint" | "referral";
  status: "completed" | "pending" | "failed";
  taxId: string;
};

export type EarningsSummary = {
  total: string;
  completed: string;
  pending: string;
};

export type EarningsReport = {
  transactions: Transaction[];
  summary: EarningsSummary;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

/**
 * Fetch the authenticated user's earnings transactions with pagination.
 *
 * TODO: Replace the stub below with a real database query.
 * Example using Prisma:
 *
 *   const [transactions, total] = await Promise.all([
 *     prisma.transaction.findMany({
 *       where: { userId },
 *       orderBy: { createdAt: "desc" },
 *       skip: (page - 1) * pageSize,
 *       take: pageSize,
 *     }),
 *     prisma.transaction.count({ where: { userId } }),
 *   ]);
 */
async function queryEarningsReport(
  userId: string,
  page: number,
  pageSize: number
): Promise<EarningsReport> {
  // TODO: Replace with real database query (see comment above).
  // Returning empty results until the data layer is wired up.
  void userId; // will be used in the real query
  return {
    transactions: [],
    summary: { total: "0.00", completed: "0.00", pending: "0.00" },
    pagination: { page, pageSize, total: 0, totalPages: 0 },
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10) || 20)
    );

    const userId = session.user.id ?? session.user.email ?? "";
    const data = await queryEarningsReport(userId, page, pageSize);
    const body: ApiResponse<EarningsReport> = { data, error: null };
    return NextResponse.json(body);
  } catch (err: unknown) {
    Sentry.captureException(err);
    const message = err instanceof Error ? err.message : "Internal server error";
    const body: ApiResponse<null> = {
      data: null,
      error: message,
      code: "EARNINGS_INTERNAL_ERROR",
    };
    return NextResponse.json(body, { status: 500 });
  }
}
