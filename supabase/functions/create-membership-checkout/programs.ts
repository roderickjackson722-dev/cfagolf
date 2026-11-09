export const PROGRAMS: Record<string, { priceId: string; amount: number; name: string; mode: "payment" | "subscription" }> = {
  consulting: {
    priceId: "price_1TAf5QLXW44Q7xfEt31BZ91E",
    amount: 349900,
    name: "CFA Golf 1-on-1 Consulting Program",
    mode: "payment",
  },
  digital: {
    priceId: "price_1TK1IyLXW44Q7xfEFeqlEVdj",
    amount: 29900,
    name: "CFA Golf Self-Paced Online Course",
    mode: "payment",
  },
};