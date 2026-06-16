import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * API route for cleaning up messages older than 1 week
 * This should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
 * 
 * You can trigger this manually: GET /api/cron/cleanup-messages
 * 
 * Secure this with an authorization header:
 * Authorization: Bearer YOUR_CRON_SECRET
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Determine the threshold for 1 week ago
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    // Delete messages older than 1 week
    const deleteResult = await prisma.message.deleteMany({
      where: {
        createdAt: {
          lt: oneWeekAgo,
        },
      },
    })

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.count,
      cutoffDate: oneWeekAgo.toISOString(),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cleanup messages cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
