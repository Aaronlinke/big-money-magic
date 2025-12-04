import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  Shield, 
  Settings,
  ArrowLeft,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { PayoutRulesCard } from "@/components/payouts/PayoutRulesCard";
import { TransactionList } from "@/components/payouts/TransactionList";
import { PayoutSettingsCard } from "@/components/payouts/PayoutSettingsCard";

const Payouts = () => {
  const [autoPayoutEnabled, setAutoPayoutEnabled] = useState(true);

  // Mock data for demonstration
  const founderBalance = 3854.32;
  const pendingPayout = 1250.00;
  const totalEarnings = 12847.45;
  const thisMonthEarnings = 4523.12;

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
                💰 Payout Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-lg bg-card border border-success/30 glow-cyan">
                <span className="text-sm text-muted-foreground">Stripe:</span>
                <span className="ml-2 text-success font-bold">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <BalanceCard
            title="Founder Balance"
            value={`€${founderBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`}
            icon={<Wallet className="w-6 h-6" />}
            subtitle="Available for payout"
            color="primary"
          />
          <BalanceCard
            title="Pending Payout"
            value={`€${pendingPayout.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`}
            icon={<Clock className="w-6 h-6" />}
            subtitle="Processing..."
            color="warning"
          />
          <BalanceCard
            title="This Month"
            value={`€${thisMonthEarnings.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`}
            icon={<TrendingUp className="w-6 h-6" />}
            subtitle="+34% vs last month"
            color="success"
          />
          <BalanceCard
            title="Total Earnings"
            value={`€${totalEarnings.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`}
            icon={<Banknote className="w-6 h-6" />}
            subtitle="All time"
            color="info"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button className="glow-button" size="lg">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Request Payout
          </Button>
          <Button variant="outline" size="lg">
            <CreditCard className="w-4 h-4 mr-2" />
            Connect Stripe
          </Button>
          <Button variant="outline" size="lg">
            <Settings className="w-4 h-4 mr-2" />
            Payout Settings
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Founder Provision Rules */}
          <PayoutRulesCard />

          {/* Payout Settings */}
          <PayoutSettingsCard 
            autoPayoutEnabled={autoPayoutEnabled}
            setAutoPayoutEnabled={setAutoPayoutEnabled}
          />

          {/* Recent Transactions */}
          <TransactionList />

          {/* Payout History */}
          <Card className="lg:col-span-3 gradient-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Banknote className="w-5 h-5" />
                Payout History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <PayoutHistoryItem
                  date="2024-01-15"
                  amount={1500.00}
                  status="completed"
                  method="Bank Transfer"
                />
                <PayoutHistoryItem
                  date="2024-01-08"
                  amount={2350.00}
                  status="completed"
                  method="Bank Transfer"
                />
                <PayoutHistoryItem
                  date="2024-01-01"
                  amount={1847.32}
                  status="completed"
                  method="Bank Transfer"
                />
                <PayoutHistoryItem
                  date="2023-12-25"
                  amount={3200.00}
                  status="completed"
                  method="Bank Transfer"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

// Balance Card Component
const BalanceCard = ({ 
  title, 
  value, 
  icon, 
  subtitle, 
  color 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  subtitle: string;
  color: string;
}) => {
  return (
    <Card className="gradient-border hover:scale-105 transition-transform duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-${color}/10 text-${color}`}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold mb-1">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Payout History Item Component
const PayoutHistoryItem = ({
  date,
  amount,
  status,
  method
}: {
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: string;
}) => {
  const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-success', label: 'Completed' },
    pending: { icon: Clock, color: 'text-warning', label: 'Pending' },
    failed: { icon: AlertCircle, color: 'text-destructive', label: 'Failed' }
  };

  const StatusIcon = statusConfig[status].icon;

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg bg-success/10 ${statusConfig[status].color}`}>
          <StatusIcon className="w-4 h-4" />
        </div>
        <div>
          <p className="font-semibold text-sm">€{amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-muted-foreground">{method}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${statusConfig[status].color}`}>
          {statusConfig[status].label}
        </p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
    </div>
  );
};

export default Payouts;
