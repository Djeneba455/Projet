import { getCurrentUser } from '@/app/actions/profile'
import { getClasses } from '@/app/actions/classes'
import { ProfileForm } from '@/components/profile/profile-form'
import { PasswordForm } from '@/components/profile/password-form'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, Shield } from 'lucide-react'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const userResult = await getCurrentUser()
  
  if (userResult.error || !userResult.user) {
    redirect('/login')
  }

  const user = userResult.user
  const classesResult = await getClasses()
  const classes = classesResult.classes || []

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrateur'
      case 'TEACHER':
        return 'Enseignant'
      case 'STUDENT':
        return 'Étudiant'
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'TEACHER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'STUDENT':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mon Profil
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gérez vos informations personnelles et vos paramètres de compte
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <User size={32} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <Badge className={getRoleColor(user.role)}>
                {getRoleLabel(user.role)}
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail size={16} />
                <span className="text-sm">{user.email}</span>
              </div>
              {user.classe && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Shield size={16} />
                  <span className="text-sm">Classe: {user.classe.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar size={16} />
                <span className="text-sm">
                  Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ProfileForm user={user} classes={classes} />
        <PasswordForm />
      </div>
    </div>
  )
}
