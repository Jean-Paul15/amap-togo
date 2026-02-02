'use client'

import { useState, useEffect } from 'react'
import { startOfWeek, endOfWeek, format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar as CalendarIcon, TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { getFinancialRecords, addFinancialRecord, deleteFinancialRecord, type FinancialRecord } from '@/lib/actions/gestion'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

import { getProductsForAdmin } from '@/lib/actions/admin-order'

export default function GestionPage() {
    // État pour la semaine sélectionnée (format YYYY-Www)
    const [currentWeek, setCurrentWeek] = useState(() => {
        const now = new Date()
        // Petit hack pour avoir le format YYYY-Www
        const year = now.getFullYear()
        const week = getWeekNumber(now)
        return `${year}-W${week.toString().padStart(2, '0')}`
    })

    const [records, setRecords] = useState<FinancialRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [products, setProducts] = useState<any[]>([])

    // Calcule les dates de début et fin de la semaine sélectionnée
    const weekDate = getDateFromWeek(currentWeek)
    const startDate = startOfWeek(weekDate, { weekStartsOn: 1 }) // Lundi
    const endDate = endOfWeek(weekDate, { weekStartsOn: 1 }) // Dimanche

    const loadData = async () => {
        setLoading(true)
        try {
            const startStr = startDate.toISOString()
            const endStr = endDate.toISOString()
            const [recData, prodData] = await Promise.all([
                getFinancialRecords(startStr, endStr),
                getProductsForAdmin()
            ])
            setRecords(recData)
            setProducts(prodData as any[])
        } catch (error) {
            toast.error('Erreur lors du chargement des données')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [currentWeek])

    // Calculs
    const recettes = records.filter(r => r.type === 'recette').reduce((sum, r) => sum + r.montant, 0)
    const depenses = records.filter(r => r.type === 'depense').reduce((sum, r) => sum + r.montant, 0)
    const benefice = recettes - depenses

    const handleDelete = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
            const res = await deleteFinancialRecord(id)
            if (res.success) {
                toast.success('Supprimé')
                loadData()
            } else {
                toast.error('Erreur')
            }
        }
    }

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gestion Financière</h1>
                    <p className="text-muted-foreground">Suivi des recettes et dépenses hebdomadaires</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
                    <CalendarIcon className="w-5 h-5 text-gray-500" />
                    <input
                        type="week"
                        value={currentWeek}
                        onChange={(e) => setCurrentWeek(e.target.value)}
                        className="border-none bg-transparent focus:ring-0 text-sm font-medium"
                    />
                    <span className="text-xs text-muted-foreground hidden sm:inline-block border-l pl-3">
                        {format(startDate, 'd MMM', { locale: fr })} - {format(endDate, 'd MMM yyyy', { locale: fr })}
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                    title="Recettes"
                    amount={recettes}
                    icon={TrendingUp}
                    color="text-green-600"
                    bg="bg-green-50"
                />
                <StatsCard
                    title="Dépenses"
                    amount={depenses}
                    icon={TrendingDown}
                    color="text-red-600"
                    bg="bg-red-50"
                />
                <StatsCard
                    title="Bénéfice Net"
                    amount={benefice}
                    icon={DollarSign}
                    color={benefice >= 0 ? "text-blue-600" : "text-red-600"}
                    bg={benefice >= 0 ? "bg-blue-50" : "bg-red-50"}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-semibold">Journal des opérations</h3>
                    <AddRecordDialog
                        isOpen={isDialogOpen}
                        setIsOpen={setIsDialogOpen}
                        onSuccess={loadData}
                        defaultDate={startDate}
                        products={products}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Date</th>
                                <th className="px-4 py-3 text-left font-medium">Description</th>
                                <th className="px-4 py-3 text-left font-medium">Produit</th>
                                <th className="px-4 py-3 text-left font-medium">Catégorie</th>
                                <th className="px-4 py-3 text-left font-medium">Type</th>
                                <th className="px-4 py-3 text-right font-medium">Montant</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">Chargement...</td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">Aucune opération cette semaine</td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {format(parseISO(record.date), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="px-4 py-3 font-medium">{record.description}</td>
                                        <td className="px-4 py-3 text-blue-600 font-medium">{record.produits?.nom || '-'}</td>
                                        <td className="px-4 py-3 text-gray-500">{record.categorie || '-'}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize",
                                                record.type === 'recette' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            )}>
                                                {record.type}
                                            </span>
                                        </td>
                                        <td className={cn(
                                            "px-4 py-3 text-right font-semibold",
                                            record.type === 'recette' ? "text-green-600" : "text-red-600"
                                        )}>
                                            {record.type === 'depense' && '-'}
                                            {record.montant.toLocaleString('fr-FR')} FCFA
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleDelete(record.id)}
                                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ title, amount, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className={cn("text-2xl font-bold mt-2", color)}>
                        {amount.toLocaleString('fr-FR')} <span className="text-sm font-normal text-gray-500">FCFA</span>
                    </h3>
                </div>
                <div className={cn("p-2 rounded-lg", bg)}>
                    <Icon className={cn("w-5 h-5", color)} />
                </div>
            </div>
        </div>
    )
}

function AddRecordDialog({ isOpen, setIsOpen, onSuccess, defaultDate, products }: any) {
    const [submitting, setSubmitting] = useState(false)
    const [type, setType] = useState<'recette' | 'depense'>('depense')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        const formData = new FormData(e.currentTarget)
        const prodId = formData.get('product_id') as string

        try {
            const res = await addFinancialRecord({
                date: new Date(formData.get('date') as string).toISOString(),
                description: formData.get('description') as string,
                categorie: formData.get('categorie') as string,
                montant: Number(formData.get('montant')),
                type: type,
                product_id: prodId === 'none' ? undefined : prodId
            })

            if (res.success) {
                toast.success('Enregistré')
                setIsOpen(false)
                onSuccess()
                e.currentTarget.reset()
            } else {
                toast.error(res.error)
            }
        } catch (e) {
            toast.error('Erreur')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors">
                    <Plus className="w-4 h-4" />
                    Ajouter
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg rounded-xl animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-lg font-semibold">Nouvelle opération</Dialog.Title>
                        <Dialog.Close className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Type Switcher */}
                        <div className="flex p-1 bg-gray-100 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setType('depense')}
                                className={cn(
                                    "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                                    type === 'depense' ? "bg-white shadow text-red-600" : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                Dépense
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('recette')}
                                className={cn(
                                    "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                                    type === 'recette' ? "bg-white shadow text-green-600" : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                Recette
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                                <input required name="date" type="date" defaultValue={format(defaultDate, 'yyyy-MM-dd')} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Montant</label>
                                <input required name="montant" type="number" min="0" placeholder="0" className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Produit (Optionnel)</label>
                            <select name="product_id" className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                                <option value="none">-- Aucun --</option>
                                {products?.map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.nom}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                            <input required name="description" placeholder="Ex: Paiement Producteur X" className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Catégorie (Optionnel)</label>
                            <input name="categorie" placeholder="Ex: Transport, Vente..." className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>

                        <div className="pt-2">
                            <button type="submit" disabled={submitting} className="w-full py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-black/90 disabled:opacity-50 flex justify-center items-center gap-2">
                                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

// Helpers
function getWeekNumber(d: Date) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
}

function getDateFromWeek(weekStr: string) {
    const [year, week] = weekStr.split('-W').map(Number);
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}
