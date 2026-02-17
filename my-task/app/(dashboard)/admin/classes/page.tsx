import { getClasses } from '@/app/actions/classes'
import { requireAuth } from '@/lib/auth-helpers'
import { ClasseManagement } from '@/components/admin/classe-management'

export const dynamic = 'force-dynamic'

export default async function ClassesPage() {
  await requireAuth(['ADMIN', 'TEACHER'])
  
  const classesResult = await getClasses()
  const classes = classesResult.classes || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Classes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gérez les classes de votre établissement
        </p>
      </div>

      <ClasseManagement classes={classes} />
    </div>
  )
}
