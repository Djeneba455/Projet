import { auth, signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { NotificationBell } from './notification-bell'
import { getRoleLabel } from '@/lib/utils'

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Gestion de Tâches
            </h1>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {session?.user && (
              <>
                <NotificationBell />
                
                <div className="flex items-center gap-2 text-sm">
                  <User size={18} className="text-gray-600 dark:text-gray-400" />
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getRoleLabel(session.user.role)}
                    </p>
                  </div>
                </div>

                <form
                  action={async () => {
                    'use server'
                    await signOut({ redirectTo: '/login' })
                  }}
                >
                  <Button variant="outline" size="sm" type="submit">
                    <LogOut size={16} className="mr-2" />
                    Déconnexion
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
