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
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_details.email;
    const amountTotal = session.amount_total / 100;
    
    // 💰 TUA COMMISSIONE 10%
    const commission = amountTotal * 0.10;
    const netAmount = amountTotal - commission;
    const addedHashrate = netAmount * 5;

    // Recupero ID Utente
    const { data: user } = await supabase.from('profiles').select('id, hashrate').eq('email', email).single();

    if (user) {
      // Inserimento Deposito con tua commissione
      await supabase.from('deposits').insert([{
        user_id: user.id,
        email: email,
        amount_euro: amountTotal,
        commission_euro: commission,
        amount_netto: netAmount,
        status: 'completed'
      }]);

      // Aggiornamento Hashrate
      await supabase.from('profiles').update({ 
        hashrate: (user.hashrate || 0) + addedHashrate 
      }).eq('id', user.id);
    }
  }
  res.json({ received: true });
}
