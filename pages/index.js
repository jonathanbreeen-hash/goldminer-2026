import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ balance: 0, hashrate: 380, wallet_address: '', last_update: null });
  const [realTransactions, setRealTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const router = useRouter();

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    setUser(user);

    let { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    
    if (prof) {
      // CALCOLO MINING OFF-LINE
      const ora = new Date().getTime();
      const ultimoUpdate = prof.last_update ? new Date(prof.last_update).getTime() : ora;
      const secondiPassati = Math.floor((ora - ultimoUpdate) / 1000);
      
      // Guadagno: 0.0000000001 BTC al secondo per ogni TH/s (esempio)
      const guadagnoMancante = secondiPassati * 0.0000000001 * (prof.hashrate / 100);
      const nuovoSaldo = parseFloat(prof.balance || 0) + guadagnoMancante;

      setProfile({ ...prof, balance: nuovoSaldo.toFixed(10) });

      // Aggiorna il database con il tempo attuale così non si perde il mining
      await supabase.from('profiles').update({ 
        balance: nuovoSaldo.toFixed(10), 
        last_update: new Date().toISOString() 
      }).eq('id', user.id);
    }

    let { data: trans } = await supabase.from('withdrawals').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (trans) setRealTransactions(trans);
    setLoading(false);
  };

  useEffect(() => { fetchUserData(); }, [router]);

  // Effetto visivo del contatore che sale
  useEffect(() => {
    const timer = setInterval(() => {
      setProfile(prev => ({ ...prev, balance: (parseFloat(prev.balance) + 0.0000000001).toFixed(10) }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const confirmWithdraw = async () => {
    if (!profile.wallet_address) { alert("⚠️ Imposta il wallet nelle Impostazioni!"); return; }
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > parseFloat(profile.balance)) { alert("Errore saldo"); return; }

    const { error } = await supabase.from('withdrawals').insert([{ 
      user_id: user.id, email: user.email, amount: amount, wallet_address: profile.wallet_address, status: 'In attesa' 
    }]);

    if (!error) {
      const newBal = (parseFloat(profile.balance) - amount).toFixed(10);
      await supabase.from('profiles').update({ balance: newBal, last_update: new Date().toISOString() }).eq('id', user.id);
      alert("✅ Richiesta inviata!");
      setShowModal(false);
      fetchUserData();
    }
  };

  if (loading) return <div style={{background:'#0f172a', height:'100vh', color:'white', display:'flex', alignItems:'center', justifyContent:'center'}}>Recupero Mining...</div>;

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      <Head><title>Dashboard | GoldMiner</title></Head>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#fbbf24', fontSize: '22px' }}>GOLDMINER CLOUD</h1>
          <Link href="/profile" style={{ background: '#334155', color: 'white', textDecoration: 'none', padding: '10px 15px', borderRadius: '10px', fontSize: '12px' }}>IMPOSTAZIONI</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: '#1e293b', padding: '25px', borderRadius: '20px', border: '1px solid #334155' }}>
            <p style={{ color: '#94a3b8', fontSize: '11px' }}>POTENZA ATTUALE</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{profile.hashrate} TH/s</p>
          </div>
          <div style={{ background: '#1e293b', padding: '25px', borderRadius: '20px', border: '1px solid #fbbf24' }}>
            <p style={{ color: '#94a3b8', fontSize: '11px' }}>SALDO DISPONIBILE</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#fbbf24' }}>{profile.balance} BTC</p>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(90deg, #635bff 0%, #4338ca 100%)', padding: '20px', borderRadius: '20px', textAlign: 'center', marginBottom: '30px' }}>
           <a href="https://buy.stripe.com/cNidR9fO36ip0uebVv8Vi07" target="_blank" rel="noreferrer" style={{ background: 'white', color: '#635bff', padding: '12px 30px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', display:'inline-block' }}>💳 EFFETTUA VERSAMENTO</a>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button onClick={() => setShowModal(true)} style={{ background: 'transparent', color: '#fbbf24', border: '2px solid #fbbf24', padding: '12px 30px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold' }}>🚀 RICHIEDI PRELIEVO BTC</button>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '20px', padding: '25px', border: '1px solid #334155' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px', color: '#94a3b8' }}>Storico Prelievi Reali</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{textAlign:'left', color:'#64748b', fontSize:'11px'}}>
                <td style={{padding:'10px'}}>DATA</td>
                <td style={{padding:'10px'}}>IMPORTO</td>
                <td style={{padding:'10px'}}>STATO</td>
              </tr>
            </thead>
            <tbody>
              {realTransactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '15px 10px', fontSize: '12px' }}>{new Date(t.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '15px 10px', fontSize: '12px' }}>{t.amount} BTC</td>
                  <td style={{ padding: '15px 10px', fontSize: '12px', color: t.status === 'Completato' || t.status === 'Pagato' ? '#22c55e' : '#fbbf24' }}>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#1e293b', padding: '30px', borderRadius: '24px', width: '300px' }}>
              <h3>Prelievo</h3>
              <input type="number" value={withdrawAmount} onChange={(e)=>setWithdrawAmount(e.target.value)} style={{width:'100%', padding:'10px', marginTop:'10px'}} placeholder="0.0000" />
              <button onClick={confirmWithdraw} style={{width:'100%', background:'#fbbf24', padding:'12px', border:'none', fontWeight:'bold', marginTop:'20px', cursor:'pointer'}}>CONFERMA</button>
              <button onClick={()=>setShowModal(false)} style={{width:'100%', background:'transparent', color:'white', border:'none', marginTop:'10px', cursor:'pointer'}}>Chiudi</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
