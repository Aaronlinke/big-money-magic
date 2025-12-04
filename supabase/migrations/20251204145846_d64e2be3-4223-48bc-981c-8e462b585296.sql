-- Create enum for bot status
CREATE TYPE public.bot_status AS ENUM ('active', 'idle', 'paused', 'error', 'maintenance');

-- Create enum for bot type
CREATE TYPE public.bot_type AS ENUM ('trading', 'content', 'service', 'data', 'automation');

-- Create enum for rental status
CREATE TYPE public.rental_status AS ENUM ('active', 'pending', 'expired', 'cancelled');

-- Bots table
CREATE TABLE public.bots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type bot_type NOT NULL,
    status bot_status NOT NULL DEFAULT 'idle',
    is_available_for_rent BOOLEAN NOT NULL DEFAULT false,
    rental_price_per_day DECIMAL(10, 2),
    total_earnings DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    total_tasks_completed INTEGER NOT NULL DEFAULT 0,
    last_active_at TIMESTAMP WITH TIME ZONE,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bot rentals table
CREATE TABLE public.bot_rentals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE NOT NULL,
    renter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status rental_status NOT NULL DEFAULT 'pending',
    price_per_day DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    stripe_payment_id TEXT,
    earnings_generated DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bot activity logs
CREATE TABLE public.bot_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    earnings DECIMAL(10, 2) DEFAULT 0.00,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bots
CREATE POLICY "Users can view all available bots"
ON public.bots FOR SELECT
USING (is_available_for_rent = true OR owner_id = auth.uid());

CREATE POLICY "Users can create their own bots"
ON public.bots FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own bots"
ON public.bots FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own bots"
ON public.bots FOR DELETE
USING (owner_id = auth.uid());

-- RLS Policies for bot_rentals
CREATE POLICY "Users can view rentals they're involved in"
ON public.bot_rentals FOR SELECT
USING (renter_id = auth.uid() OR owner_id = auth.uid());

CREATE POLICY "Users can create rentals"
ON public.bot_rentals FOR INSERT
WITH CHECK (renter_id = auth.uid());

CREATE POLICY "Owners can update their rentals"
ON public.bot_rentals FOR UPDATE
USING (owner_id = auth.uid() OR renter_id = auth.uid());

-- RLS Policies for bot_activity_logs
CREATE POLICY "Users can view logs for their bots"
ON public.bot_activity_logs FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.bots
        WHERE bots.id = bot_activity_logs.bot_id
        AND bots.owner_id = auth.uid()
    )
);

-- Triggers for updated_at
CREATE TRIGGER update_bots_updated_at
BEFORE UPDATE ON public.bots
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bot_rentals_updated_at
BEFORE UPDATE ON public.bot_rentals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for bots
ALTER PUBLICATION supabase_realtime ADD TABLE public.bots;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bot_activity_logs;