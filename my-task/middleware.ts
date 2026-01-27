import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  const isAuthPage = nextUrl.pathname.startsWith('/login') || 
                     nextUrl.pathname.startsWith('/register')
  const isPublicPage = nextUrl.pathname === '/' || isAuthPage
  const isDashboardPage = nextUrl.pathname.startsWith('/dashboard')
  const isAdminPage = nextUrl.pathname.startsWith('/admin')
  const isTeacherPage = nextUrl.pathname.startsWith('/teacher')

  // Redirect logged in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  // Redirect non-logged in users to login
  if (!isLoggedIn && !isPublicPage) {
    const callbackUrl = nextUrl.pathname + nextUrl.search
    const loginUrl = new URL('/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', callbackUrl)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based access control
  if (isLoggedIn) {
    // Admin-only pages
    if (isAdminPage && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }

    // Teacher and Admin pages
    if (isTeacherPage && userRole !== 'TEACHER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
  ],
}
