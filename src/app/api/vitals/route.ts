import { NextRequest } from "next/server";

const RATINGS: Record<string, string> = {
  good: "✓",
  "needs-improvement": "~",
  poor: "✗",
};

export async function POST(request: NextRequest) {
  const metric = await request.json();
  const rating = RATINGS[metric.rating] ?? "?";
  console.log(
    `[vitals] ${rating} ${metric.name.padEnd(4)} ${Math.round(metric.value)}ms  (${metric.rating})`
  );
  return new Response(null, { status: 204 });
}
