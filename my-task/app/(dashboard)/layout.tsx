import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-900 light:bg-gradient-to-br light:from-blue-50 light:to-indigo-50 transition-colors duration-300">
      <Navbar />
      <div className="flex">
        <Sidebar userRole={session.user.role} />
        <main className="flex-1 p-4 sm:p-6 lg:p-6 pt-20 sm:pt-20 lg:pt-6 lg:ml-0 bg-gray-900 light:bg-gradient-to-br light:from-blue-50 light:to-indigo-50 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  )
}
