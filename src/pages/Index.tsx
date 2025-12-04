import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Wallet, Bot, Shield, TrendingUp, AlertTriangle, Banknote } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background command-grid">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold glow-text text-primary">
              ⚡ BLACK SULTAN OS
            </h1>
            <div className="flex items-center gap-4">
              <Link to="/bots">
                <Button variant="outline" className="glow-button">
                  <Bot className="w-4 h-4 mr-2" />
                  Bots
                </Button>
              </Link>
              <Link to="/payouts">
                <Button variant="outline" className="glow-button">
                  <Banknote className="w-4 h-4 mr-2" />
                  Payouts
                </Button>
              </Link>
              <div className="px-4 py-2 rounded-lg bg-card border border-primary/30 glow-cyan">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="ml-2 text-success font-bold">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value="€12,847"
            icon={<TrendingUp className="w-6 h-6" />}
            trend="+23.5%"
            color="primary"
          />
          <StatCard
            title="Active Bots"
            value="47"
            icon={<Bot className="w-6 h-6" />}
            trend="+12"
            color="success"
          />
          <StatCard
            title="Wallets"
            value="23"
            icon={<Wallet className="w-6 h-6" />}
            trend="+5"
            color="info"
          />
          <StatCard
            title="Violations"
            value="0"
            icon={<AlertTriangle className="w-6 h-6" />}
            trend="0"
            color="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Empire Overview */}
          <Card className="lg:col-span-2 gradient-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Activity className="w-5 h-5" />
                Empire Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActivityItem
                  status="active"
                  title="Trading Bot #23"
                  description="Generated €234 in the last hour"
                  time="2m ago"
                />
                <ActivityItem
                  status="active"
                  title="Content Bot #12"
                  description="Published 5 articles - €89 revenue"
                  time="15m ago"
                />
                <ActivityItem
                  status="pending"
                  title="Service Bot #08"
                  description="Processing 3 orders"
                  time="23m ago"
                />
                <ActivityItem
                  status="active"
                  title="Data Bot #45"
                  description="Collected 15k records - €156 revenue"
                  time="1h ago"
                />
              </div>
            </CardContent>
          </Card>

          {/* Law Enforcement Panel */}
          <Card className="gradient-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <Shield className="w-5 h-5" />
                Law Enforcement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted border border-success/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-success">ALL CLEAR</span>
                    <span className="text-xs text-muted-foreground">Last check: 5s ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    No violations detected. All contracts are being enforced.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <LawMetric label="Trust Score" value="0.98" max="1.0" />
                  <LawMetric label="Contract Compliance" value="100%" max="100%" />
                  <LawMetric label="Auto-Enforcement" value="Active" status="success" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Command Center */}
          <Card className="lg:col-span-3 gradient-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Wallet className="w-5 h-5" />
                Wallet Command Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <WalletCard
                  name="Main Wallet"
                  balance="€8,234.45"
                  transactions={156}
                  status="active"
                />
                <WalletCard
                  name="Trading Wallet"
                  balance="€3,456.12"
                  transactions={89}
                  status="active"
                />
                <WalletCard
                  name="Plugin Revenue"
                  balance="€1,156.88"
                  transactions={34}
                  status="active"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  trend: string;
  color: string;
}) => {
  return (
    <Card className="gradient-border hover:scale-105 transition-transform duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-${color}/10 text-${color}`}>
            {icon}
          </div>
          <span className={`text-sm font-bold ${trend.startsWith('+') ? 'text-success' : 'text-warning'}`}>
            {trend}
          </span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Activity Item Component
const ActivityItem = ({ 
  status, 
  title, 
  description, 
  time 
}: { 
  status: 'active' | 'pending' | 'error'; 
  title: string; 
  description: string; 
  time: string;
}) => {
  const statusColors = {
    active: 'bg-success',
    pending: 'bg-warning',
    error: 'bg-destructive',
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div className={`w-2 h-2 rounded-full mt-2 ${statusColors[status]} animate-pulse`} />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-sm">{title}</h4>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

// Law Metric Component
const LawMetric = ({ 
  label, 
  value, 
  max, 
  status 
}: { 
  label: string; 
  value: string; 
  max?: string;
  status?: string;
}) => {
  return (
    <div className="flex items-center justify-between p-2 rounded bg-muted/30">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-bold ${status === 'success' ? 'text-success' : 'text-foreground'}`}>
        {value}{max && ` / ${max}`}
      </span>
    </div>
  );
};

// Wallet Card Component
const WalletCard = ({ 
  name, 
  balance, 
  transactions, 
  status 
}: { 
  name: string; 
  balance: string; 
  transactions: number; 
  status: string;
}) => {
  return (
    <div className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm">{name}</h4>
        <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-success' : 'bg-muted-foreground'} animate-pulse`} />
      </div>
      <p className="text-2xl font-bold mb-2">{balance}</p>
      <p className="text-xs text-muted-foreground">{transactions} transactions</p>
    </div>
  );
};

export default Index;
