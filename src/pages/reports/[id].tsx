import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { supabase } from '@/lib/supabaseClient'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ReportPDF } from '@/components/reports/ReportPDF'
import AlertsList from '@/components/reports/AlertsList'
import type { ReportWithData, Property } from '@/types/report'

export default function ReportDetail() {
  const [report, setReport] = useState<ReportWithData | null>(null)
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { id } = router.query

  const fetchReport = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single()

      if (reportError) throw reportError

      setReport(reportData)

      // Fetch associated property
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', reportData.property_id)
        .single()

      if (propertyError) throw propertyError
      setProperty(propertyData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the report')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchReport()
    }
  }, [id, fetchReport])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return 'bg-green-100 text-green-800'
      case 'non_compliant':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !report) {
    return (
      <DashboardLayout>
        <div className="px-4 py-5 sm:px-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">
              {error || 'Report not found'}
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Report Details
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {property?.name} - {new Date(report.period_start).toLocaleDateString()} to {new Date(report.period_end).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
              {report.status.replace('_', ' ')}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getComplianceColor(report.compliance_status)}`}>
              {report.compliance_status.replace('_', ' ')}
            </span>
            {report && property && (
              <PDFDownloadLink
                document={<ReportPDF report={report} property={property} />}
                fileName={`esg-report-${report.id}.pdf`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {({ loading }) => (loading ? 'Generating PDF...' : 'Export PDF')}
              </PDFDownloadLink>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Energy Usage Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Energy Usage
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {report.report_data?.energy_usage?.total || 0} {report.report_data?.energy_usage?.unit || 'kWh'}
              </dd>
            </div>
          </div>

          {/* Water Usage Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Water Usage
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {report.report_data?.water_usage?.total || 0} {report.report_data?.water_usage?.unit || 'm³'}
              </dd>
            </div>
          </div>

          {/* Waste Management Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Waste Management
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {report.report_data?.waste_management?.total || 0} {report.report_data?.waste_management?.unit || 'kg'}
              </dd>
            </div>
          </div>
        </div>

        {/* Additional Report Details */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Report Information</h3>
            <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Property</dt>
                <dd className="mt-1 text-sm text-gray-900">{property?.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{property?.address}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Jurisdiction</dt>
                <dd className="mt-1 text-sm text-gray-900">{property?.jurisdiction}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(report.created_at).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="mt-8">
          <AlertsList reportId={report.id} />
        </div>
      </div>
    </DashboardLayout>
  )
} 