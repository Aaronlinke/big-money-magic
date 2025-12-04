export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bot_activity_logs: {
        Row: {
          action: string
          bot_id: string
          created_at: string
          details: Json | null
          earnings: number | null
          id: string
        }
        Insert: {
          action: string
          bot_id: string
          created_at?: string
          details?: Json | null
          earnings?: number | null
          id?: string
        }
        Update: {
          action?: string
          bot_id?: string
          created_at?: string
          details?: Json | null
          earnings?: number | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_activity_logs_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_rentals: {
        Row: {
          bot_id: string
          created_at: string
          earnings_generated: number
          end_date: string
          id: string
          owner_id: string
          price_per_day: number
          renter_id: string
          start_date: string
          status: Database["public"]["Enums"]["rental_status"]
          stripe_payment_id: string | null
          total_price: number
          updated_at: string
        }
        Insert: {
          bot_id: string
          created_at?: string
          earnings_generated?: number
          end_date: string
          id?: string
          owner_id: string
          price_per_day: number
          renter_id: string
          start_date: string
          status?: Database["public"]["Enums"]["rental_status"]
          stripe_payment_id?: string | null
          total_price: number
          updated_at?: string
        }
        Update: {
          bot_id?: string
          created_at?: string
          earnings_generated?: number
          end_date?: string
          id?: string
          owner_id?: string
          price_per_day?: number
          renter_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["rental_status"]
          stripe_payment_id?: string | null
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_rentals_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      bots: {
        Row: {
          config: Json | null
          created_at: string
          description: string | null
          id: string
          is_available_for_rent: boolean
          last_active_at: string | null
          name: string
          owner_id: string | null
          rental_price_per_day: number | null
          status: Database["public"]["Enums"]["bot_status"]
          total_earnings: number
          total_tasks_completed: number
          type: Database["public"]["Enums"]["bot_type"]
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_available_for_rent?: boolean
          last_active_at?: string | null
          name: string
          owner_id?: string | null
          rental_price_per_day?: number | null
          status?: Database["public"]["Enums"]["bot_status"]
          total_earnings?: number
          total_tasks_completed?: number
          type: Database["public"]["Enums"]["bot_type"]
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_available_for_rent?: boolean
          last_active_at?: string | null
          name?: string
          owner_id?: string | null
          rental_price_per_day?: number | null
          status?: Database["public"]["Enums"]["bot_status"]
          total_earnings?: number
          total_tasks_completed?: number
          type?: Database["public"]["Enums"]["bot_type"]
          updated_at?: string
        }
        Relationships: []
      }
      payout_rules: {
        Row: {
          created_at: string
          description: string | null
          founder_percentage: number
          id: string
          is_active: boolean
          is_immutable: boolean
          name: string
          system_percentage: number
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          founder_percentage?: number
          id?: string
          is_active?: boolean
          is_immutable?: boolean
          name: string
          system_percentage?: number
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          founder_percentage?: number
          id?: string
          is_active?: boolean
          is_immutable?: boolean
          name?: string
          system_percentage?: number
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Relationships: []
      }
      payout_settings: {
        Row: {
          auto_payout_enabled: boolean
          created_at: string
          frequency: Database["public"]["Enums"]["payout_frequency"]
          id: string
          minimum_amount: number
          updated_at: string
          wallet_id: string
        }
        Insert: {
          auto_payout_enabled?: boolean
          created_at?: string
          frequency?: Database["public"]["Enums"]["payout_frequency"]
          id?: string
          minimum_amount?: number
          updated_at?: string
          wallet_id: string
        }
        Update: {
          auto_payout_enabled?: boolean
          created_at?: string
          frequency?: Database["public"]["Enums"]["payout_frequency"]
          id?: string
          minimum_amount?: number
          updated_at?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_settings_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: true
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          amount: number
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          processed_at: string | null
          scheduled_at: string | null
          status: Database["public"]["Enums"]["payout_status"]
          stripe_payout_id: string | null
          stripe_transfer_id: string | null
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          processed_at?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          stripe_payout_id?: string | null
          stripe_transfer_id?: string | null
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          processed_at?: string | null
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          stripe_payout_id?: string | null
          stripe_transfer_id?: string | null
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          metadata: Json | null
          related_transaction_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          stripe_payment_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          related_transaction_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          stripe_payment_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          related_transaction_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          stripe_payment_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_related_transaction_id_fkey"
            columns: ["related_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          is_founder_wallet: boolean
          is_system_wallet: boolean
          name: string
          stripe_account_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          is_founder_wallet?: boolean
          is_system_wallet?: boolean
          name: string
          stripe_account_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          is_founder_wallet?: boolean
          is_system_wallet?: boolean
          name?: string
          stripe_account_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      bot_status: "active" | "idle" | "paused" | "error" | "maintenance"
      bot_type: "trading" | "content" | "service" | "data" | "automation"
      payout_frequency: "daily" | "weekly" | "monthly" | "manual"
      payout_status: "pending" | "processing" | "completed" | "failed"
      rental_status: "active" | "pending" | "expired" | "cancelled"
      transaction_status: "pending" | "completed" | "failed" | "cancelled"
      transaction_type:
        | "bot_rental"
        | "plugin_sale"
        | "membership"
        | "license"
        | "payout"
        | "founder_provision"
        | "system_fee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      bot_status: ["active", "idle", "paused", "error", "maintenance"],
      bot_type: ["trading", "content", "service", "data", "automation"],
      payout_frequency: ["daily", "weekly", "monthly", "manual"],
      payout_status: ["pending", "processing", "completed", "failed"],
      rental_status: ["active", "pending", "expired", "cancelled"],
      transaction_status: ["pending", "completed", "failed", "cancelled"],
      transaction_type: [
        "bot_rental",
        "plugin_sale",
        "membership",
        "license",
        "payout",
        "founder_provision",
        "system_fee",
      ],
    },
  },
} as const
