'use server'

import { signIn } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { loginSchema, registerSchema } from '@/lib/validations/user'
import { hash } from 'bcryptjs'
import { AuthError } from 'next-auth'

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const validatedData = loginSchema.parse({ email, password })

    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Email ou mot de passe incorrect' }
    }
    return { error: 'Une erreur est survenue' }
  }
}

export async function registerAction(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    const validatedData = registerSchema.parse(data)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return { error: 'Cet email est déjà utilisé' }
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 10)

    // Create user
    await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: 'STUDENT', // Default role
      },
    })

    // Auto sign in after registration
    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    console.error('Registration error:', error)
    return { error: 'Erreur lors de la création du compte' }
  }
}
