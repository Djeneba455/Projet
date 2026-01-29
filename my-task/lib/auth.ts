import NextAuth, { DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from './prisma'

// Extend the default session type
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: 'STUDENT' | 'TEACHER' | 'ADMIN'
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: 'STUDENT' | 'TEACHER' | 'ADMIN'
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // Important pour Vercel
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role as 'STUDENT' | 'TEACHER' | 'ADMIN'
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'STUDENT' | 'TEACHER' | 'ADMIN'
      }
      return session
    },
  },
})
