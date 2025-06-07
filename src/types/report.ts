import type { Database } from '@/lib/supabaseClient'

export type Report = Database['public']['Tables']['reports']['Row']
export type Property = Database['public']['Tables']['properties']['Row']

export interface ReportData {
  energy_usage?: {
    total: number
    unit: string
  }
  water_usage?: {
    total: number
    unit: string
  }
  waste_management?: {
    total: number
    unit: string
  }
}

export interface ReportWithData extends Omit<Report, 'report_data'> {
  report_data: ReportData
} 