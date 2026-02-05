'use client'

import { useState, useRef } from 'react'
import { User as UserIcon, Mail, Phone, Loader2, Camera, Lock, Check } from 'lucide-react'
import { toast } from 'sonner'
import { updateProfile, updateUserPassword, updateAvatar } from '@/lib/actions/profile'
import { useUser } from '@/hooks/use-user'
import Image from 'next/image'

export function ProfileTab() {
    const { profile } = useUser()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form states
    const [formData, setFormData] = useState({
        nom: profile?.nom || '',
        prenom: profile?.prenom || '',
        telephone: profile?.telephone || '',
    })

    const [passData, setPassData] = useState({
        password: '',
        confirm: ''
    })

    const handleInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const res = await updateProfile(formData)
        if (res.success) {
            toast.success('Profil mis à jour')
        } else {
            toast.error(res.error || 'Erreur lors de la mise à jour')
        }
        setLoading(false)
    }

    const handlePassSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passData.password !== passData.confirm) {
            toast.error('Les mots de passe ne correspondent pas')
            return
        }
        if (passData.password.length < 6) {
            toast.error('Le mot de passe doit faire au moins 6 caractères')
            return
        }

        setLoading(true)
        const res = await updateUserPassword(passData.password)
        if (res.success) {
            toast.success('Mot de passe mis à jour')
            setPassData({ password: '', confirm: '' })
        } else {
            toast.error(res.error || 'Erreur changement mot de passe')
        }
        setLoading(false)
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const fd = new FormData()
        fd.append('file', file)

        const res = await updateAvatar(fd)
        if (res.success) {
            toast.success('Photo de profil mise à jour')
            // Forcer le refresh de l'image si besoin, ou attendre revalidatePath
            // Ici on attend que le hook useUser se mette à jour via revalidate ou on pourrait update localement
        } else {
            toast.error(res.error || 'Erreur upload')
        }
        setUploading(false)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne Gauche: Avatar & Info de base */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl border flex flex-col items-center text-center">
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 ring-4 ring-white shadow-lg relative">
                            {profile?.avatar_url ? (
                                <Image
                                    src={profile.avatar_url}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-600 font-bold text-4xl">
                                    {profile?.prenom?.[0]}{profile?.nom?.[0]}
                                </div>
                            )}

                            {/* Overlay au survol */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    <h2 className="mt-4 text-xl font-bold">{profile?.prenom} {profile?.nom}</h2>
                    <p className="text-sm text-gray-500">{profile?.role_id === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
                </div>
            </div>

            {/* Colonne Droite: Formulaires */}
            <div className="lg:col-span-2 space-y-8">
                {/* Infos Personnelles */}
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-emerald-600" />
                        Informations Personnelles
                    </h3>

                    <form onSubmit={handleInfoSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Prénom</label>
                                <input
                                    value={formData.prenom}
                                    onChange={e => setFormData({ ...formData, prenom: e.target.value })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nom</label>
                                <input
                                    value={formData.nom}
                                    onChange={e => setFormData({ ...formData, nom: e.target.value })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    value={profile?.email || ''}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Téléphone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    value={formData.telephone}
                                    onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                                    placeholder="+228..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sécurité */}
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-emerald-600" />
                        Sécurité
                    </h3>

                    <form onSubmit={handlePassSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
                            <input
                                type="password"
                                value={passData.password}
                                onChange={e => setPassData({ ...passData, password: e.target.value })}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Confirmer mot de passe</label>
                            <input
                                type="password"
                                value={passData.confirm}
                                onChange={e => setPassData({ ...passData, confirm: e.target.value })}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={loading || !passData.password}
                                className="bg-white border border-gray-200 text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                Modifier le mot de passe
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
