// Formulaire produit
// Composant presentation du formulaire avec animations

'use client'

import { useProduitForm } from '@/hooks/admin/use-produit-form'
import { useImageUpload } from '@/hooks/admin/use-image-upload'
import {
  FormField,
  TextInput,
  Textarea,
  SelectInput,
  Checkbox,
  ImageUpload,
} from '@/components/admin/forms'
import { Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const UNITES = [
  { value: 'kg', label: 'Kilogramme (kg)' },
  { value: 'botte', label: 'Botte' },
  { value: 'piece', label: 'Pièce' },
  { value: 'litre', label: 'Litre' },
  { value: 'pot', label: 'Pot' },
  { value: 'main', label: 'Main' },
  { value: 'plateau', label: 'Plateau' },
]

interface ProduitFormProps {
  produitId?: string
}

/**
 * Formulaire de creation / edition produit avec animations
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

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  }

  if (initialLoading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div 
              key={i} 
              className="h-12 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-5 sm:space-y-6"
        variants={itemVariants}
      >
        {/* Nom */}
        <motion.div variants={itemVariants}>
          <FormField label="Nom du produit" required>
            <TextInput
              type="text"
              required
              value={formData.nom}
              onChange={(e) => updateField('nom', e.target.value)}
              placeholder="Ex: Tomates bio"
            />
          </FormField>
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants}>
          <FormField label="Description">
            <Textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              placeholder="Description du produit..."
            />
          </FormField>
        </motion.div>

        {/* Image */}
        <motion.div variants={itemVariants}>
          <FormField label="Image du produit">
            <ImageUpload
              value={formData.image_url || null}
              onChange={(url) => updateField('image_url', url)}
              onUpload={uploadImage}
              uploading={uploading}
            />
          </FormField>
        </motion.div>

        {/* Categorie */}
        <motion.div variants={itemVariants}>
          <FormField label="Catégorie" htmlFor="categorie">
            <SelectInput
              id="categorie"
              value={formData.categorie_id}
              onChange={(e) => updateField('categorie_id', e.target.value)}
              options={categorieOptions}
              placeholder="Sélectionner une catégorie"
            />
          </FormField>
        </motion.div>

        {/* Prix et Unite - responsive */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
          <FormField label="Unité" required htmlFor="unite">
            <SelectInput
              id="unite"
              value={formData.unite}
              onChange={(e) => updateField('unite', e.target.value)}
              options={UNITES}
            />
          </FormField>
        </motion.div>

        {/* Stock et Seuil - responsive */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
        </motion.div>

        {/* Toggles - responsive */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 bg-gray-50/50 rounded-xl"
        >
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
        </motion.div>
      </motion.div>

      {/* Actions avec animation */}
      <motion.div 
        variants={itemVariants}
        className="mt-4 sm:mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
      >
        <Link
          href="/produits-admin"
          className="px-5 py-2.5 text-sm text-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Annuler
        </Link>
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 shadow-lg shadow-green-200"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {isEdit ? 'Modifier le produit' : 'Créer le produit'}
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.form>
  )
}
