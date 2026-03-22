import { createClient } from '@supabase/supabase-js';
import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('⚠️ Errore Webhook Stripe:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_details.email;
    const amountTotal = session.amount_total / 100; // Es. 100€
    
    // --- 💰 IL TUO GUADAGNO (10% Commissione) ---
    const commission = amountTotal * 0.10; // Ti prendi 10€
    const netAmount = amountTotal - commission; // All'utente restano 90€
    const addedHashrate = netAmount * 5; // Calcolo potenza (modifica il moltiplicatore se serve)

    console.log(`✅ Pagamento di ${amountTotal}€ da ${email}. Tua commissione: ${commission}€`);

    // 1. Trova l'ID dell'utente nel database usando l'email
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('id, hashrate')
      .eq('email', email)
      .single();

    if (userError || !userProfile) {
      console.error(`❌ Utente non trovato per email: ${email}`);
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Registra nella tabella DEPOSITS (con lo user_id corretto!)
    const { error: depositError } = await supabase.from('deposits').insert([{
      user_id: userProfile.id, // Collegamento vitale!
      email: email,
      amount_euro: amountTotal,
      commission_euro: commission,
      amount_netto: netAmount,
      status: 'completed'
    }]);

    if (depositError) console.error("❌ Errore salvataggio deposito:", depositError.message);

    // 3. Aggiorna l'hashrate dell'utente
    const newHashrate = (userProfile.hashrate || 0) + addedHashrate;
    await supabase
      .from('profiles')
      .update({ hashrate: newHashrate })
      .eq('id', userProfile.id);
      
    console.log(`🚀 Hashrate aggiornato per ${email}: +${addedHashrate} TH/s`);
  }

  res.json({ received: true });
}