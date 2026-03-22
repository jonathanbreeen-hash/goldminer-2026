import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Errore: " + error.message);
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleLogin} style={{ background: '#1e293b', padding: '40px', borderRadius: '24px', border: '1px solid #334155', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ color: '#fbbf24', marginBottom: '30px' }}>GOLDMINER LOGIN</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required 
          style={{ display: 'block', width: '100%', marginBottom: '15px', padding: '15px', borderRadius: '12px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required 
          style={{ display: 'block', width: '100%', marginBottom: '25px', padding: '15px', borderRadius: '12px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
        <button type="submit" disabled={loading} style={{ width: '100%', background: '#fbbf24', color: 'black', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Accesso...' : 'Entra nel Mine'}
        </button>
        <p style={{ marginTop: '20px', color: '#94a3b8' }}> Non hai un account? <Link href="/signup" style={{ color: '#fbbf24', textDecoration: 'none' }}>Registrati</Link> </p>
      </form>
    </div>
  );
}
