import React, { useState } from 'react';
import { Zap, TrendingUp, CreditCard, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

export default function GoldminerDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats] = useState({
    hashrate: "0.0 TH/s",
    earned: 0.00,
    invested: 0.00,
    btcValue: "0.00000000"
  });

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', { method: 'POST' });
      const session = await response.json();
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (err) {
      console.error("Errore Stripe:", err);
      alert("Errore nel collegamento a Stripe. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fbbf24' }}>💎 GOLDMINER 2026</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Account Reale Attivo</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Wallet Balance</div>
          <div style={{ fontWeight: 'bold', color: '#10b981' }}>{stats.btcValue} BTC</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Zap size={20} color="#fbbf24" />
            <span style={{ color: '#94a3b8' }}>Potenza Attiva</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.hashrate}</div>
          <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '5px' }}>● Nessun miner attivo</div>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <TrendingUp size={20} color="#10b981" />
            <span style={{ color: '#94a3b8' }}>Guadagno Reale</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>€{stats.earned.toFixed(2)}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px' }}>In attesa di deposito</div>
        </div>
      </div>

      <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '24px', border: '1px solid #fbbf24', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <span style={{ fontWeight: 'bold' }}>Progresso ROI</span>
          <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>0.0%</span>
        </div>
        <div style={{ width: '100%', height: '15px', backgroundColor: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: `0%`, height: '100%', backgroundColor: '#fbbf24' }}></div>
        </div>
      </div>

      <button 
        onClick={handleCheckout}
        disabled={loading}
        style={{ 
          width: '100%', backgroundColor: '#fbbf24', color: '#000', padding: '20px', 
          borderRadius: '15px', fontSize: '18px', fontWeight: 'bold', border: 'none', 
          cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
        }}>
        {loading ? <Loader2 className="animate-spin" /> : <CreditCard size={24} />}
        {loading ? "COLLEGAMENTO A STRIPE..." : "ATTIVA POTENZA (100€ REALI)"}
      </button>
    </div>
  );
}
