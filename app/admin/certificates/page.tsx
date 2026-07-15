"use client";

import { useEffect, useState } from "react";
import { getAdminCertificates, revokeCertificate, type AdminCertificate } from "@/lib/data/admin";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Award, ShieldOff } from "lucide-react";

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<AdminCertificate[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokeOpen, setRevokeOpen] = useState(false);

  const fetchCerts = () => {
    setLoading(true);
    getAdminCertificates()
      .then((res) => {
        setCerts(res.certificates);
        setTotal(res.total);
      })
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleRevoke = async () => {
    if (!revokingId) return;
    try {
      await revokeCertificate(revokingId);
      setRevokeOpen(false);
      setRevokingId(null);
      fetchCerts();
    } catch {
      setRevokeOpen(false);
    }
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">Certificates</h1>
        <p className="mt-1 text-sm text-brand-text-mid">{total} certificates issued</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Issued", value: String(total), icon: Award },
          { label: "Active", value: String(certs.filter((c) => c.status === "ISSUED").length), icon: Award },
          { label: "Revoked", value: String(certs.filter((c) => c.status === "REVOKED").length), icon: ShieldOff },
        ].map((card) => (
          <div key={card.label} className="flex items-center gap-4 rounded-xl bg-brand-card p-5 ring-1 ring-brand-border">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text">{card.value}</p>
              <p className="text-xs text-brand-text-light">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-brand-text-mid">Loading certificates...</p>
        </div>
      )}

      {!loading && certs.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-brand-text-light">No certificates found.</p>
        </div>
      )}

      {!loading && certs.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-brand-border bg-brand-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-border text-xs text-brand-text-light">
                <th className="px-5 pb-3 pt-4 font-medium">Certificate #</th>
                <th className="px-5 pb-3 pt-4 font-medium">Student</th>
                <th className="px-5 pb-3 pt-4 font-medium">Course</th>
                <th className="px-5 pb-3 pt-4 font-medium">Issued</th>
                <th className="px-5 pb-3 pt-4 font-medium">Status</th>
                <th className="px-5 pb-3 pt-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-brand-border transition-colors hover:bg-brand-bg last:border-0"
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-brand-text">{c.certificateNumber}</td>
                  <td className="px-5 py-3.5 text-brand-text">{c.student?.fullName ?? "—"}</td>
                  <td className="px-5 py-3.5 text-brand-text-mid">{c.course?.title ?? "—"}</td>
                  <td className="px-5 py-3.5 text-brand-text-mid">{new Date(c.issueDate).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      c.status === "ISSUED" ? "bg-brand-green/10 text-brand-green" : "bg-accent-red/10 text-accent-red"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {c.status === "ISSUED" && (
                      <button
                        onClick={() => { setRevokingId(c.id); setRevokeOpen(true) }}
                        disabled={revokingId === c.id}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-accent-red transition-colors hover:bg-accent-red/10 disabled:opacity-50"
                      >
                        <ShieldOff className="h-3.5 w-3.5" />
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={revokeOpen}
        onOpenChange={setRevokeOpen}
        title="Revoke Certificate"
        description="Are you sure you want to revoke this certificate? This cannot be undone."
        confirmLabel="Revoke"
        variant="destructive"
        loading={revokingId !== null}
        onConfirm={handleRevoke}
      />
    </div>
  );
}
