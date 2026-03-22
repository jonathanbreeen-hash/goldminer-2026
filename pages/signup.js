import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("Errore: " + error.message);
    } else {
      alert("Registrazione effettuata! Controlla la tua email per confermare l'account.");
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSignUp} style={{ background: '#1e293b', padding: '40px', borderRadius: '24px', border: '1px solid #334155', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ color: '#fbbf24', marginBottom: '10px' }}>CREA ACCOUNT</h1>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Inizia a minare Bitcoin oggi</p>
        
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required 
          style={{ display: 'block', width: '100%', marginBottom: '15px', padding: '15px', borderRadius: '12px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
        
        <input type="password" placeholder="Password (min. 6 caratteri)" value={password} onChange={(e) => setPassword(e.target.value)} required 
          style={{ display: 'block', width: '100%', marginBottom: '25px', padding: '15px', borderRadius: '12px', border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
        
        <button type="submit" disabled={loading} style={{ width: '100%', background: '#fbbf24', color: 'black', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Creazione...' : 'Registrati'}
        </button>

        <p style={{ marginTop: '20px', color: '#94a3b8' }}> Hai già un account? <Link href="/login" style={{ color: '#fbbf24', textDecoration: 'none' }}>Accedi</Link> </p>
      </form>
    </div>
  );
}
