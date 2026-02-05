'use client'

import { useState, useEffect } from 'react'
import { Mail, Loader2, Save, Server, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { getSystemSettings, updateSystemSettings } from '@/lib/actions/settings'

export function SystemTab() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showPass, setShowPass] = useState(false)

    const [settings, setSettings] = useState({
        smtp_user: '',
        smtp_password: ''
    })

    useEffect(() => {
        getSystemSettings().then(data => {
            setSettings({
                smtp_user: data['smtp_user'] || '',
                smtp_password: data['smtp_password'] || ''
            })
            setLoading(false)
        })
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const res = await updateSystemSettings(settings)

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
        <div className="max-w-2xl">
            <div className="bg-white p-6 rounded-xl border">
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
