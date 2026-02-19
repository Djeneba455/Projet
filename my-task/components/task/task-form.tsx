'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, type TaskInput } from '@/lib/validations/task'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { createTask, updateTask } from '@/app/actions/tasks'
import { useRouter } from 'next/navigation'

interface TaskFormProps {
  task?: any
  categories: any[]
  students?: any[]
  onSuccess?: () => void
  onCancel?: () => void
}

export function TaskForm({ task, categories, students, onSuccess, onCancel }: TaskFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || '',
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString().split('T')[0]
            : '',
          categoryId: task.categoryId || '',
          assigneeId: task.assigneeId || '',
        }
      : {
          status: 'TODO',
          priority: 'MEDIUM',
          assigneeId: '',
        },
  })

  const assigneeId = watch('assigneeId')

  const onSubmit = async (data: TaskInput) => {
    setIsLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('title', data.title)
    if (data.description) formData.append('description', data.description)
    formData.append('status', data.status)
    formData.append('priority', data.priority)
    if (data.dueDate) formData.append('dueDate', data.dueDate)
    if (data.categoryId) formData.append('categoryId', data.categoryId)
    if (data.assigneeId) formData.append('assigneeId', data.assigneeId)

    const result = task
      ? await updateTask(task.id, formData)
      : await createTask(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/tasks')
        router.refresh()
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-400 light:bg-red-50 light:border-red-200 light:text-red-600">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1"
        >
          Titre <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Ex: Terminer le projet de maths"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-400 light:text-red-600">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1"
        >
          Description
        </label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Détails de la tâche..."
          rows={4}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-400 light:text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1"
          >
            Statut
          </label>
          <Select id="status" {...register('status')}>
            <option value="TODO">À faire</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="COMPLETED">Terminé</option>
          </Select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1"
          >
            Priorité
          </label>
          <Select id="priority" {...register('priority')}>
            <option value="LOW">Faible</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="HIGH">Haute</option>
            <option value="URGENT">Urgente</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1"
          >
            Date d'échéance
          </label>
          <Input id="dueDate" type="date" {...register('dueDate')} />
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1"
          >
            Catégorie
          </label>
          <Select id="categoryId" {...register('categoryId')}>
            <option value="">Aucune catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {students && students.length > 0 && (
        <div>
          <label
            htmlFor="assigneeId"
            className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1"
          >
            Assigner à
          </label>
          <SearchableSelect
            options={students.map((student) => ({
              value: student.id,
              label: student.classe
                ? `${student.name} (${student.classe.name})`
                : student.name,
            }))}
            value={assigneeId || ''}
            onChange={(value) => setValue('assigneeId', value)}
            placeholder="Rechercher un étudiant..."
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1 w-full sm:w-auto">
          {isLoading ? 'Enregistrement...' : task ? 'Mettre à jour' : 'Créer la tâche'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Annuler
          </Button>
        )}
      </div>
    </form>
  )
}
