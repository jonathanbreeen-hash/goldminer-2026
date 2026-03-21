import React, { useState } from 'react';

export default function GoldminerDashboard() {
  const [hashrate] = useState(12.5);
  const [earned] = useState(0.00045120);
  const [eurValue] = useState(28.45);

  const handleCheckout = () => {
    window.location.href = "https://buy.stripe.com/cNidR9fO36ip0uebVv8Vi07";
  };

  const handleWithdraw = () => {
    alert("Funzione Prelievo: In attesa di collegamento API NiceHash...");
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'sans-serif', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#fbbf24', fontSize: '2rem', marginBottom: '30px' }}>💎 GOLDMINER 2026</h1>
      <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#0f172a', padding: '30px', borderRadius: '20px', border: '1px solid #1e293b' }}>
        <p style={{ color: '#94a3b8' }}>POTENZA ATTIVA</p>
        <h2 style={{ fontSize: '2.5rem' }}>{hashrate} TH/s</h2>
        <hr style={{ border: '0.5px solid #1e293b', margin: '20px 0' }} />
        <p style={{ color: '#94a3b8' }}>GUADAGNO (BTC)</p>
        <h2 style={{ fontSize: '2rem', color: '#10b981' }}>₿ {earned.toFixed(8)}</h2>
        <p>≈ € {eurValue.toFixed(2)}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '30px' }}>
          <button onClick={handleCheckout} style={{ padding: '15px', backgroundColor: '#fbbf24', color: '#020617', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>+ COMPRA</button>
          <button onClick={handleWithdraw} style={{ padding: '15px', backgroundColor: '#1e293b', color: '#f8fafc', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>↑ PRELEVA</button>
        </div>
      </div>
    </div>
  );
}
