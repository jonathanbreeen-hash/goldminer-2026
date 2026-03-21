import React, { useState } from 'react';
import { Zap, TrendingUp, CreditCard, Loader2 } from 'lucide-react';

export default function GoldminerDashboard() {
  const [stats] = useState({ hashrate: "0.0 TH/s", earned: 0.00, btcValue: "0.00000000" });

  const handleCheckout = () => {
    // Link diretto Stripe con prezzo libero
    window.location.href = "https://buy.stripe.com/cNidR9fO36ip0uebVv8Vi07";
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#fbbf24', padding: '20px' }}>💎 GOLDMINER 2026</h1>
      <div style={{ padding: '20px', border: '1px solid #1e293b', borderRadius: '15px', margin: '20px' }}>
        <p>Potenza: {stats.hashrate}</p>
        <p>Guadagno: €{stats.earned}</p>
      </div>
      <button 
        onClick={handleCheckout} 
        style={{ width: '100%', padding: '20px', backgroundColor: '#fbbf24', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
      >
        ATTIVA POTENZA (PREZZO LIBERO)
      </button>
    </div>
  );
}
