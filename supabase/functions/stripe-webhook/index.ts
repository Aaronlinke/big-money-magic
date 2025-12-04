import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY not configured');
      return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } else {
      event = JSON.parse(body);
    }

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(supabase, event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'checkout.session.completed':
        await handleCheckoutComplete(supabase, event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(supabase, event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function handlePaymentSuccess(supabase: any, paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  
  const amount = paymentIntent.amount / 100; // Convert from cents
  const metadata = paymentIntent.metadata;
  const transactionType = metadata?.transaction_type || 'bot_rental';

  // Get the payout rule for this transaction type
  const { data: rule, error: ruleError } = await supabase
    .from('payout_rules')
    .select('*')
    .eq('transaction_type', transactionType)
    .eq('is_active', true)
    .single();

  if (ruleError || !rule) {
    console.error('No active payout rule found for type:', transactionType);
    return;
  }

  // Calculate founder provision
  const founderAmount = (amount * rule.founder_percentage) / 100;
  const systemAmount = (amount * rule.system_percentage) / 100;
  const sellerAmount = amount - founderAmount - systemAmount;

  console.log(`Processing payment: Total €${amount}, Founder €${founderAmount}, System €${systemAmount}`);

  // Get or create founder wallet
  let { data: founderWallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('is_founder_wallet', true)
    .maybeSingle();

  if (!founderWallet) {
    const { data: newWallet, error: createError } = await supabase
      .from('wallets')
      .insert({
        name: 'Founder Wallet',
        is_founder_wallet: true,
        balance: 0
      })
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating founder wallet:', createError);
      return;
    }
    founderWallet = newWallet;
  }

  // Create founder provision transaction
  const { error: txError } = await supabase
    .from('transactions')
    .insert({
      wallet_id: founderWallet.id,
      type: 'founder_provision',
      amount: founderAmount,
      status: 'completed',
      description: `Founder provision from ${transactionType.replace('_', ' ')}`,
      stripe_payment_id: paymentIntent.id,
      metadata: {
        original_amount: amount,
        percentage: rule.founder_percentage,
        transaction_type: transactionType
      }
    });

  if (txError) {
    console.error('Error creating transaction:', txError);
    return;
  }

  // Update founder wallet balance
  const { error: updateError } = await supabase
    .from('wallets')
    .update({ balance: founderWallet.balance + founderAmount })
    .eq('id', founderWallet.id);

  if (updateError) {
    console.error('Error updating wallet balance:', updateError);
    return;
  }

  console.log(`Founder provision of €${founderAmount} added to wallet`);
}

async function handleCheckoutComplete(supabase: any, session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id);
  // Similar logic for checkout sessions
}

async function handleInvoicePaid(supabase: any, invoice: Stripe.Invoice) {
  console.log('Invoice paid:', invoice.id);
  // Handle subscription payments
}
