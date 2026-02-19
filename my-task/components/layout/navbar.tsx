import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { NotificationBell } from './notification-bell'
import { ThemeToggle } from './theme-toggle'
import { LogoutButton } from './logout-button'
import { getRoleLabel } from '@/lib/utils'
import Link from 'next/link'

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="bg-gray-800 light:bg-white border-b border-gray-700 light:border-gray-200 transition-colors duration-300 shadow-sm light:shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-white light:text-gray-900 truncate">
              Gestion de Tâches
            </h1>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            {session?.user && (
              <>
                <ThemeToggle />
                <NotificationBell />
                
                <div className="hidden lg:flex items-center gap-2 text-sm">
                  <User size={18} className="text-gray-400 light:text-gray-600 flex-shrink-0" />
                  <div className="text-right">
                    <p className="font-medium text-white light:text-gray-900 truncate max-w-[120px]">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-400 light:text-gray-500">
                      {getRoleLabel(session.user.role)}
                    </p>
                  </div>
                </div>

                <Link href="/profile" className="hidden md:block">
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <User size={16} className="mr-2" />
                    <span className="hidden lg:inline">Profil</span>
                  </Button>
                </Link>

                <div className="hidden md:block">
                  <LogoutButton />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
