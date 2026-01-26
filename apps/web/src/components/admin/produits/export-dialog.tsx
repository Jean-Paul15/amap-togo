/* Composant Dialog pour export produits en Excel */

'use client'

import { useState } from 'react'
import { Download, Loader2, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

interface ExportProduitDialogProps {
  isOpen: boolean
  onClose: () => void
  totalProduits: number
}

export function ExportProduitDialog({
  isOpen,
  onClose,
  totalProduits,
}: ExportProduitDialogProps) {
  const toast = useToast()
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      /* Récupérer les données */
      const response = await fetch('/api/produits/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur export')
      }

      const { data: produits, period } = await response.json() as { data: Array<{ id: string; nom: string; prix: number; unite: string; stock: number; seuil_alerte: number; actif: boolean; disponible_semaine: boolean; categorie_id?: string; commandes_count: number }>; period: { days: number; dateDebut: string; dateFin: string } }

      /* Générer Excel avec XLSX */
      const XLSX = await import('xlsx')

      const ws = XLSX.utils.json_to_sheet(
        produits.map((p) => ({
          ID: p.id,
          Nom: p.nom,
          Catégorie: p.categorie_id,
          Prix: `${p.prix} FCFA`,
          Unité: p.unite,
          Stock: p.stock,
          'Seuil alerte': p.seuil_alerte,
          Actif: p.actif ? 'Oui' : 'Non',
          'Disponibilité semaine': p.disponible_semaine ? 'Oui' : 'Non',
          'Nb commandes': p.commandes_count,
        }))
      )

      /* Ajuster largeurs colonnes */
      const colWidths = [
        36, 20, 15, 15, 12, 8, 15, 8, 18, 15,
      ]
      ws['!cols'] = colWidths.map((w) => ({ wch: w }))

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        `Produits (${days}j)`
      )

      /* Ajouter feuille info */
      const infoWs = XLSX.utils.json_to_sheet([
        {
          'Rapport d\'export': `Produits AMAP TOGO`,
          Période: `${period.dateDebut} au ${period.dateFin} (${period.days} jours)`,
          'Nombre de produits': produits.length,
          'Date export': new Date().toLocaleString('fr-FR'),
        },
      ])
      XLSX.utils.book_append_sheet(wb, infoWs, 'Info')

      /* Télécharger */
      const nomFichier = `produits-export-${period.dateDebut}_${period.dateFin}.xlsx`
      XLSX.writeFile(wb, nomFichier)

      toast.success(
        `${produits.length} produits exportés avec succès`
      )
      onClose()
    } catch (error) {
      console.error('Erreur:', error)
      toast.error(
        error instanceof Error ? error.message : 'Erreur export'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Exporter les produits
        </h2>

        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              Export de {totalProduits} produits avec le nombre de commandes des
              {' '}{days} derniers jours
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période (jours)
            </label>
            <div className="flex gap-2">
              {[7, 30, 90, 365].map((value) => (
                <button
                  key={value}
                  onClick={() => setDays(value)}
                  className={`px-3 py-2 rounded-lg font-medium transition ${
                    days === value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {value === 7
                    ? '7j'
                    : value === 30
                      ? '30j'
                      : value === 90
                        ? '90j'
                        : '1 an'}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              value={days}
              onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
              className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
              placeholder="Ou entrer une durée custom"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className="px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 inline-flex items-center gap-2 transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Export...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Exporter
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
