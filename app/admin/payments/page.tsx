import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { DollarSign, TrendingUp, CreditCard, Wallet } from "lucide-react";

const PAYMENTS = [
  { id: "p1", user: "Alex Johnson", course: "Web Development Bootcamp", amount: "$49", method: "Credit Card", date: "2026-07-01", status: "Completed" },
  { id: "p2", user: "Maria Garcia", course: "Data Science Fundamentals", amount: "$79", method: "PayPal", date: "2026-06-28", status: "Completed" },
  { id: "p3", user: "James Thompson", course: "UI/UX Design Masterclass", amount: "$29", method: "Credit Card", date: "2026-06-25", status: "Completed" },
  { id: "p4", user: "Priya Sharma", course: "Advanced React Patterns", amount: "$29", method: "Mobile Money", date: "2026-06-20", status: "Refunded" },
  { id: "p5", user: "Kevin Osei", course: "Machine Learning A-Z", amount: "$59", method: "Credit Card", date: "2026-06-18", status: "Completed" },
];

export default function AdminPaymentsPage() {
  const totalRevenue = PAYMENTS.filter((p) => p.status === "Completed").reduce((acc, p) => acc + parseInt(p.amount.replace("$", "")), 0);
  const totalTransactions = PAYMENTS.length;

  return (
    <div className="">
      <PageHeader
        title="Payments"
        description="Payment history and revenue overview"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border-glass bg-surface-dark p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10"><DollarSign className="h-5 w-5 text-green-400" /></div>
            <div><p className="text-2xl font-bold text-white">${totalRevenue}</p><p className="text-xs text-text-secondary">Total Revenue</p></div>
          </div>
        </div>
        <div className="rounded-xl border border-border-glass bg-surface-dark p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10"><CreditCard className="h-5 w-5 text-blue-400" /></div>
            <div><p className="text-2xl font-bold text-white">{totalTransactions}</p><p className="text-xs text-text-secondary">Transactions</p></div>
          </div>
        </div>
        <div className="rounded-xl border border-border-glass bg-surface-dark p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10"><TrendingUp className="h-5 w-5 text-brand-orange" /></div>
            <div><p className="text-2xl font-bold text-white">+22%</p><p className="text-xs text-text-secondary">Monthly Growth</p></div>
          </div>
        </div>
      </div>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-glass text-xs text-text-secondary">
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Course</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Method</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.map((p) => (
                <tr key={p.id} className="border-b border-border-glass last:border-0">
                  <td className="py-3 font-medium text-white">{p.user}</td>
                  <td className="py-3 text-text-secondary">{p.course}</td>
                  <td className="py-3 text-text-secondary">{p.amount}</td>
                  <td className="py-3 text-text-secondary">{p.method}</td>
                  <td className="py-3 text-text-secondary">{p.date}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === "Completed" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                    }`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
