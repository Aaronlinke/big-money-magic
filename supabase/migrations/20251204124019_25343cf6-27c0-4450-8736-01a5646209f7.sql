-- Create enum for transaction types
CREATE TYPE public.transaction_type AS ENUM ('bot_rental', 'plugin_sale', 'membership', 'license', 'payout', 'founder_provision', 'system_fee');

-- Create enum for transaction status
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');

-- Create enum for payout status
CREATE TYPE public.payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Create enum for payout frequency
CREATE TYPE public.payout_frequency AS ENUM ('daily', 'weekly', 'monthly', 'manual');

-- Wallets table - stores all wallet balances
CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    balance DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'EUR',
    is_founder_wallet BOOLEAN NOT NULL DEFAULT false,
    is_system_wallet BOOLEAN NOT NULL DEFAULT false,
    stripe_account_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Transactions table - logs all money movements
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL,
    type transaction_type NOT NULL,
    amount DECIMAL(20, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    status transaction_status NOT NULL DEFAULT 'pending',
    description TEXT,
    metadata JSONB DEFAULT '{}',
    stripe_payment_id TEXT,
    related_transaction_id UUID REFERENCES public.transactions(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payout rules table - Law Engine rules for distribution
CREATE TABLE public.payout_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    transaction_type transaction_type NOT NULL,
    founder_percentage DECIMAL(5, 2) NOT NULL DEFAULT 30.00,
    system_percentage DECIMAL(5, 2) NOT NULL DEFAULT 5.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_immutable BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payouts table - history of all payouts
CREATE TABLE public.payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(20, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    status payout_status NOT NULL DEFAULT 'pending',
    stripe_payout_id TEXT,
    stripe_transfer_id TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    processed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payout settings table - user preferences for automatic payouts
CREATE TABLE public.payout_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL UNIQUE,
    frequency payout_frequency NOT NULL DEFAULT 'weekly',
    minimum_amount DECIMAL(20, 2) NOT NULL DEFAULT 50.00,
    auto_payout_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wallets
CREATE POLICY "Users can view their own wallets"
ON public.wallets FOR SELECT
USING (auth.uid() = user_id OR is_system_wallet = true);

CREATE POLICY "Users can update their own wallets"
ON public.wallets FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view transactions for their wallets"
ON public.transactions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.wallets
        WHERE wallets.id = transactions.wallet_id
        AND (wallets.user_id = auth.uid() OR wallets.is_system_wallet = true)
    )
);

-- RLS Policies for payout_rules (everyone can read, only system can modify)
CREATE POLICY "Anyone can view payout rules"
ON public.payout_rules FOR SELECT
USING (true);

-- RLS Policies for payouts
CREATE POLICY "Users can view their own payouts"
ON public.payouts FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.wallets
        WHERE wallets.id = payouts.wallet_id
        AND wallets.user_id = auth.uid()
    )
);

-- RLS Policies for payout_settings
CREATE POLICY "Users can view their own payout settings"
ON public.payout_settings FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.wallets
        WHERE wallets.id = payout_settings.wallet_id
        AND wallets.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update their own payout settings"
ON public.payout_settings FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.wallets
        WHERE wallets.id = payout_settings.wallet_id
        AND wallets.user_id = auth.uid()
    )
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_wallets_updated_at
BEFORE UPDATE ON public.wallets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payout_rules_updated_at
BEFORE UPDATE ON public.payout_rules
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payout_settings_updated_at
BEFORE UPDATE ON public.payout_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default payout rules (Law Engine - immutable founder provision)
INSERT INTO public.payout_rules (name, description, transaction_type, founder_percentage, system_percentage, is_active, is_immutable)
VALUES 
    ('Bot Rental Provision', 'Automatische Founder-Provision für Bot-Vermietungen', 'bot_rental', 30.00, 5.00, true, true),
    ('Plugin Sale Provision', 'Automatische Founder-Provision für Plugin-Verkäufe', 'plugin_sale', 25.00, 5.00, true, true),
    ('Membership Provision', 'Automatische Founder-Provision für Memberships', 'membership', 20.00, 5.00, true, true),
    ('License Provision', 'Automatische Founder-Provision für White-Label Lizenzen', 'license', 35.00, 5.00, true, true);