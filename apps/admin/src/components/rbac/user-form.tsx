// Formulaire creation utilisateur
// Cree l'utilisateur via Supabase Auth + profil

'use client'

import { useState } from 'react'
import { TextInput } from '@/components/forms/text-input'
import { SelectInput } from '@/components/forms/select-input'
import type { Role } from '@amap-togo/database'

interface UserFormData {
  email: string
  password: string
  nom: string
  prenom: string
  telephone: string
  role_id: string
}

interface UserFormProps {
  roles: Role[]
  onSubmit: (data: UserFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function UserForm({
  roles,
  onSubmit,
  onCancel,
  loading = false,
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
    role_id: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (field: keyof UserFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData((prev) => ({ ...prev, password }))
    setShowPassword(true)
  }

  const roleOptions = roles
    .filter((r) => r.actif)
    .map((r) => ({ value: r.id, label: r.nom }))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Informations personnelles
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prenom
            </label>
            <TextInput
              value={formData.prenom}
              onChange={handleChange('prenom')}
              placeholder="Jean"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <TextInput
              value={formData.nom}
              onChange={handleChange('nom')}
              placeholder="Dupont"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telephone
          </label>
          <TextInput
            value={formData.telephone}
            onChange={handleChange('telephone')}
            placeholder="+228 90 00 00 00"
            type="tel"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Compte utilisateur
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <TextInput
            value={formData.email}
            onChange={handleChange('email')}
            placeholder="jean.dupont@email.com"
            type="email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <div className="flex gap-2">
            <TextInput
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="Minimum 8 caracteres"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              className="flex-1"
            />
            <button
              type="button"
              onClick={generatePassword}
              className="px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
            >
              Generer
            </button>
          </div>
          {showPassword && formData.password && (
            <p className="text-xs text-gray-500 mt-1">
              Mot de passe: <code className="bg-gray-100 px-1 rounded">{formData.password}</code>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <SelectInput
            value={formData.role_id}
            onChange={handleChange('role_id')}
            required
            options={roleOptions}
            placeholder="Selectionner un role"
          />
        </div>
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
          disabled={loading || !formData.email || !formData.password || !formData.role_id}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creation...' : 'Creer l\'utilisateur'}
        </button>
      </div>
    </form>
  )
}
