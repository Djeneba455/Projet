import { auth, signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { NotificationBell } from './notification-bell'
import { ThemeToggle } from './theme-toggle'
import { getRoleLabel } from '@/lib/utils'
import Link from 'next/link'

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center ml-16 lg:ml-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Gestion de Tâches
            </h1>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {session?.user && (
              <>
                <ThemeToggle />
                <NotificationBell />
                
                <div className="hidden md:flex items-center gap-2 text-sm">
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

                <Link href="/profile" className="hidden sm:block">
                  <Button variant="outline" size="sm">
                    <User size={16} className="mr-2" />
                    <span className="hidden md:inline">Profil</span>
                  </Button>
                </Link>

                <form
                  action={async () => {
                    'use server'
                    await signOut({ redirectTo: '/login' })
                  }}
                  className="hidden sm:block"
                >
                  <Button variant="outline" size="sm" type="submit">
                    <LogOut size={16} className="mr-2" />
                    <span className="hidden md:inline">Déconnexion</span>
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
