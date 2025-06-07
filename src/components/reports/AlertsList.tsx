import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/lib/supabaseClient'

type Alert = Database['public']['Tables']['alerts']['Row']

interface AlertsListProps {
  reportId: string
}

export default function AlertsList({ reportId }: AlertsListProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAlerts()
  }, [reportId])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAlerts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching alerts')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <p className="text-sm text-green-600">No alerts found for this report.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border rounded-md p-4 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <h4 className="text-sm font-medium">{alert.alert_type}</h4>
                <p className="mt-1 text-sm">{alert.message}</p>
              </div>
              <div className="ml-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                  {alert.severity}
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {new Date(alert.created_at).toLocaleString()}
              {alert.resolved_at && (
                <span className="ml-2">
                  • Resolved: {new Date(alert.resolved_at).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 