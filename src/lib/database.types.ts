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
          created_at: string
          name: string
          address: string
          jurisdiction: string
          user_id: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          address: string
          jurisdiction: string
          user_id: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          address?: string
          jurisdiction?: string
          user_id?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          created_at: string
          property_id: string
          period_start: string
          period_end: string
          status: string
          compliance_status: string
          report_data: Json
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          property_id: string
          period_start: string
          period_end: string
          status?: string
          compliance_status?: string
          report_data?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          property_id?: string
          period_start?: string
          period_end?: string
          status?: string
          compliance_status?: string
          report_data?: Json
          updated_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          created_at: string
          report_id: string
          alert_type: string
          message: string
          severity: string
          status: string
          resolved_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          report_id: string
          alert_type: string
          message: string
          severity: string
          status?: string
          resolved_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          report_id?: string
          alert_type?: string
          message?: string
          severity?: string
          status?: string
          resolved_at?: string | null
          metadata?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 