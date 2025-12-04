import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Zap, CheckCircle } from "lucide-react";

interface ActivityItem {
  id: string;
  action: string;
  botName: string;
  earnings: number;
  time: string;
  type: 'earning' | 'task' | 'rental' | 'status';
}

// Demo activity for display
const demoActivity: ActivityItem[] = [
  {
    id: '1',
    action: 'Trade executed',
    botName: 'Trading Bot Alpha',
    earnings: 234.50,
    time: '2m ago',
    type: 'earning'
  },
  {
    id: '2',
    action: 'Article published',
    botName: 'Content Generator X',
    earnings: 89.00,
    time: '15m ago',
    type: 'task'
  },
  {
    id: '3',
    action: 'New rental started',
    botName: 'Service Bot Delta',
    earnings: 119.97,
    time: '1h ago',
    type: 'rental'
  },
  {
    id: '4',
    action: 'Data collection complete',
    botName: 'Data Scraper Pro',
    earnings: 156.00,
    time: '2h ago',
    type: 'task'
  },
  {
    id: '5',
    action: 'Status: Active',
    botName: 'Trading Bot Alpha',
    earnings: 0,
    time: '3h ago',
    type: 'status'
  }
];

const typeIcons = {
  earning: <TrendingUp className="w-4 h-4 text-success" />,
  task: <CheckCircle className="w-4 h-4 text-primary" />,
  rental: <Zap className="w-4 h-4 text-warning" />,
  status: <Activity className="w-4 h-4 text-info" />
};

export const BotActivityFeed = () => {
  return (
    <Card className="gradient-border h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-accent text-lg">
          <Activity className="w-5 h-5" />
          Live Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {demoActivity.map((item) => (
            <div 
              key={item.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="mt-0.5">
                {typeIcons[item.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.action}</p>
                <p className="text-xs text-muted-foreground truncate">{item.botName}</p>
              </div>
              <div className="text-right">
                {item.earnings > 0 && (
                  <p className="text-sm font-bold text-success">
                    +€{item.earnings.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Today's Earnings</span>
            <span className="font-bold text-success">+€599.47</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
