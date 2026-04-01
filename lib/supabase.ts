import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:            string;
          email:         string;
          full_name:     string | null;
          role:          'user' | 'admin';
          is_active:     boolean;
          email_weekly:  boolean;
          email_alerts:  boolean;
          created_at:    string;
          updated_at:    string;
        };
        Insert: {
          id:            string;
          email:         string;
          full_name?:    string | null;
          role?:         'user' | 'admin';
          is_active?:    boolean;
          email_weekly?: boolean;
          email_alerts?: boolean;
        };
        Update: {
          full_name?:    string | null;
          role?:         'user' | 'admin';
          is_active?:    boolean;
          email_weekly?: boolean;
          email_alerts?: boolean;
        };
      };
      wearable_connections: {
        Row: {
          id:               string;
          user_id:          string;
          provider:         'fitbit' | 'withings' | 'garmin' | 'huawei';
          status:           'connected' | 'expired' | 'disconnected';
          access_token:     string | null;
          refresh_token:    string | null;
          token_expires_at: string | null;
          connected_at:     string;
          last_sync_at:     string | null;
          created_at:       string;
          updated_at:       string;
        };
        Insert: {
          user_id:          string;
          provider:         'fitbit' | 'withings' | 'garmin' | 'huawei';
          status?:          'connected' | 'expired' | 'disconnected';
          access_token?:    string | null;
          refresh_token?:   string | null;
          token_expires_at?: string | null;
          last_sync_at?:    string | null;
        };
        Update: {
          status?:          'connected' | 'expired' | 'disconnected';
          access_token?:    string | null;
          refresh_token?:   string | null;
          token_expires_at?: string | null;
          last_sync_at?:    string | null;
        };
      };
      sync_logs: {
        Row: {
          id:              string;
          user_id:         string;
          provider:        'fitbit' | 'withings' | 'garmin' | 'huawei';
          status:          'success' | 'failed' | 'retrying';
          error_message:   string | null;
          records_synced:  number;
          synced_at:       string;
          created_at:      string;
        };
        Insert: {
          user_id:         string;
          provider:        'fitbit' | 'withings' | 'garmin' | 'huawei';
          status:          'success' | 'failed' | 'retrying';
          error_message?:  string | null;
          records_synced?: number;
        };
      };
      weekly_reports: {
        Row: {
          id:                string;
          user_id:           string;
          week_start:        string;
          week_end:          string;
          avg_steps:         number | null;
          avg_sleep_hours:   number | null;
          active_days:       number | null;
          consistency_score: number | null;
          target_hit:        boolean | null;
          email_sent:        boolean | null;
          email_sent_at:     string | null;
          created_at:        string;
        };
      };
      audit_logs: {
        Row: {
          id:         string;
          user_id:    string | null;
          action:     string;
          resource:   string | null;
          details:    Record<string, unknown> | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          user_id?:   string | null;
          action:     string;
          resource?:  string | null;
          details?:   Record<string, unknown> | null;
          ip_address?: string | null;
        };
      };
    };
  };
};
