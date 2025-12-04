import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings, Calendar, Banknote } from "lucide-react";

interface PayoutSettingsCardProps {
  autoPayoutEnabled: boolean;
  setAutoPayoutEnabled: (enabled: boolean) => void;
}

export const PayoutSettingsCard = ({ 
  autoPayoutEnabled, 
  setAutoPayoutEnabled 
}: PayoutSettingsCardProps) => {
  return (
    <Card className="gradient-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-info">
          <Settings className="w-5 h-5" />
          Payout Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Auto Payout Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Banknote className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Auto Payout</p>
                <p className="text-xs text-muted-foreground">
                  Automatically transfer to bank
                </p>
              </div>
            </div>
            <Switch 
              checked={autoPayoutEnabled}
              onCheckedChange={setAutoPayoutEnabled}
            />
          </div>

          {/* Frequency */}
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Calendar className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Frequency</p>
                <p className="text-xs text-muted-foreground">
                  When to process payouts
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <FrequencyOption label="Daily" selected={false} />
              <FrequencyOption label="Weekly" selected={true} />
              <FrequencyOption label="Monthly" selected={false} />
              <FrequencyOption label="Manual" selected={false} />
            </div>
          </div>

          {/* Minimum Amount */}
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="text-sm">Minimum Amount</span>
              <span className="font-bold text-primary">€50.00</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Only process when balance exceeds minimum
            </p>
          </div>

          {/* Next Payout */}
          <div className="p-3 rounded-lg bg-success/10 border border-success/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-success">Next Scheduled Payout</span>
              <span className="font-bold text-success">Monday, 9:00 AM</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FrequencyOption = ({ label, selected }: { label: string; selected: boolean }) => {
  return (
    <button
      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
        selected 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted hover:bg-muted/80 text-muted-foreground'
      }`}
    >
      {label}
    </button>
  );
};
