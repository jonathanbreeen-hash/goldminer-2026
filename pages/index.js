import React, { useState } from 'react';
import { Zap, TrendingUp, CreditCard, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function GoldminerDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats] = useState({ hashrate: "0.0 TH/s", earned: 0.00, btcValue: "0.00000000" });

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', { method: 'POST' });
      const { id } = await response.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (err) {
      alert("Errore di connessione. Controlla le chiavi su Vercel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ color: '#fbbf24' }}>💎 GOLDMINER 2026</h1>
      <div style={{ padding: '20px', border: '1px solid #1e293b', borderRadius: '15px', margin: '20px 0' }}>
        <p>Potenza: {stats.hashrate}</p>
        <p>Guadagno: €{stats.earned}</p>
      </div>
      <button onClick={handleCheckout} disabled={loading} style={{ width: '100%', padding: '20px', backgroundColor: '#fbbf24', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
        {loading ? "CARICAMENTO STRIPE..." : "ATTIVA POTENZA (100€ REALI)"}
      </button>
    </div>
  );
}
