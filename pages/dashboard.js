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
      <div className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-yellow-500 italic">GOLDMINER PRO 2026</h1>
        <div className="flex gap-4">
          <button className="bg-slate-700 px-4 py-2 rounded text-xs uppercase font-bold">Impostazioni</button>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-xs uppercase font-bold transition shadow-lg shadow-red-900/20"
          >
            ESCI (LOGOUT)
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700 shadow-xl text-center">
          <p className="text-slate-400 text-xs uppercase mb-4 tracking-widest">Potenza Totale</p>
          <h2 className="text-5xl font-bold text-white">8030 <span className="text-2xl text-slate-500">TH/s</span></h2>
        </div>
        <div className="bg-[#1e293b] p-8 rounded-2xl border border-yellow-500/20 shadow-xl text-center">
          <p className="text-slate-400 text-xs uppercase mb-4 tracking-widest">Saldo BTC</p>
          <h2 className="text-5xl font-bold text-yellow-500">0.0002874122</h2>
        </div>
      </div>
      <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 rounded-2xl text-xl font-bold uppercase transition">
        💳 Effettua Versamento
      </button> 
    </div>
  );
}     
