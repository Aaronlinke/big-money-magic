import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  Plus, 
  ArrowLeft,
  Activity,
  TrendingUp,
  Zap,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { BotCard } from "@/components/bots/BotCard";
import { BotFormDialog } from "@/components/bots/BotFormDialog";
import { BotActivityFeed } from "@/components/bots/BotActivityFeed";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  created_at: string;
}

// Demo bots for display when not authenticated
const demoBots: BotData[] = [
  {
    id: '1',
    name: 'Trading Bot Alpha',
    description: 'Automated crypto trading with ML predictions',
    type: 'trading',
    status: 'active',
    is_available_for_rent: true,
    rental_price_per_day: 49.99,
    total_earnings: 12450.00,
    total_tasks_completed: 1567,
    last_active_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Content Generator X',
    description: 'AI-powered article and social media content creation',
    type: 'content',
    status: 'active',
    is_available_for_rent: true,
    rental_price_per_day: 29.99,
    total_earnings: 8920.00,
    total_tasks_completed: 892,
    last_active_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Data Scraper Pro',
    description: 'High-performance data collection and processing',
    type: 'data',
    status: 'idle',
    is_available_for_rent: false,
    rental_price_per_day: null,
    total_earnings: 5670.00,
    total_tasks_completed: 456,
    last_active_at: new Date(Date.now() - 3600000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Service Bot Delta',
    description: 'Customer service automation and support tickets',
    type: 'service',
    status: 'paused',
    is_available_for_rent: true,
    rental_price_per_day: 39.99,
    total_earnings: 3240.00,
    total_tasks_completed: 234,
    last_active_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date().toISOString()
  }
];

const Bots = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState<BotData | null>(null);
  const [filterType, setFilterType] = useState<BotType | 'all'>('all');

  const { data: bots, isLoading, refetch } = useQuery({
    queryKey: ['bots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BotData[];
    }
  });

  // Use demo bots if no real bots exist
  const displayBots = bots && bots.length > 0 ? bots : demoBots;

  const filteredBots = filterType === 'all' 
    ? displayBots 
    : displayBots.filter(bot => bot.type === filterType);

  const stats = {
    totalBots: displayBots.length,
    activeBots: displayBots.filter(b => b.status === 'active').length,
    totalEarnings: displayBots.reduce((sum, b) => sum + Number(b.total_earnings), 0),
    availableForRent: displayBots.filter(b => b.is_available_for_rent).length
  };

  const handleEdit = (bot: BotData) => {
    setSelectedBot(bot);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedBot(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedBot(null);
    refetch();
  };

  return (
    <div className="min-h-screen bg-background command-grid">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold glow-text text-primary">
                🤖 Bot Management
              </h1>
            </div>
            <Button onClick={handleCreate} className="glow-button">
              <Plus className="w-4 h-4 mr-2" />
              Create Bot
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Bots" 
            value={stats.totalBots} 
            icon={<Bot className="w-5 h-5" />}
            color="primary"
          />
          <StatCard 
            title="Active Now" 
            value={stats.activeBots} 
            icon={<Activity className="w-5 h-5" />}
            color="success"
          />
          <StatCard 
            title="Total Earnings" 
            value={`€${stats.totalEarnings.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`} 
            icon={<TrendingUp className="w-5 h-5" />}
            color="accent"
          />
          <StatCard 
            title="For Rent" 
            value={stats.availableForRent} 
            icon={<Zap className="w-5 h-5" />}
            color="info"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(['all', 'trading', 'content', 'service', 'data', 'automation'] as const).map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(type)}
              className="capitalize"
            >
              {type === 'all' ? 'All Bots' : type}
            </Button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bot Grid */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading bots...
              </div>
            ) : filteredBots.length === 0 ? (
              <Card className="gradient-border">
                <CardContent className="py-12 text-center">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No bots found</p>
                  <Button onClick={handleCreate}>Create Your First Bot</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBots.map((bot) => (
                  <BotCard 
                    key={bot.id} 
                    bot={bot} 
                    onEdit={() => handleEdit(bot)}
                    onRefetch={refetch}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <BotActivityFeed />
          </div>
        </div>
      </main>

      <BotFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        bot={selectedBot}
        onSuccess={handleFormClose}
      />
    </div>
  );
};

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  color: string;
}) => (
  <Card className="gradient-border">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${color}/10 text-${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default Bots;
