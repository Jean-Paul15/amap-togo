// Page de modification du profil

'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Phone, Loader2, Check } from 'lucide-react'
import { createClientBrowser } from '@amap-togo/database/browser'

export default function ProfilPage() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger le profil
  useEffect(() => {
    async function loadProfile() {
      const supabase = createClientBrowser()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('profils')
          .select('*')
          .eq('id', user.id)
          .single()

        const profil = data as {
          nom: string | null
          prenom: string | null
          email: string | null
          telephone: string | null
        } | null

        if (profil) {
          setFormData({
            nom: profil.nom || '',
            prenom: profil.prenom || '',
            email: profil.email || '',
            telephone: profil.telephone || '',
          })
        }
      }
      setLoading(false)
    }

    loadProfile()
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const supabase = createClientBrowser()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Non connecte')

      // Mise a jour du profil avec cast explicite
      const updateData = {
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone || null,
      }

      const { error: updateError } = await supabase
        .from('profils')
        .update(updateData as never)
        .eq('id', user.id)

      if (updateError) throw updateError

      setSaved(true)
    } catch (err) {
      setError('Erreur lors de la mise a jour')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Parametres du profil
      </h1>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
        {/* Erreur */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Succes */}
        {saved && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600 flex items-center gap-2">
            <Check className="w-4 h-4" />
            Profil mis a jour avec succes
          </div>
        )}

        {/* Nom */}
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-foreground mb-2">Nom</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="nom"
              type="text"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Prenom */}
        <div>
          <label htmlFor="prenom" className="block text-sm font-medium text-foreground mb-2">Prenom</label>
          <input
            id="prenom"
            type="text"
            value={formData.prenom}
            onChange={(e) => handleChange('prenom', e.target.value)}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Email (lecture seule) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            L'email ne peut pas etre modifie
          </p>
        </div>

        {/* Telephone */}
        <div>
          <label htmlFor="telephone" className="block text-sm font-medium text-foreground mb-2">Telephone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="telephone"
              type="tel"
              value={formData.telephone}
              onChange={(e) => handleChange('telephone', e.target.value)}
              placeholder="+228 90 XX XX XX"
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            'Enregistrer les modifications'
          )}
        </button>
      </form>
    </div>
  )
}
