// Formulaire produit
// Composant presentation du formulaire

'use client'

import { useProduitForm } from '@/hooks/use-produit-form'
import { useImageUpload } from '@/hooks/use-image-upload'
import {
  FormField,
  TextInput,
  Textarea,
  SelectInput,
  Checkbox,
  ImageUpload,
} from '@/components/forms'
import { Save } from 'lucide-react'
import Link from 'next/link'

const UNITES = [
  { value: 'kg', label: 'Kilogramme (kg)' },
  { value: 'botte', label: 'Botte' },
  { value: 'piece', label: 'Piece' },
  { value: 'litre', label: 'Litre' },
  { value: 'pot', label: 'Pot' },
  { value: 'main', label: 'Main' },
  { value: 'plateau', label: 'Plateau' },
]

interface ProduitFormProps {
  produitId?: string
}

/**
 * Formulaire de creation / edition produit
 */
export function ProduitForm({ produitId }: ProduitFormProps) {
  const { formData, categories, loading, initialLoading, isEdit, updateField, handleSubmit } =
    useProduitForm({ produitId })

  const { uploading, uploadImage } = useImageUpload({
    onSuccess: (url) => updateField('image_url', url),
    onError: (error) => alert(error),
  })

  const categorieOptions = categories.map((c) => ({
    value: c.id,
    label: c.nom,
  }))

  if (initialLoading) {
    return (
      <div className="max-w-2xl bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        {/* Nom */}
        <FormField label="Nom du produit" required>
          <TextInput
            type="text"
            required
            value={formData.nom}
            onChange={(e) => updateField('nom', e.target.value)}
            placeholder="Ex: Tomates bio"
          />
        </FormField>

        {/* Description */}
        <FormField label="Description">
          <Textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            placeholder="Description du produit..."
          />
        </FormField>

        {/* Image */}
        <FormField label="Image du produit">
          <ImageUpload
            value={formData.image_url || null}
            onChange={(url) => updateField('image_url', url)}
            onUpload={uploadImage}
            uploading={uploading}
          />
        </FormField>

        {/* Categorie */}
        <FormField label="Categorie" htmlFor="categorie">
          <SelectInput
            id="categorie"
            value={formData.categorie_id}
            onChange={(e) => updateField('categorie_id', e.target.value)}
            options={categorieOptions}
            placeholder="Selectionner une categorie"
          />
        </FormField>

        {/* Prix et Unite */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Prix (FCFA)" required>
            <TextInput
              type="number"
              required
              min={0}
              value={formData.prix}
              onChange={(e) => updateField('prix', e.target.value)}
              placeholder="1500"
            />
          </FormField>
          <FormField label="Unite" required htmlFor="unite">
            <SelectInput
              id="unite"
              value={formData.unite}
              onChange={(e) => updateField('unite', e.target.value)}
              options={UNITES}
            />
          </FormField>
        </div>

        {/* Stock et Seuil */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Stock initial" required>
            <TextInput
              type="number"
              required
              min={0}
              value={formData.stock}
              onChange={(e) => updateField('stock', e.target.value)}
              placeholder="50"
            />
          </FormField>
          <FormField label="Seuil d'alerte">
            <TextInput
              type="number"
              min={0}
              value={formData.seuil_alerte}
              onChange={(e) => updateField('seuil_alerte', e.target.value)}
              placeholder="5"
            />
          </FormField>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6">
          <Checkbox
            label="Produit actif"
            checked={formData.actif}
            onChange={(e) => updateField('actif', e.target.checked)}
          />
          <Checkbox
            label="Disponible cette semaine"
            checked={formData.disponible_semaine}
            onChange={(e) =>
              updateField('disponible_semaine', e.target.checked)
            }
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Creer'}
        </button>
        <Link
          href="/produits"
          className="px-5 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Annuler
        </Link>
      </div>
    </form>
  )
}
