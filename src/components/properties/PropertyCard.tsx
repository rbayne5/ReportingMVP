import type { Database } from '@/lib/database.types'

type Property = Database['public']['Tables']['properties']['Row']

interface PropertyCardProps {
  property: Property
  onEdit?: (property: Property) => void
  onDelete?: (property: Property) => void
}

export default function PropertyCard({ property, onEdit, onDelete }: PropertyCardProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{property.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{property.address}</p>
            <p className="mt-1 text-sm text-gray-500">Jurisdiction: {property.jurisdiction}</p>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(property)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(property)}
                className="text-red-600 hover:text-red-900"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="text-sm text-gray-500">
            <p className="flex items-center">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Created: {new Date(property.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 