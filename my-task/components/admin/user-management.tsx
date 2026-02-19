'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { getRoleLabel } from '@/lib/utils'
import { createUser, updateUser, updateUserRole, deleteUser } from '@/app/actions/users'
import { useRouter } from 'next/navigation'
import { Trash2, Edit, Plus } from 'lucide-react'

interface UserManagementProps {
  users: any[]
  classes: any[]
}

export function UserManagement({ users, classes }: UserManagementProps) {
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('STUDENT')
  const [editingRole, setEditingRole] = useState<string>('STUDENT')

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await createUser(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setIsCreateModalOpen(false)
      setSelectedRole('STUDENT')
      router.refresh()
      setIsLoading(false)
    }
  }

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await updateUser(editingUser.id, formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setEditingUser(null)
      router.refresh()
      setIsLoading(false)
    }
  }

  const handleUpdateRole = async (userId: string, role: string) => {
    const result = await updateUserRole(userId, role as any)
    if (result.success) {
      router.refresh()
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      await deleteUser(userId)
      router.refresh()
    }
  }

  return (
    <>
      {/* Create Button */}
      <div className="mb-4">
        <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
          <Plus size={18} className="mr-2" />
          Nouvel utilisateur
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 light:bg-white rounded-xl shadow-sm border border-gray-700 light:border-gray-200 overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full min-w-[800px]">
            <thead className="bg-gray-700 light:bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 light:text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 light:text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 light:text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Classe
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 light:text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Tâches créées
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 light:text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Tâches assignées
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-400 light:text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 light:divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700/50 light:hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <div className="font-medium text-white light:text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-400 light:text-gray-500 truncate max-w-[200px]">
                        {user.email}
                      </div>
                      {/* Mobile: Show classe and stats */}
                      <div className="md:hidden mt-2 space-y-1">
                        {user.classe && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900/30 text-blue-400 light:bg-blue-100 light:text-blue-800">
                            {user.classe.name}
                          </span>
                        )}
                        <div className="text-xs text-gray-400 light:text-gray-500">
                          Créées: {user._count?.createdTasks || 0} | Assignées: {user._count?.assignedTasks || 0}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <Select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className="w-full sm:w-auto min-w-[120px]"
                    >
                      <option value="STUDENT">Étudiant</option>
                      <option value="TEACHER">Enseignant</option>
                      <option value="ADMIN">Admin</option>
                    </Select>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-400 light:text-gray-500 hidden md:table-cell">
                    {user.classe ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 light:bg-blue-100 light:text-blue-800">
                        {user.classe.name}
                      </span>
                    ) : (
                      <span className="text-gray-500 light:text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-400 light:text-gray-500 hidden lg:table-cell">
                    {user._count?.createdTasks || 0}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-400 light:text-gray-500 hidden lg:table-cell">
                    {user._count?.assignedTasks || 0}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-1 sm:gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingUser(user)
                          setEditingRole(user.role)
                        }}
                        className="p-2"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setError('')
          setSelectedRole('STUDENT')
        }}
        title="Créer un utilisateur"
        size="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800 light:bg-red-50 light:border-red-200 rounded-lg text-sm text-red-400 light:text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <Input name="name" required placeholder="Jean Dupont" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <Input name="email" type="email" required placeholder="jean@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <Input name="password" type="password" required placeholder="••••••••" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1">
              Rôle
            </label>
            <Select 
              name="role" 
              defaultValue="STUDENT"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="STUDENT">Étudiant</option>
              <option value="TEACHER">Enseignant</option>
              <option value="ADMIN">Admin</option>
            </Select>
          </div>

          {(selectedRole === 'STUDENT' || selectedRole === 'TEACHER') && classes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1">
                Classe {selectedRole === 'TEACHER' ? '(classe principale)' : '(optionnel)'}
              </label>
              <Select name="classeId">
                <option value="">Aucune classe</option>
                {classes.map((classe) => (
                  <option key={classe.id} value={classe.id}>
                    {classe.name}
                  </option>
                ))}
              </Select>
              {selectedRole === 'TEACHER' && (
                <p className="mt-1 text-xs text-gray-400 light:text-gray-500">
                  Classe principale de l'enseignant
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1 w-full sm:w-auto">
              {isLoading ? 'Création...' : 'Créer l\'utilisateur'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false)
                setSelectedRole('STUDENT')
              }}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => {
          setEditingUser(null)
          setError('')
          setEditingRole('STUDENT')
        }}
        title="Modifier l'utilisateur"
        size="md"
      >
        {editingUser && (
          <form onSubmit={handleUpdateUser} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-800 light:bg-red-50 light:border-red-200 rounded-lg text-sm text-red-400 light:text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                required
                defaultValue={editingUser.name}
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                name="email"
                type="email"
                required
                defaultValue={editingUser.email}
                placeholder="jean@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1">
                Rôle
              </label>
              <Select
                name="role"
                defaultValue={editingUser.role}
                onChange={(e) => setEditingRole(e.target.value)}
              >
                <option value="STUDENT">Étudiant</option>
                <option value="TEACHER">Enseignant</option>
                <option value="ADMIN">Admin</option>
              </Select>
            </div>

            {((editingRole || editingUser.role) === 'STUDENT' || (editingRole || editingUser.role) === 'TEACHER') && classes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 light:text-gray-700 mb-1">
                  Classe {(editingRole || editingUser.role) === 'TEACHER' ? '(classe principale)' : null}
                </label>
                <Select name="classeId" defaultValue={editingUser.classeId || ''}>
                  <option value="">Aucune classe</option>
                  {classes.map((classe) => (
                    <option key={classe.id} value={classe.id}>
                      {classe.name}
                    </option>
                  ))}
                </Select>
                {(editingRole || editingUser.role) === 'TEACHER' && (
                  <p className="mt-1 text-xs text-gray-400 light:text-gray-500">
                    Classe principale de l'enseignant
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1 w-full sm:w-auto">
                {isLoading ? 'Mise à jour...' : 'Enregistrer'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingUser(null)
                  setEditingRole('STUDENT')
                }}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}

