'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { logoutAction } from '@/app/actions/logout'

export function LogoutButton() {
  const handleLogout = async () => {
    await logoutAction()
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} title="Déconnexion" aria-label="Déconnexion">
      <LogOut size={16} className="md:mr-2" />
      <span className="hidden md:inline">Déconnexion</span>
    </Button>
  )
}
