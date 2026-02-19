'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X, Filter } from 'lucide-react'

interface TaskFiltersProps {
  categories: any[]
  students?: any[]
}

export function TaskFilters({ categories, students }: TaskFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [priority, setPriority] = useState(searchParams.get('priority') || '')
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '')
  const [assigneeId, setAssigneeId] = useState(searchParams.get('assigneeId') || '')
  const [showFilters, setShowFilters] = useState(false)

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    if (priority) params.set('priority', priority)
    if (categoryId) params.set('categoryId', categoryId)
    if (assigneeId) params.set('assigneeId', assigneeId)

    const queryString = params.toString()
    router.push(`/tasks${queryString ? `?${queryString}` : ''}`)
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('')
    setPriority('')
    setCategoryId('')
    setAssigneeId('')
    router.push('/tasks')
  }

  const hasActiveFilters = search || status || priority || categoryId || assigneeId

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 light:text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Rechercher une tâche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="pl-10 w-full"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Filter size={18} />
          <span className="hidden sm:inline">Filtres</span>
          <span className="sm:hidden">Filtres</span>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-4 bg-gray-800/50 light:bg-gray-50 rounded-lg border border-gray-700 light:border-gray-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1">
                Statut
              </label>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Tous</option>
                <option value="TODO">À faire</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="COMPLETED">Terminé</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1">
                Priorité
              </label>
              <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="">Toutes</option>
                <option value="LOW">Faible</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Haute</option>
                <option value="URGENT">Urgente</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1">
                Catégorie
              </label>
              <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Toutes</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>

            {students && students.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1">
                  Assigné à
                </label>
                <Select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                  <option value="">Tous</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={applyFilters} size="sm" className="w-full sm:w-auto">
              Appliquer les filtres
            </Button>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm" className="w-full sm:w-auto">
                <X size={16} className="mr-1" />
                Réinitialiser
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
