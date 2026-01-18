// Formulaire creation/edition de role
// Inclut la matrice de permissions

'use client'

import { useState, useEffect } from 'react'
import { TextInput } from '@/components/admin/forms/text-input'
import { Textarea } from '@/components/admin/forms/textarea'
import { PermissionMatrix } from './permission-matrix'
import type { Ressource, PermissionInsert, RoleAvecPermissions } from '@amap-togo/database'

interface RoleFormProps {
  role?: RoleAvecPermissions | null
  ressources: Ressource[]
  onSubmit: (data: {
    nom: string
    description: string
    permissions: PermissionInsert[]
  }) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function RoleForm({
  role,
  ressources,
  onSubmit,
  onCancel,
  loading = false,
}: RoleFormProps) {
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [permissions, setPermissions] = useState<PermissionInsert[]>([])

  useEffect(() => {
    if (role) {
      setNom(role.nom)
      setDescription(role.description || '')
      setPermissions(
        role.permissions.map((p) => ({
          role_id: p.role_id,
          ressource_id: p.ressource_id,
          peut_creer: p.peut_creer,
          peut_lire: p.peut_lire,
          peut_modifier: p.peut_modifier,
          peut_supprimer: p.peut_supprimer,
        }))
      )
    }
  }, [role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ nom, description, permissions })
  }

  const isSystemRole = role?.est_systeme === true

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Informations du role
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du role
          </label>
          <TextInput
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Gestionnaire stock"
            required
            disabled={isSystemRole}
          />
          {isSystemRole && (
            <p className="text-xs text-amber-600 mt-1">
              Les roles systeme ne peuvent pas etre renommes
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description des responsabilites de ce role..."
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Permissions
        </h3>
        <PermissionMatrix
          ressources={ressources}
          permissions={permissions}
          onChange={setPermissions}
          readOnly={isSystemRole && role?.nom === 'admin'}
        />
        {isSystemRole && role?.nom === 'admin' && (
          <p className="text-xs text-amber-600">
            Les permissions admin ne peuvent pas etre modifiees
          </p>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading || !nom.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enregistrement...' : role ? 'Mettre a jour' : 'Creer le role'}
        </button>
      </div>
    </form>
  )
}
