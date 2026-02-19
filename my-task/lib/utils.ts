import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return ''
  
  const d = new Date(date)
  const now = new Date()
  const diffTime = d.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Demain'
  if (diffDays === -1) return 'Hier'
  if (diffDays > 1 && diffDays <= 7) return `Dans ${diffDays} jours`
  if (diffDays < -1 && diffDays >= -7) return `Il y a ${Math.abs(diffDays)} jours`

  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return ''
  
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'LOW':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    case 'TODO':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'TODO':
      return 'À faire'
    case 'IN_PROGRESS':
      return 'En cours'
    case 'COMPLETED':
      return 'Terminé'
    default:
      return status
  }
}

export function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'LOW':
      return 'Faible'
    case 'MEDIUM':
      return 'Moyenne'
    case 'HIGH':
      return 'Haute'
    case 'URGENT':
      return 'Urgente'
    default:
      return priority
  }
}

export function getRoleLabel(role: string): string {
  switch (role) {
    case 'STUDENT':
      return 'Étudiant'
    case 'TEACHER':
      return 'Enseignant'
    case 'ADMIN':
      return 'Administrateur'
    default:
      return role
  }
}

/**
 * Get category badge styles with proper dark mode support
 */
export function getCategoryBadgeStyle(color: string) {
  return {
    backgroundColor: `${color}20`,
    color: color,
    // Add a border in dark mode for better visibility
    borderColor: `${color}40`,
  }
}
