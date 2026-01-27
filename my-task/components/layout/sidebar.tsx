import { auth } from '@/lib/auth'
import Link from 'next/link'
import { LayoutDashboard, ListTodo, Calendar, FileText, Users, Tags, UserPlus } from 'lucide-react'

export async function Sidebar() {
  const session = await auth()
  const isAdmin = session?.user?.role === 'ADMIN'
  const isTeacher = session?.user?.role === 'TEACHER'

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <nav className="p-4 space-y-2">
        <NavLink href="/dashboard" icon={<LayoutDashboard size={20} />}>
          Dashboard
        </NavLink>
        
        <NavLink href="/tasks" icon={<ListTodo size={20} />}>
          Mes tâches
        </NavLink>
        
        <NavLink href="/calendar" icon={<Calendar size={20} />}>
          Calendrier
        </NavLink>
        
        <NavLink href="/reports" icon={<FileText size={20} />}>
          Rapports
        </NavLink>

        {/* Teacher Section */}
        {(isTeacher || isAdmin) && (
          <>
            <div className="pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
                Enseignant
              </p>
            </div>
            
            <NavLink href="/teacher/assignments" icon={<UserPlus size={20} />}>
              Attribuer tâches
            </NavLink>
          </>
        )}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
                Administration
              </p>
            </div>
            
            <NavLink href="/admin/users" icon={<Users size={20} />}>
              Utilisateurs
            </NavLink>
            
            <NavLink href="/admin/categories" icon={<Tags size={20} />}>
              Catégories
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  )
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}
