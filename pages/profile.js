import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      let { data, error } = await supabase
        .from('profiles')
        .select('wallet_address')
        .eq('id', user.id)
        .single();
      
      if (data && data.wallet_address) {
        setWallet(data.wallet_address);
      }
    };
    getUserProfile();
  }, [router]);

  const saveWallet = async () => {
    setLoading(true);
    setMessage('');
    
    const { error } = await supabase
      .from('profiles')
      .update({ wallet_address: wallet })
      .eq('id', user.id);

    if (error) {
      setMessage('❌ Errore durante il salvataggio');
    } else {
      setMessage('✅ Indirizzo salvato correttamente!');
    }
    setLoading(false);
  };

  if (!user) return <div style={{background:'#0f172a', height:'100vh', color:'white', display:'flex', alignItems:'center', justifyContent:'center'}}>Caricamento...</div>;

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1e293b', padding: '40px', borderRadius: '30px', border: '1px solid #334155' }}>
        <Link href="/" style={{ color: '#fbbf24', textDecoration: 'none', fontSize: '14px' }}>← Torna alla Dashboard</Link>
        <h1 style={{ marginTop: '20px', color: '#f8fafc' }}>Impostazioni Profilo</h1>
        <div style={{ marginTop: '40px' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '10px' }}>EMAIL ACCOUNT</label>
          <input type="text" value={user.email} disabled style={{ width: '100%', padding: '15px', borderRadius: '12px', background: '#0f172a', border: '1px solid #334155', color: '#64748b', marginBottom: '30px' }} />
          <label style={{ display: 'block', color: '#fbbf24', fontSize: '12px', marginBottom: '10px' }}>IL TUO INDIRIZZO BITCOIN (BTC)</label>
          <input 
            type="text" 
            placeholder="Incolla qui il tuo indirizzo" 
            value={wallet} 
            onChange={(e) => setWallet(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '12px', background: '#0f172a', border: '1px solid #fbbf24', color: 'white', marginBottom: '10px' }} 
          />
          {message && <p style={{ fontSize: '14px', marginBottom: '20px', color: message.includes('✅') ? '#22c55e' : '#ef4444' }}>{message}</p>}
          <button onClick={saveWallet} disabled={loading} style={{ width: '100%', background: '#fbbf24', color: 'black', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'SALVATAGGIO IN CORSO...' : 'SALVA INDIRIZZO PRELIEVO'}
          </button>
        </div>
      </div>
    </div>
  );
}
