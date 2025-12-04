import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    
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

    console.log('Processing automatic payouts...');

    // Get all wallets with auto-payout enabled
    const { data: settings, error: settingsError } = await supabase
      .from('payout_settings')
      .select(`
        *,
        wallet:wallets(*)
      `)
      .eq('auto_payout_enabled', true);

    if (settingsError) {
      console.error('Error fetching payout settings:', settingsError);
      throw settingsError;
    }

    const processedPayouts = [];

    for (const setting of settings || []) {
      const wallet = setting.wallet;
      
      if (!wallet || wallet.balance < setting.minimum_amount) {
        console.log(`Wallet ${wallet?.id} balance (${wallet?.balance}) below minimum (${setting.minimum_amount})`);
        continue;
      }

      // Check if Stripe account is connected
      if (!wallet.stripe_account_id) {
        console.log(`Wallet ${wallet.id} has no Stripe account connected`);
        continue;
      }

      try {
        // Create Stripe transfer
        const transfer = await stripe.transfers.create({
          amount: Math.floor(wallet.balance * 100), // Convert to cents
          currency: wallet.currency.toLowerCase(),
          destination: wallet.stripe_account_id,
          description: `Black Sultan OS - Automatic Payout`
        });

        console.log(`Created transfer ${transfer.id} for €${wallet.balance}`);

        // Create payout record
        const { data: payout, error: payoutError } = await supabase
          .from('payouts')
          .insert({
            wallet_id: wallet.id,
            amount: wallet.balance,
            currency: wallet.currency,
            status: 'processing',
            stripe_transfer_id: transfer.id,
            scheduled_at: new Date().toISOString()
          })
          .select()
          .single();

        if (payoutError) {
          console.error('Error creating payout record:', payoutError);
          continue;
        }

        // Create transaction record
        await supabase
          .from('transactions')
          .insert({
            wallet_id: wallet.id,
            type: 'payout',
            amount: -wallet.balance, // Negative for outgoing
            status: 'completed',
            description: 'Automatic payout to bank account',
            metadata: {
              payout_id: payout.id,
              stripe_transfer_id: transfer.id
            }
          });

        // Reset wallet balance
        await supabase
          .from('wallets')
          .update({ balance: 0 })
          .eq('id', wallet.id);

        processedPayouts.push({
          wallet_id: wallet.id,
          amount: wallet.balance,
          transfer_id: transfer.id
        });

      } catch (stripeError: unknown) {
        console.error(`Stripe error for wallet ${wallet.id}:`, stripeError);
        const errorMessage = stripeError instanceof Error ? stripeError.message : 'Unknown error';
        
        // Record failed payout
        await supabase
          .from('payouts')
          .insert({
            wallet_id: wallet.id,
            amount: wallet.balance,
            currency: wallet.currency,
            status: 'failed',
            failure_reason: errorMessage
          });
      }
    }

    console.log(`Processed ${processedPayouts.length} payouts`);

    return new Response(JSON.stringify({
      success: true,
      processed: processedPayouts.length,
      payouts: processedPayouts
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('Payout processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
