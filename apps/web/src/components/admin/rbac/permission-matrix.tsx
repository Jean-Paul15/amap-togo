// Matrice de permissions ressource x CRUD
// Interface visuelle pour definir les droits d'un role

'use client'

import { Check, X } from 'lucide-react'
import type { Ressource, PermissionInsert } from '@amap-togo/database'

interface PermissionMatrixProps {
  ressources: Ressource[]
  permissions: PermissionInsert[]
  onChange: (permissions: PermissionInsert[]) => void
  readOnly?: boolean
}

const actions = [
  { key: 'peut_creer', label: 'Créer' },
  { key: 'peut_lire', label: 'Lire' },
  { key: 'peut_modifier', label: 'Modifier' },
  { key: 'peut_supprimer', label: 'Supprimer' },
] as const

type ActionKey = typeof actions[number]['key']

export function PermissionMatrix({
  ressources,
  permissions,
  onChange,
  readOnly = false,
}: PermissionMatrixProps) {
  const getPermValue = (ressourceId: string, action: ActionKey): boolean => {
    const perm = permissions.find((p) => p.ressource_id === ressourceId)
    return perm ? Boolean(perm[action]) : false
  }

  const togglePermission = (ressourceId: string, action: ActionKey) => {
    if (readOnly) return

    const newPerms = [...permissions]
    const idx = newPerms.findIndex((p) => p.ressource_id === ressourceId)

    if (idx >= 0) {
      newPerms[idx] = {
        ...newPerms[idx],
        [action]: !newPerms[idx][action],
      }
    } else {
      newPerms.push({
        role_id: '',
        ressource_id: ressourceId,
        peut_creer: action === 'peut_creer',
        peut_lire: action === 'peut_lire',
        peut_modifier: action === 'peut_modifier',
        peut_supprimer: action === 'peut_supprimer',
      })
    }

    onChange(newPerms)
  }

  const toggleAll = (ressourceId: string, enable: boolean) => {
    if (readOnly) return

    const newPerms = [...permissions]
    const idx = newPerms.findIndex((p) => p.ressource_id === ressourceId)

    const newPerm: PermissionInsert = {
      role_id: '',
      ressource_id: ressourceId,
      peut_creer: enable,
      peut_lire: enable,
      peut_modifier: enable,
      peut_supprimer: enable,
    }

    if (idx >= 0) {
      newPerms[idx] = newPerm
    } else {
      newPerms.push(newPerm)
    }

    onChange(newPerms)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">
              Ressource
            </th>
            {actions.map((a) => (
              <th key={a.key} className="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase">
                {a.label}
              </th>
            ))}
            <th className="text-center px-3 py-3 text-xs font-medium text-gray-500 uppercase">
              Tous
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {ressources.filter(r => r.actif).map((res) => {
            const allEnabled = actions.every((a) => getPermValue(res.id, a.key))
            return (
              <tr key={res.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-gray-900">{res.nom}</span>
                  {res.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{res.description}</p>
                  )}
                </td>
                {actions.map((a) => {
                  const enabled = getPermValue(res.id, a.key)
                  return (
                    <td key={a.key} className="text-center px-3 py-3">
                      <button
                        type="button"
                        onClick={() => togglePermission(res.id, a.key)}
                        disabled={readOnly}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all mx-auto ${
                          enabled
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-300'
                        } ${!readOnly && 'hover:scale-110 cursor-pointer'}`}
                      >
                        {enabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                    </td>
                  )
                })}
                <td className="text-center px-3 py-3">
                  <button
                    type="button"
                    onClick={() => toggleAll(res.id, !allEnabled)}
                    disabled={readOnly}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      allEnabled
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    } ${!readOnly && 'hover:opacity-80'}`}
                  >
                    {allEnabled ? 'Tout' : 'Aucun'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
