import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  Clock,
  Zap,
  MoreVertical,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface BotCardProps {
  bot: BotData;
  onEdit: () => void;
  onRefetch: () => void;
}

const statusConfig: Record<BotStatus, { color: string; label: string }> = {
  active: { color: 'bg-success', label: 'Active' },
  idle: { color: 'bg-muted-foreground', label: 'Idle' },
  paused: { color: 'bg-warning', label: 'Paused' },
  error: { color: 'bg-destructive', label: 'Error' },
  maintenance: { color: 'bg-info', label: 'Maintenance' }
};

const typeIcons: Record<BotType, string> = {
  trading: '📈',
  content: '✍️',
  service: '🎧',
  data: '📊',
  automation: '⚙️'
};

export const BotCard = ({ bot, onEdit, onRefetch }: BotCardProps) => {
  const handleStatusChange = async (newStatus: BotStatus) => {
    const { error } = await supabase
      .from('bots')
      .update({ status: newStatus, last_active_at: new Date().toISOString() })
      .eq('id', bot.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Status Updated', description: `Bot is now ${newStatus}` });
      onRefetch();
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this bot?')) return;
    
    const { error } = await supabase
      .from('bots')
      .delete()
      .eq('id', bot.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Bot Deleted' });
      onRefetch();
    }
  };

  const timeSinceActive = bot.last_active_at 
    ? getTimeSince(new Date(bot.last_active_at))
    : 'Never';

  return (
    <Card className="gradient-border hover:scale-[1.02] transition-transform duration-300">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{typeIcons[bot.type]}</span>
            <div>
              <h3 className="font-bold text-sm">{bot.name}</h3>
              <p className="text-xs text-muted-foreground capitalize">{bot.type} Bot</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusConfig[bot.status].color} animate-pulse`} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Settings className="w-4 h-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Description */}
        {bot.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {bot.description}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-2 rounded bg-muted/50">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              Earnings
            </div>
            <p className="text-sm font-bold text-success">
              €{Number(bot.total_earnings).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-2 rounded bg-muted/50">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              Last Active
            </div>
            <p className="text-sm font-bold">{timeSinceActive}</p>
          </div>
        </div>

        {/* Rental Badge */}
        {bot.is_available_for_rent && (
          <div className="flex items-center justify-between mb-3 p-2 rounded bg-primary/10 border border-primary/30">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium">Available for Rent</span>
            </div>
            <span className="text-sm font-bold text-primary">
              €{bot.rental_price_per_day}/day
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {bot.status === 'active' ? (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => handleStatusChange('paused')}
            >
              <Pause className="w-3 h-3 mr-1" /> Pause
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="flex-1 glow-button"
              onClick={() => handleStatusChange('active')}
            >
              <Play className="w-3 h-3 mr-1" /> Start
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

function getTimeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
