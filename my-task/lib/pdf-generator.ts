import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatDate, getStatusLabel, getPriorityLabel, getRoleLabel } from './utils'

export function generateTasksReport(
  tasks: any[],
  user: { name: string; email: string; role: string },
  filters?: { startDate?: Date; endDate?: Date }
) {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(20)
  doc.text('Rapport de Tâches', 14, 22)

  // User info
  doc.setFontSize(10)
  doc.text(`Généré pour: ${user.name}`, 14, 32)
  doc.text(`Rôle: ${getRoleLabel(user.role)}`, 14, 37)
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 14, 42)

  if (filters?.startDate || filters?.endDate) {
    doc.text(
      `Période: ${filters.startDate ? formatDate(filters.startDate) : 'Début'} - ${
        filters.endDate ? formatDate(filters.endDate) : 'Aujourd\'hui'
      }`,
      14,
      47
    )
  }

  // Statistics
  const todoCount = tasks.filter((t) => t.status === 'TODO').length
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length
  const totalCount = tasks.length

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Statistiques', 14, 57)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Total: ${totalCount}`, 20, 64)
  doc.text(`À faire: ${todoCount}`, 20, 69)
  doc.text(`En cours: ${inProgressCount}`, 20, 74)
  doc.text(`Terminées: ${completedCount}`, 20, 79)

  if (totalCount > 0) {
    const completionRate = Math.round((completedCount / totalCount) * 100)
    doc.text(`Taux de complétion: ${completionRate}%`, 20, 84)
  }

  // Tasks table
  const tableData = tasks.map((task) => [
    task.title,
    getStatusLabel(task.status),
    getPriorityLabel(task.priority),
    task.category?.name || '-',
    task.dueDate ? formatDate(task.dueDate) : '-',
    task.assignee?.name || task.creator?.name || '-',
  ])

  autoTable(doc, {
    startY: 95,
    head: [['Titre', 'Statut', 'Priorité', 'Catégorie', 'Échéance', 'Assigné à']],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
      5: { cellWidth: 30 },
    },
  })

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(
      `Page ${i} sur ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  return doc
}

export function generateUserReport(users: any[]) {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(20)
  doc.text('Rapport Utilisateurs', 14, 22)

  // Info
  doc.setFontSize(10)
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 32)
  doc.text(`Nombre total d'utilisateurs: ${users.length}`, 14, 37)

  // Users table
  const tableData = users.map((user) => [
    user.name,
    user.email,
    getRoleLabel(user.role),
    user._count?.createdTasks?.toString() || '0',
    user._count?.assignedTasks?.toString() || '0',
  ])

  autoTable(doc, {
    startY: 45,
    head: [['Nom', 'Email', 'Rôle', 'Tâches créées', 'Tâches assignées']],
    body: tableData,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  })

  return doc
}

export function generateCategoryReport(categories: any[]) {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(20)
  doc.text('Rapport Catégories', 14, 22)

  // Info
  doc.setFontSize(10)
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 32)
  doc.text(`Nombre total de catégories: ${categories.length}`, 14, 37)

  // Categories table
  const tableData = categories.map((category) => [
    category.name,
    category.description || '-',
    category._count?.tasks?.toString() || '0',
  ])

  autoTable(doc, {
    startY: 45,
    head: [['Nom', 'Description', 'Nombre de tâches']],
    body: tableData,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 100 },
      2: { cellWidth: 35 },
    },
  })

  return doc
}
