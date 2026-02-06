'use client'

import { useState, useEffect } from 'react'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar as CalendarIcon, TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Loader2, X, Download, FileText, ShoppingCart, Package } from 'lucide-react'
import { toast } from 'sonner'
import { getFinancialRecords, addFinancialRecord, deleteFinancialRecord, type FinancialRecord } from '@/lib/actions/gestion'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'
import './print-styles.css'

import { getProductsForAdmin } from '@/lib/actions/admin-order'

type PeriodType = 'day' | 'week' | 'month' | 'year'

export default function GestionPage() {
    const [periodType, setPeriodType] = useState<PeriodType>('week')

    // État pour la période sélectionnée
    const [currentDay, setCurrentDay] = useState(() => {
        return format(new Date(), 'yyyy-MM-dd')
    })

    const [currentWeek, setCurrentWeek] = useState(() => {
        const now = new Date()
        const year = now.getFullYear()
        const week = getWeekNumber(now)
        return `${year}-W${week.toString().padStart(2, '0')}`
    })

    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date()
        return format(now, 'yyyy-MM')
    })

    const [currentYear, setCurrentYear] = useState(() => {
        return new Date().getFullYear().toString()
    })

    const [records, setRecords] = useState<FinancialRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [products, setProducts] = useState<any[]>([])

    // Calcule les dates de début et fin selon le type de période
    const { startDate, endDate, periodLabel } = (() => {
        if (periodType === 'day') {
            const dayDate = new Date(currentDay)
            return {
                startDate: dayDate,
                endDate: dayDate,
                periodLabel: format(dayDate, 'EEEE d MMMM yyyy', { locale: fr })
            }
        } else if (periodType === 'week') {
            const weekDate = getDateFromWeek(currentWeek)
            const start = startOfWeek(weekDate, { weekStartsOn: 1 })
            const end = endOfWeek(weekDate, { weekStartsOn: 1 })
            return {
                startDate: start,
                endDate: end,
                periodLabel: `${format(start, 'd MMM', { locale: fr })} - ${format(end, 'd MMM yyyy', { locale: fr })}`
            }
        } else if (periodType === 'month') {
            const monthDate = new Date(currentMonth + '-01')
            const start = startOfMonth(monthDate)
            const end = endOfMonth(monthDate)
            return {
                startDate: start,
                endDate: end,
                periodLabel: format(monthDate, 'MMMM yyyy', { locale: fr })
            }
        } else {
            const yearDate = new Date(parseInt(currentYear), 0, 1)
            const start = startOfYear(yearDate)
            const end = endOfYear(yearDate)
            return {
                startDate: start,
                endDate: end,
                periodLabel: currentYear
            }
        }
    })()

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setProducts(prodData as any[])
        } catch (error) {
            toast.error('Erreur lors du chargement des données: ' + error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [currentDay, currentWeek, currentMonth, currentYear, periodType])

    // Calculs de base
    const recettes = records.filter(r => r.type === 'recette').reduce((sum, r) => sum + r.montant, 0)
    const depenses = records.filter(r => r.type === 'depense').reduce((sum, r) => sum + r.montant, 0)
    const benefice = recettes - depenses

    // Statistiques détaillées
    const nbTransactions = records.length
    const nbRecettes = records.filter(r => r.type === 'recette').length
    const nbDepenses = records.filter(r => r.type === 'depense').length


    // Breakdown par catégorie
    const parCategorie = records.reduce((acc, r) => {
        const cat = r.categorie || 'Sans catégorie'
        if (!acc[cat]) {
            acc[cat] = { recettes: 0, depenses: 0, total: 0 }
        }
        if (r.type === 'recette') {
            acc[cat].recettes += r.montant
        } else {
            acc[cat].depenses += r.montant
        }
        acc[cat].total = acc[cat].recettes - acc[cat].depenses
        return acc
    }, {} as Record<string, { recettes: number; depenses: number; total: number }>)

    // Breakdown par produit
    const parProduit = records.reduce((acc, r) => {
        const produit = r.produits?.nom || 'Sans produit'
        if (!acc[produit]) {
            acc[produit] = { recettes: 0, depenses: 0, count: 0 }
        }
        if (r.type === 'recette') {
            acc[produit].recettes += r.montant
        } else {
            acc[produit].depenses += r.montant
        }
        acc[produit].count++
        return acc
    }, {} as Record<string, { recettes: number; depenses: number; count: number }>)

    // Top 5 produits par recettes
    const topProduits = Object.entries(parProduit)
        .sort(([, a], [, b]) => b.recettes - a.recettes)
        .slice(0, 5)

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
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gestion Financière</h1>
                        <p className="text-muted-foreground">Bilan détaillé des recettes et dépenses</p>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors print:hidden"
                    >
                        <Download className="w-4 h-4" />
                        Exporter en PDF
                    </button>
                </div>

                {/* Period Selector */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center print:hidden">
                    {/* Period Type Tabs */}
                    <div className="flex p-1 bg-gray-100 rounded-lg">
                        <button
                            onClick={() => setPeriodType('day')}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                                periodType === 'day' ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            Jour
                        </button>
                        <button
                            onClick={() => setPeriodType('week')}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                                periodType === 'week' ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            Semaine
                        </button>
                        <button
                            onClick={() => setPeriodType('month')}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                                periodType === 'month' ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            Mois
                        </button>
                        <button
                            onClick={() => setPeriodType('year')}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                                periodType === 'year' ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            Année
                        </button>
                    </div>

                    {/* Date Picker */}
                    <div className="flex items-center gap-3 bg-white p-2 rounded-lg border shadow-sm">
                        <CalendarIcon className="w-5 h-5 text-gray-500" />
                        {periodType === 'day' && (
                            <input
                                type="date"
                                value={currentDay}
                                onChange={(e) => setCurrentDay(e.target.value)}
                                className="border-none bg-transparent focus:ring-0 text-sm font-medium"
                            />
                        )}
                        {periodType === 'week' && (
                            <input
                                type="week"
                                value={currentWeek}
                                onChange={(e) => setCurrentWeek(e.target.value)}
                                className="border-none bg-transparent focus:ring-0 text-sm font-medium"
                            />
                        )}
                        {periodType === 'month' && (
                            <input
                                type="month"
                                value={currentMonth}
                                onChange={(e) => setCurrentMonth(e.target.value)}
                                className="border-none bg-transparent focus:ring-0 text-sm font-medium"
                            />
                        )}
                        {periodType === 'year' && (
                            <input
                                type="number"
                                value={currentYear}
                                onChange={(e) => setCurrentYear(e.target.value)}
                                min="2020"
                                max="2030"
                                className="border-none bg-transparent focus:ring-0 text-sm font-medium w-20"
                            />
                        )}
                        <span className="text-xs text-muted-foreground hidden sm:inline-block border-l pl-3">
                            {periodLabel}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                            <h3 className="text-2xl font-bold mt-2 text-gray-900">
                                {nbTransactions}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {nbRecettes} recettes • {nbDepenses} dépenses
                            </p>
                        </div>
                        <div className="p-2 rounded-lg bg-purple-50">
                            <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Par Catégorie */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-gray-50/50">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Par Catégorie
                        </h3>
                    </div>
                    <div className="p-4">
                        {Object.keys(parCategorie).length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">Aucune donnée</p>
                        ) : (
                            <div className="space-y-3">
                                {Object.entries(parCategorie).map(([cat, data]) => (
                                    <div key={cat} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{cat}</p>
                                            <p className="text-xs text-gray-500">
                                                R: {data.recettes.toLocaleString()} • D: {data.depenses.toLocaleString()}
                                            </p>
                                        </div>
                                        <span className={cn(
                                            "font-semibold text-sm",
                                            data.total >= 0 ? "text-green-600" : "text-red-600"
                                        )}>
                                            {data.total >= 0 ? '+' : ''}{data.total.toLocaleString()} FCFA
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Produits */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-gray-50/50">
                        <h3 className="font-semibold flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Top 5 Produits
                        </h3>
                    </div>
                    <div className="p-4">
                        {topProduits.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">Aucune donnée</p>
                        ) : (
                            <div className="space-y-3">
                                {topProduits.map(([produit, data], index) => (
                                    <div key={produit} className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{produit}</p>
                                            <p className="text-xs text-gray-500">{data.count} transactions</p>
                                        </div>
                                        <span className="font-semibold text-sm text-green-600">
                                            {data.recettes.toLocaleString()} FCFA
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
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
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
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
