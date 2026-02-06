// Component to display the weekly products list on the public homepage
// Shows the active list pasted by admin from WhatsApp or other sources

'use client'

import { useEffect, useState } from 'react'
import { ClipboardList, Calendar } from 'lucide-react'
import { getActiveListeProduits, type ListeProduits } from '@/lib/actions/liste-produits'

export function ListeProduitsSemaine() {
    const [liste, setListe] = useState<ListeProduits | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadListe()
    }, [])

    const loadListe = async () => {
        const data = await getActiveListeProduits()
        setListe(data)
        setLoading(false)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
            </div>
        )
    }

    if (!liste) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune liste disponible pour cette semaine</p>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-600 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Produits de la semaine</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(liste.date_publication)}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {liste.contenu}
                </div>
            </div>
        </div>
    )
}
