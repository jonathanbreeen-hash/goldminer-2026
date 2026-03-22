import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold text-yellow-500">GOLDMINER CLOUD</h1>
        <div className="flex gap-4">
          <button className="bg-slate-700 px-4 py-2 rounded text-xs uppercase tracking-widest">Impostazioni</button>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-xs uppercase font-bold transition border border-white/20"
          >
            ESCI (LOGOUT)
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-xs uppercase mb-4">Potenza Attuale</p>
          <h2 className="text-5xl font-bold text-white">8030 TH/s</h2>
        </div>
        <div className="bg-[#1e293b] p-8 rounded-2xl border border-yellow-500/30">
          <p className="text-slate-400 text-xs uppercase mb-4">Saldo Disponibile</p>
          <h2 className="text-5xl font-bold text-yellow-500">0.0002823981 BTC</h2>
        </div>
      </div>
      <button className="w-full bg-indigo-600 py-6 rounded-2xl text-xl font-bold uppercase mb-8">
        💳 EFFETTUA VERSAMENTO
      </button>
      <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700">
        <h3 className="text-slate-400 mb-6">Storico Prelievi Reali</h3>
        <p className="text-xs text-slate-500 italic">Aggiornato in tempo reale</p>
      </div>
    </div>
  );
}
