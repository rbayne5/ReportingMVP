import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ReportCard from '@/components/reports/ReportCard'
import GenerateReportModal from '@/components/reports/GenerateReportModal'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import type { Database } from '@/lib/supabaseClient'

type Report = Database['public']['Tables']['reports']['Row']

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchReports()
  }, [user])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReports(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching reports')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (propertyId: string, periodStart: string, periodEnd: string) => {
    try {
      // Create a new report with initial status
      const { data, error } = await supabase
        .from('reports')
        .insert([{
          property_id: propertyId,
          period_start: periodStart,
          period_end: periodEnd,
          status: 'in_progress',
          compliance_status: 'pending',
          report_data: {}
        }])
        .select()
        .single()

      if (error) throw error

      // TODO: Implement actual report generation logic here
      // For now, we'll just update the status to completed
      const { error: updateError } = await supabase
        .from('reports')
        .update({
          status: 'completed',
          compliance_status: 'compliant',
          report_data: {
            // Add sample report data
            energy_usage: {
              total: 1000,
              unit: 'kWh'
            },
            water_usage: {
              total: 500,
              unit: 'm³'
            },
            waste_management: {
              total: 200,
              unit: 'kg'
            }
          }
        })
        .eq('id', data.id)

      if (updateError) throw updateError

      // Refresh the reports list
      fetchReports()
    } catch (err) {
      throw err
    }
  }

  const handleDelete = async (report: Report) => {
    if (!confirm('Are you sure you want to delete this report?')) return

    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', report.id)

      if (error) throw error
      setReports(reports.filter(r => r.id !== report.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the report')
    }
  }

  const handleView = (report: Report) => {
    router.push(`/reports/${report.id}`)
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate Report
        </button>
      </div>

      {error && (
        <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-500">No reports found. Generate your first report to get started.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <GenerateReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerate}
      />
    </DashboardLayout>
  )
} 