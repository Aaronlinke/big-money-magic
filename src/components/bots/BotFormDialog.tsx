import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type BotType = 'trading' | 'content' | 'service' | 'data' | 'automation';
type BotStatus = 'active' | 'idle' | 'paused' | 'error' | 'maintenance';

interface BotData {
  id: string;
  name: string;
  description: string | null;
  type: BotType;
  status: BotStatus;
  is_available_for_rent: boolean;
  rental_price_per_day: number | null;
  total_earnings: number;
  total_tasks_completed: number;
  last_active_at: string | null;
}

interface BotFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bot: BotData | null;
  onSuccess: () => void;
}

export const BotFormDialog = ({ open, onOpenChange, bot, onSuccess }: BotFormDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<BotType>('trading');
  const [isAvailableForRent, setIsAvailableForRent] = useState(false);
  const [rentalPrice, setRentalPrice] = useState('');

  useEffect(() => {
    if (bot) {
      setName(bot.name);
      setDescription(bot.description || '');
      setType(bot.type);
      setIsAvailableForRent(bot.is_available_for_rent);
      setRentalPrice(bot.rental_price_per_day?.toString() || '');
    } else {
      setName('');
      setDescription('');
      setType('trading');
      setIsAvailableForRent(false);
      setRentalPrice('');
    }
  }, [bot, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const botData = {
        name,
        description: description || null,
        type,
        is_available_for_rent: isAvailableForRent,
        rental_price_per_day: isAvailableForRent && rentalPrice ? parseFloat(rentalPrice) : null,
        owner_id: user?.id || null
      };

      if (bot) {
        // Update existing bot
        const { error } = await supabase
          .from('bots')
          .update(botData)
          .eq('id', bot.id);

        if (error) throw error;
        toast({ title: 'Bot Updated', description: `${name} has been updated successfully.` });
      } else {
        // Create new bot
        const { error } = await supabase
          .from('bots')
          .insert(botData);

        if (error) throw error;
        toast({ title: 'Bot Created', description: `${name} has been created successfully.` });
      }

      onSuccess();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {bot ? '✏️ Edit Bot' : '🤖 Create New Bot'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bot Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Trading Bot Alpha"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this bot do?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Bot Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as BotType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trading">📈 Trading</SelectItem>
                <SelectItem value="content">✍️ Content</SelectItem>
                <SelectItem value="service">🎧 Service</SelectItem>
                <SelectItem value="data">📊 Data</SelectItem>
                <SelectItem value="automation">⚙️ Automation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div>
              <Label>Available for Rent</Label>
              <p className="text-xs text-muted-foreground">
                Let others rent your bot
              </p>
            </div>
            <Switch 
              checked={isAvailableForRent}
              onCheckedChange={setIsAvailableForRent}
            />
          </div>

          {isAvailableForRent && (
            <div className="space-y-2">
              <Label htmlFor="rentalPrice">Rental Price (€/day)</Label>
              <Input
                id="rentalPrice"
                type="number"
                step="0.01"
                min="0"
                value={rentalPrice}
                onChange={(e) => setRentalPrice(e.target.value)}
                placeholder="49.99"
                required={isAvailableForRent}
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 glow-button" disabled={loading}>
              {loading ? 'Saving...' : (bot ? 'Update Bot' : 'Create Bot')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
