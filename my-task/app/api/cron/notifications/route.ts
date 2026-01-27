import { NextRequest, NextResponse } from 'next/server'
import { checkUpcomingDeadlines, checkOverdueTasks } from '@/lib/notifications'

/**
 * API route for checking and sending automated notifications
 * This should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
 * 
 * You can trigger this manually: GET /api/cron/notifications
 * 
 * For production, secure this with an authorization header:
 * Authorization: Bearer YOUR_CRON_SECRET
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Verify cron secret in production
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Run notification checks
    const upcomingResult = await checkUpcomingDeadlines()
    const overdueResult = await checkOverdueTasks()

    return NextResponse.json({
      success: true,
      upcoming: upcomingResult,
      overdue: overdueResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
