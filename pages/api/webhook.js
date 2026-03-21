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
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_details.email;
    const amountTotal = session.amount_total / 100;
    const commission = amountTotal * 0.10;
    const netAmount = amountTotal - commission;
    const addedHashrate = netAmount * 5;

    console.log(`Pagamento ricevuto da: ${email}. Commissione: ${commission}€`);

    // Registra nella tabella deposits
    await supabase.from('deposits').insert([{
      email: email,
      amount_euro: amountTotal,
      commission_euro: commission,
      amount_netto: netAmount
    }]);

    // Aggiorna hashrate dell'utente
    const { data: profile } = await supabase.from('profiles').select('hashrate').eq('email', email).single();
    if (profile) {
      await supabase.from('profiles').update({ 
        hashrate: (profile.hashrate || 0) + addedHashrate 
      }).eq('email', email);
    }
  }

  res.json({ received: true });
}
