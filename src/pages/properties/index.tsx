import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PropertyCard from '@/components/properties/PropertyCard'
import PropertyModal from '@/components/properties/PropertyModal'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import type { Database } from '@/lib/database.types'

type Property = Database['public']['Tables']['properties']['Row']

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>()
  const { user } = useAuth()

  useEffect(() => {
    fetchProperties()
  }, [user])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProperties(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching properties')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (propertyData: Omit<Property, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (selectedProperty) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', selectedProperty.id)

        if (error) throw error
        setProperties(properties.map(p => p.id === selectedProperty.id ? { ...p, ...propertyData } : p))
      } else {
        // Create new property
        const { data, error } = await supabase
          .from('properties')
          .insert([{ ...propertyData, user_id: user?.id }])
          .select()
          .single()

        if (error) throw error
        setProperties([data, ...properties])
      }
    } catch (err) {
      throw err
    }
  }

  const handleDelete = async (property: Property) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id)

      if (error) throw error
      setProperties(properties.filter(p => p.id !== property.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the property')
    }
  }

  const handleEdit = (property: Property) => {
    setSelectedProperty(property)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedProperty(undefined)
    setIsModalOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Properties</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Property
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
      ) : properties.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-500">No properties found. Add your first property to get started.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProperty(undefined)
        }}
        onSave={handleSave}
        property={selectedProperty}
      />
    </DashboardLayout>
  )
} 