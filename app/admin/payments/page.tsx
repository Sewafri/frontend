import { PageHeader } from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import { DollarSign, CreditCard, TrendingUp } from "lucide-react";

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
    <div>
      <PageHeader
        title="Payments"
        description="Payment history and revenue overview"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl bg-surface-card p-5 shadow-sm ring-1 ring-border-default">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-green/10 text-accent-green"><DollarSign className="h-5 w-5" /></div>
          <div><p className="text-2xl font-bold text-text-primary">${totalRevenue}</p><p className="text-xs text-text-tertiary">Total Revenue</p></div>
        </div>
        <div className="flex items-center gap-4 rounded-xl bg-surface-card p-5 shadow-sm ring-1 ring-border-default">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue"><CreditCard className="h-5 w-5" /></div>
          <div><p className="text-2xl font-bold text-text-primary">{totalTransactions}</p><p className="text-xs text-text-tertiary">Transactions</p></div>
        </div>
        <div className="flex items-center gap-4 rounded-xl bg-surface-card p-5 shadow-sm ring-1 ring-border-default">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500"><TrendingUp className="h-5 w-5" /></div>
          <div><p className="text-2xl font-bold text-text-primary">+22%</p><p className="text-xs text-text-tertiary">Monthly Growth</p></div>
        </div>
      </div>

      <GlassCard className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default text-xs text-text-tertiary">
                <th className="px-6 pb-3 pt-4 font-medium">User</th>
                <th className="px-6 pb-3 pt-4 font-medium">Course</th>
                <th className="px-6 pb-3 pt-4 font-medium">Amount</th>
                <th className="px-6 pb-3 pt-4 font-medium">Method</th>
                <th className="px-6 pb-3 pt-4 font-medium">Date</th>
                <th className="px-6 pb-3 pt-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.map((p) => (
                <tr key={p.id} className="border-b border-border-default transition-colors hover:bg-surface-card-hover last:border-0">
                  <td className="px-6 py-3.5 font-medium text-text-primary">{p.user}</td>
                  <td className="px-6 py-3.5 text-text-secondary">{p.course}</td>
                  <td className="px-6 py-3.5 text-text-secondary">{p.amount}</td>
                  <td className="px-6 py-3.5 text-text-secondary">{p.method}</td>
                  <td className="px-6 py-3.5 text-text-secondary">{p.date}</td>
                  <td className="px-6 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.status === "Completed" ? "bg-accent-green/10 text-accent-green" : "bg-accent-red/10 text-accent-red"
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
