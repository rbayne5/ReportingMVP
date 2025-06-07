import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Type definitions for our database tables
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          user_id: string
          name: string
          address: string
          jurisdiction: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          address: string
          jurisdiction: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          address?: string
          jurisdiction?: string
          created_at?: string
          updated_at?: string
        }
      }
      utility_data: {
        Row: {
          id: string
          property_id: string
          provider: string
          data: Json
          period_start: string
          period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          provider: string
          data: Json
          period_start: string
          period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          provider?: string
          data?: Json
          period_start?: string
          period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
      regulations: {
        Row: {
          id: string
          jurisdiction: string
          rule_name: string
          rule_logic: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          jurisdiction: string
          rule_name: string
          rule_logic: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          jurisdiction?: string
          rule_name?: string
          rule_logic?: Json
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          property_id: string
          period_start: string
          period_end: string
          status: string
          compliance_status: string
          report_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          period_start: string
          period_end: string
          status: string
          compliance_status: string
          report_data: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          period_start?: string
          period_end?: string
          status?: string
          compliance_status?: string
          report_data?: Json
          created_at?: string
          updated_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          report_id: string
          alert_type: string
          message: string
          severity: string
          created_at: string
          resolved_at: string | null
          resolved_by: string | null
        }
        Insert: {
          id?: string
          report_id: string
          alert_type: string
          message: string
          severity: string
          created_at?: string
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Update: {
          id?: string
          report_id?: string
          alert_type?: string
          message?: string
          severity?: string
          created_at?: string
          resolved_at?: string | null
          resolved_by?: string | null
        }
      }
    }
  }
} 