import React, { useState, useEffect } from 'react';

export default function GoldminerDashboard() {
  const [hashrate, setHashrate] = useState(12.5);
  const [earned, setEarned] = useState(0.00045120);
  const [eurValue, setEurValue] = useState(28.45);

  const handleCheckout = () => {
    window.location.href = "https://buy.stripe.com/cNidR9fO36ip0uebVv8Vi07";
  };

  const handleWithdraw = () => {
    alert("Funzione Prelievo: Inserisci il tuo indirizzo BTC (Configurazione API in corso...)");
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'sans-serif', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#fbbf24', fontSize: '2rem' }}>💎 GOLDMINER 2026</h1>
        <p style={{ color: '#64748b' }}>Mining di Nuova Generazione</p>
      </header>
      
      <main style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b', textAlign: 'center' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Potenza di Calcolo</span>
            <h2 style={{ fontSize: '2.5rem', margin: '10px 0' }}>{hashrate} <span style={{ color: '#fbbf24' }}>TH/s</span></h2>
          </div>
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Saldo Disponibile</span>
            <h2 style={{ fontSize: '2.2rem', margin: '10px 0', color: '#10b981' }}>₿ {earned.toFixed(8)}</h2>
            <p style={{ fontSize: '1.2rem', color: '#64748b' }}>≈ € {eurValue.toFixed(2)}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <button onClick={handleCheckout} style={{ padding: '15px', backgroundColor: '#fbbf24', color: '#020617', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
            + COMPRA POTENZA
          </button>
          <button onClick={handleWithdraw} style={{ padding: '15px', backgroundColor: '#1e293b', color: '#f8fafc', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
            ↑ PRELEVA BTC
          </button>
        </div>

        <div style={{ padding: '15px', borderRadius: '12px', backgroundColor: '#1e293b33', border: '1px dashed #475569', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Stato Connessione: <span style={{ color: '#fbbf24' }}>In attesa di NiceHash API...</span>
          </p>
        </div>
      </main>
    </div>
  );
}
