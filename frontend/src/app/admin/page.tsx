"use client";

import { useState, useEffect, useCallback } from "react";

interface MarketData {
  id?: number;
  marketName: string;
  produceType: string;
  priceMin: number | null;
  priceMax: number | null;
  arrivalVolume: number | null;
  demandScore: number | null;
  transportHours: number | null;
  transportCost: number | null;
  gradeCompatibility: string;
  source: string;
  dateRecorded?: string;
  createdAt?: string;
}

const emptyForm: MarketData = {
  marketName: "", produceType: "", priceMin: null, priceMax: null,
  arrivalVolume: null, demandScore: null, transportHours: null,
  transportCost: null, gradeCompatibility: "A,B,C", source: "Admin Entry"
};

export default function AdminPage() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [form, setForm] = useState<MarketData>({ ...emptyForm });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const apiUrl = "https://ripenly-backend.onrender.com";

  const fetchMarkets = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/markets`);
      if (res.ok) setMarkets(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }, [apiUrl]);

  useEffect(() => { fetchMarkets(); }, [fetchMarkets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${apiUrl}/api/admin/markets/${editingId}` : `${apiUrl}/api/admin/markets`;
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setForm({ ...emptyForm });
        setEditingId(null);
        setShowForm(false);
        fetchMarkets();
      }
    } catch { /* ignore */ }
    setSaving(false);
  };

  const handleEdit = (m: MarketData) => {
    setForm(m);
    setEditingId(m.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this market data entry?")) return;
    await fetch(`${apiUrl}/api/admin/markets/${id}`, { method: "DELETE" });
    fetchMarkets();
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-tight">
            Market Data Manager
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Manage market pricing, demand, and transport data used by the decision engine.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ ...emptyForm }); }}
          className="btn-glow px-5 py-2.5 text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          {showForm ? "Cancel" : "Add Market Data"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass p-6 mb-8 animate-scale-in">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-4">
            {editingId ? "Edit Market Entry" : "New Market Data Entry"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Market Name*", key: "marketName", type: "text", required: true },
              { label: "Produce Type", key: "produceType", type: "text" },
              { label: "Price Min (Tk/kg)", key: "priceMin", type: "number" },
              { label: "Price Max (Tk/kg)", key: "priceMax", type: "number" },
              { label: "Arrival Volume (tons)", key: "arrivalVolume", type: "number" },
              { label: "Demand Score (0-2)", key: "demandScore", type: "number", step: "0.1" },
              { label: "Transport Hours", key: "transportHours", type: "number", step: "0.5" },
              { label: "Transport Cost (Tk)", key: "transportCost", type: "number" },
              { label: "Grade Compat. (A,B,C)", key: "gradeCompatibility", type: "text" },
              { label: "Source", key: "source", type: "text" },
            ].map(({ label, key, type, required, step }) => (
              <div key={key}>
                <label className="block text-xs text-text-secondary mb-1.5 font-medium">{label}</label>
                <input
                  type={type}
                  step={step}
                  required={required}
                  value={(form as any)[key] ?? ""}
                  onChange={e => setForm({ ...form, [key]: type === "number" ? (e.target.value ? Number(e.target.value) : null) : e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-glass-strong border border-border text-text-primary text-sm focus:outline-none focus:border-action focus:ring-1 focus:ring-action/30 transition-all placeholder:text-text-muted"
                  placeholder={label}
                />
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <button type="submit" disabled={saving} className="btn-glow px-6 py-2.5 text-sm">
              {saving ? "Saving..." : editingId ? "Update" : "Save"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-5 py-2.5 text-sm text-text-secondary hover:text-text-primary rounded-xl hover:bg-glass-strong transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <div className="glass p-12 text-center">
          <div className="w-8 h-8 mx-auto rounded-full border-2 border-action border-t-transparent animate-spin mb-3"></div>
          <p className="text-text-secondary text-sm">Loading market data...</p>
        </div>
      ) : markets.length === 0 ? (
        <div className="glass p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-action/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-action" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          </div>
          <h3 className="text-lg font-display font-semibold text-text-primary mb-2">No market data yet</h3>
          <p className="text-text-secondary text-sm mb-4">Add your first market data entry to power the decision engine with real data.</p>
          <p className="text-text-muted text-xs italic">The engine will use built-in defaults until you add market data here.</p>
        </div>
      ) : (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Market", "Produce", "Price Range", "Demand", "Transport", "Grades", "Source", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {markets.map(m => (
                  <tr key={m.id} className="border-b border-border/50 hover:bg-glass-strong transition-colors">
                    <td className="px-4 py-3 font-medium text-text-primary">{m.marketName}</td>
                    <td className="px-4 py-3 text-text-secondary">{m.produceType || "—"}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {m.priceMin != null && m.priceMax != null ? `Tk ${m.priceMin}–${m.priceMax}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-semibold ${
                        (m.demandScore || 0) >= 1.0 ? "bg-fresh/15 text-fresh" : 
                        (m.demandScore || 0) >= 0.6 ? "bg-caution/15 text-caution" : "bg-text-muted/15 text-text-muted"
                      }`}>
                        {m.demandScore?.toFixed(1) || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {m.transportHours != null ? `${m.transportHours}h / Tk ${m.transportCost}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {(m.gradeCompatibility || "").split(",").map(g => (
                          <span key={g} className={`inline-flex w-6 h-6 rounded-lg text-[10px] font-bold items-center justify-center ${
                            g.trim() === "A" ? "bg-fresh/15 text-fresh" : 
                            g.trim() === "B" ? "bg-caution/15 text-caution" : "bg-urgent/15 text-urgent"
                          }`}>{g.trim()}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-muted text-xs">{m.source || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(m)} className="text-action hover:text-action-deep transition-colors p-1.5 rounded-lg hover:bg-action/10">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(m.id!)} className="text-urgent/60 hover:text-urgent transition-colors p-1.5 rounded-lg hover:bg-urgent/10">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="mt-6 glass p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-action/10 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-action" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <p className="text-sm text-text-primary font-medium">How this works</p>
          <p className="text-xs text-text-secondary mt-1">
            Market data you enter here is used directly by Ripenly&apos;s decision engine to calculate Expected Realized Value (ERV) 
            and route produce. If no data is entered, the engine uses built-in defaults. Data can come from DAM reports, 
            field agents, or government sources.
          </p>
        </div>
      </div>
    </div>
  );
}
