'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { generateTasksReport, generateUserReport, generateCategoryReport } from '@/lib/pdf-generator'
import { FileDown, FileText } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface ReportGeneratorProps {
  tasks: any[]
  categories: any[]
  users: any[]
  userRole: string
}

export function ReportGenerator({ tasks, categories, users, userRole }: ReportGeneratorProps) {
  const { data: session } = useSession()
  const [reportType, setReportType] = useState('tasks')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = () => {
    setIsGenerating(true)

    try {
      let doc

      switch (reportType) {
        case 'tasks':
          const filteredTasks = tasks.filter((task) => {
            if (startDate && new Date(task.createdAt) < new Date(startDate)) return false
            if (endDate && new Date(task.createdAt) > new Date(endDate)) return false
            return true
          })

          doc = generateTasksReport(
            filteredTasks,
            {
              name: session?.user?.name || 'Utilisateur',
              email: session?.user?.email || '',
              role: session?.user?.role || 'STUDENT',
            },
            {
              startDate: startDate ? new Date(startDate) : undefined,
              endDate: endDate ? new Date(endDate) : undefined,
            }
          )
          doc.save('rapport-taches.pdf')
          break

        case 'users':
          if (userRole === 'ADMIN') {
            doc = generateUserReport(users)
            doc.save('rapport-utilisateurs.pdf')
          }
          break

        case 'categories':
          doc = generateCategoryReport(categories)
          doc.save('rapport-categories.pdf')
          break
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Erreur lors de la génération du rapport')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReportCard
          title="Rapport de Tâches"
          description="Exportez toutes vos tâches avec statistiques"
          icon={<FileText size={32} />}
          onClick={() => setReportType('tasks')}
          isSelected={reportType === 'tasks'}
        />
        <ReportCard
          title="Rapport de Catégories"
          description="Liste des catégories et statistiques"
          icon={<FileText size={32} />}
          onClick={() => setReportType('categories')}
          isSelected={reportType === 'categories'}
        />
        {userRole === 'ADMIN' && (
          <ReportCard
            title="Rapport Utilisateurs"
            description="Liste des utilisateurs et activités"
            icon={<FileText size={32} />}
            onClick={() => setReportType('users')}
            isSelected={reportType === 'users'}
          />
        )}
      </div>

      {/* Filters */}
      {reportType === 'tasks' && (
        <div className="bg-gray-800 light:bg-white rounded-xl shadow-sm border border-gray-700 light:border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-white light:text-gray-900 mb-4">
            Filtres (optionnel)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1">
                Date de début
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1">
                Date de fin
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="bg-gray-800 light:bg-white rounded-xl shadow-sm border border-gray-700 light:border-gray-200 p-6">
        <Button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          <FileDown size={20} className="mr-2" />
          {isGenerating ? 'Génération...' : 'Générer le rapport PDF'}
        </Button>
      </div>
    </div>
  )
}

function ReportCard({
  title,
  description,
  icon,
  onClick,
  isSelected,
}: {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  isSelected: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-xl border-2 transition-all text-left ${
        isSelected
          ? 'border-blue-500 bg-blue-900/20 light:bg-blue-50'
          : 'border-gray-700 light:border-gray-200 bg-gray-800 light:bg-white hover:border-blue-700 light:hover:border-blue-300'
      }`}
    >
      <div className="text-blue-400 light:text-blue-600 mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-white light:text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-400 light:text-gray-600">{description}</p>
    </button>
  )
}
