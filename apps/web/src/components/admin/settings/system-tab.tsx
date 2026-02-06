'use client'

import { useState, useEffect } from 'react'
import { Mail, Loader2, Save, Server, Eye, EyeOff, Palette } from 'lucide-react'
import { toast } from 'sonner'
import { getSystemSettings, updateSystemSettings } from '@/lib/actions/settings'
import { ImageUpload } from '@/components/ui/image-upload'

export function SystemTab() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showPass, setShowPass] = useState(false)

    const [settings, setSettings] = useState({
        smtp_user: '',
        smtp_password: '',
        site_logo_url: '',
        site_hero_url: '',
        site_bg_color: '#0a1f12', // Vert foncé par défaut
        site_bg_image_url: '',
        site_bg_video_url: ''
    })

    useEffect(() => {
        getSystemSettings().then(data => {
            setSettings({
                smtp_user: data['smtp_user'] || '',
                smtp_password: data['smtp_password'] || '',
                site_logo_url: data['site_logo_url'] || '',
                site_hero_url: data['site_hero_url'] || '',
                site_bg_color: data['site_bg_color'] || '#0a1f12',
                site_bg_image_url: data['site_bg_image_url'] || '',
                site_bg_video_url: data['site_bg_video_url'] || ''
            })
            setLoading(false)
        })
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        // On ne sauvegarde que les champs texte ici, les images sont gérées par ImageUpload direct
        const textSettings = {
            smtp_user: settings.smtp_user,
            smtp_password: settings.smtp_password,
            site_bg_color: settings.site_bg_color
        }

        const res = await updateSystemSettings(textSettings)

        if (res.success) {
            toast.success('Configuration enregistrée')
        } else {
            toast.error('Erreur lors de la sauvegarde')
        }
        setSaving(false)
    }

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Colonne Gauche: SMTP (Existant) */}
            <div className="bg-white p-6 rounded-xl border h-fit">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    Configuration Emailing (SMTP)
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                    Configurez le compte Gmail utilisé pour envoyer les emails transactionnels et newsletters.
                    Nécessite un "Mot de passe d'application" Google.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email (Utilisateur SMTP)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                value={settings.smtp_user}
                                onChange={e => setSettings({ ...settings, smtp_user: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                placeholder="exemple@gmail.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Mot de passe d'application</label>
                        <div className="relative">
                            <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showPass ? "text" : "password"}
                                value={settings.smtp_password}
                                onChange={e => setSettings({ ...settings, smtp_password: e.target.value })}
                                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none font-mono"
                                placeholder="xxxx xxxx xxxx xxxx"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Ne pas utiliser votre mot de passe Gmail habituel. Générez un mot de passe d'application dans votre compte Google.
                        </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Sauvegarder la configuration
                        </button>
                    </div>
                </form>
            </div>

            {/* Colonne Droite: Identité Visuelle */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-purple-600" />
                        Identité Visuelle
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Personnalisez les visuels principaux du site.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                        <ImageUpload
                            label="Logo du site"
                            settingKey="site_logo_url"
                            currentImageUrl={settings.site_logo_url}
                            aspectRatio="square"
                        />

                        <ImageUpload
                            label="Image d'accueil (Hero)"
                            settingKey="site_hero_url"
                            currentImageUrl={settings.site_hero_url}
                            aspectRatio="video"
                        />
                    </div>
                </div>

                {/* Nouvelle section: Arrière-plan de l'accueil */}
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-indigo-600" />
                        Arrière-plan de l'accueil
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Choisissez une couleur, une image ou une vidéo pour l'arrière-plan de la page d'accueil.
                    </p>

                    <div className="space-y-6">
                        {/* Color Picker */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Couleur de fond</label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="color"
                                    value={settings.site_bg_color}
                                    onChange={e => setSettings({ ...settings, site_bg_color: e.target.value })}
                                    className="w-16 h-10 rounded border cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={settings.site_bg_color}
                                    onChange={e => setSettings({ ...settings, site_bg_color: e.target.value })}
                                    className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm"
                                    placeholder="#0a1f12"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Utilisé si aucune image/vidéo n'est définie
                            </p>
                        </div>

                        {/* Background Image */}
                        <ImageUpload
                            label="Image de fond (optionnel)"
                            settingKey="site_bg_image_url"
                            currentImageUrl={settings.site_bg_image_url}
                            aspectRatio="video"
                        />

                        {/* Background Video */}
                        <ImageUpload
                            label="Vidéo de fond (optionnel)"
                            settingKey="site_bg_video_url"
                            currentImageUrl={settings.site_bg_video_url}
                            aspectRatio="video"
                        />

                        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
                            <strong>Priorité d'affichage :</strong> Vidéo → Image → Couleur
                        </div>
                    </div>
                </div>
            </div>

            {/* Zone de test potentielle */}
            <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100 flex gap-2">
                <div className="font-bold">Note:</div>
                <div>
                    Pour tester la configuration, rendez-vous dans l'onglet "Emails" et envoyez-vous un message de test.
                </div>
            </div>
        </div>
    )
}
