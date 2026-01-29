import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

/**
 * Server-side helper to protect pages and check user roles
 * Use this in Server Components to ensure authentication
 */
export async function requireAuth(allowedRoles?: ('STUDENT' | 'TEACHER' | 'ADMIN')[]) {
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login')
  }

  // Check role authorization if roles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = session.user.role as 'STUDENT' | 'TEACHER' | 'ADMIN'
    if (!allowedRoles.includes(userRole)) {
      redirect('/dashboard')
    }
  }

  return session
}
