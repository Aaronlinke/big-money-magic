import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  time: string;
  isIncoming: boolean;
}

// Mock transactions for demonstration
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'bot_rental',
    amount: 234.00,
    description: 'Trading Bot #23 rental',
    time: '2m ago',
    isIncoming: true
  },
  {
    id: '2',
    type: 'founder_provision',
    amount: 70.20,
    description: 'Founder provision (30%)',
    time: '2m ago',
    isIncoming: true
  },
  {
    id: '3',
    type: 'plugin_sale',
    amount: 89.00,
    description: 'SEO Plugin sold',
    time: '15m ago',
    isIncoming: true
  },
  {
    id: '4',
    type: 'founder_provision',
    amount: 22.25,
    description: 'Founder provision (25%)',
    time: '15m ago',
    isIncoming: true
  },
  {
    id: '5',
    type: 'payout',
    amount: 1500.00,
    description: 'Weekly payout to bank',
    time: '2d ago',
    isIncoming: false
  }
];

export const TransactionList = () => {
  const typeColors: Record<string, string> = {
    'bot_rental': 'text-primary',
    'plugin_sale': 'text-info',
    'membership': 'text-secondary',
    'license': 'text-accent',
    'founder_provision': 'text-success',
    'payout': 'text-warning',
    'system_fee': 'text-muted-foreground'
  };

  return (
    <Card className="gradient-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Activity className="w-5 h-5" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockTransactions.map((tx) => (
            <div 
              key={tx.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className={`p-2 rounded-lg ${tx.isIncoming ? 'bg-success/10' : 'bg-warning/10'}`}>
                {tx.isIncoming ? (
                  <ArrowDownLeft className="w-4 h-4 text-success" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-warning" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{tx.description}</p>
                <p className={`text-xs ${typeColors[tx.type]}`}>
                  {tx.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${tx.isIncoming ? 'text-success' : 'text-warning'}`}>
                  {tx.isIncoming ? '+' : '-'}€{tx.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">{tx.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
