import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PayoutRule {
  id: string;
  name: string;
  description: string;
  transaction_type: string;
  founder_percentage: number;
  system_percentage: number;
  is_active: boolean;
  is_immutable: boolean;
}

export const PayoutRulesCard = () => {
  const { data: rules, isLoading } = useQuery({
    queryKey: ['payout-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payout_rules')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as PayoutRule[];
    }
  });

  const transactionTypeLabels: Record<string, string> = {
    'bot_rental': 'Bot Rentals',
    'plugin_sale': 'Plugin Sales',
    'membership': 'Memberships',
    'license': 'White-Label'
  };

  return (
    <Card className="gradient-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-secondary">
          <Shield className="w-5 h-5" />
          Law Engine Rules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">Loading rules...</div>
          ) : rules?.map((rule) => (
            <div 
              key={rule.id}
              className="p-3 rounded-lg bg-muted/50 border border-border"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    {transactionTypeLabels[rule.transaction_type] || rule.transaction_type}
                  </span>
                  {rule.is_immutable && (
                    <Lock className="w-3 h-3 text-warning" />
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded ${rule.is_active ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
                  {rule.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Founder: <strong className="text-primary">{rule.founder_percentage}%</strong></span>
                <span>System: <strong className="text-secondary">{rule.system_percentage}%</strong></span>
              </div>
              {rule.is_immutable && (
                <p className="text-xs text-warning mt-2">
                  🔒 Immutable - Cannot be modified
                </p>
              )}
            </div>
          ))}
          
          {!isLoading && (!rules || rules.length === 0) && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No payout rules configured
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
