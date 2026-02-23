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
        return 'bg-red-900/30 text-red-400 light:bg-red-100 light:text-red-800'
      case 'TEACHER':
        return 'bg-blue-900/30 text-blue-400 light:bg-blue-100 light:text-blue-800'
      case 'STUDENT':
        return 'bg-green-900/30 text-green-400 light:bg-green-100 light:text-green-800'
      default:
        return 'bg-gray-900/30 text-gray-400 light:bg-gray-100 light:text-gray-800'
    }
  }

  return (
    <div className="space-y-6 min-w-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white light:text-gray-900">
          Mon Profil
        </h1>
        <p className="text-sm sm:text-base text-gray-400 light:text-gray-600 mt-1">
          Gérez vos informations personnelles et vos paramètres de compte
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-gray-800 light:bg-white rounded-xl shadow-sm border border-gray-700 light:border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-900/30 light:bg-blue-100 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
            <User size={32} className="text-blue-400 light:text-blue-600" />
          </div>
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white light:text-gray-900">
                {user.name}
              </h2>
              <Badge className={getRoleColor(user.role)}>
                {getRoleLabel(user.role)}
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-400 light:text-gray-600">
                <Mail size={16} />
                <span className="text-sm">{user.email}</span>
              </div>
              {user.classe && (
                <div className="flex items-center gap-2 text-gray-400 light:text-gray-600">
                  <Shield size={16} />
                  <span className="text-sm">Classe: {user.classe.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-400 light:text-gray-600">
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
