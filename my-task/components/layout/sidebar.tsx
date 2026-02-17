'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, ListTodo, Calendar, FileText, Users, Tags, UserPlus, School, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  userRole?: 'STUDENT' | 'TEACHER' | 'ADMIN'
}

export function Sidebar({ userRole }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  
  const isAdmin = userRole === 'ADMIN'
  const isTeacher = userRole === 'TEACHER'

  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X size={24} className="text-gray-600 dark:text-gray-400" />
        ) : (
          <Menu size={24} className="text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen w-64
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <nav className="p-4 space-y-2 mt-16 lg:mt-0">
          <NavLink 
            href="/dashboard" 
            icon={<LayoutDashboard size={20} />}
            active={pathname === '/dashboard'}
            onClick={closeSidebar}
          >
            Dashboard
          </NavLink>
          
          <NavLink 
            href="/tasks" 
            icon={<ListTodo size={20} />}
            active={pathname === '/tasks'}
            onClick={closeSidebar}
          >
            Mes tâches
          </NavLink>
          
          <NavLink 
            href="/calendar" 
            icon={<Calendar size={20} />}
            active={pathname === '/calendar'}
            onClick={closeSidebar}
          >
            Calendrier
          </NavLink>
          
          <NavLink 
            href="/reports" 
            icon={<FileText size={20} />}
            active={pathname === '/reports'}
            onClick={closeSidebar}
          >
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
              
              <NavLink 
                href="/teacher/assignments" 
                icon={<UserPlus size={20} />}
                active={pathname === '/teacher/assignments'}
                onClick={closeSidebar}
              >
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
              
              <NavLink 
                href="/admin/users" 
                icon={<Users size={20} />}
                active={pathname === '/admin/users'}
                onClick={closeSidebar}
              >
                Utilisateurs
              </NavLink>
              
              <NavLink 
                href="/admin/classes" 
                icon={<School size={20} />}
                active={pathname === '/admin/classes'}
                onClick={closeSidebar}
              >
                Classes
              </NavLink>
              
              <NavLink 
                href="/admin/categories" 
                icon={<Tags size={20} />}
                active={pathname === '/admin/categories'}
                onClick={closeSidebar}
              >
                Catégories
              </NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  )
}

function NavLink({ 
  href, 
  icon, 
  children, 
  active, 
  onClick 
}: { 
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
        ${active 
          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }
      `}
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}
