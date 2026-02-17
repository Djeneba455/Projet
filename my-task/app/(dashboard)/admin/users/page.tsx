import { getUsers } from '@/app/actions/users'
import { getClasses } from '@/app/actions/classes'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getRoleLabel } from '@/lib/utils'
import { User, Plus, Trash2 } from 'lucide-react'
import { UserManagement } from '@/components/admin/user-management'
import { requireAuth } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  // Protect this page - only ADMIN can access
  await requireAuth(['ADMIN'])
  
  const usersResult = await getUsers()
  const classesResult = await getClasses()
  const users = usersResult.users || []
  const classes = classesResult.classes || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestion des utilisateurs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {users.length} utilisateur{users.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* User Management Component */}
      <UserManagement users={users} classes={classes} />
    </div>
  )
}
