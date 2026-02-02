'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Plus, X, Loader2 } from 'lucide-react'
import { createUser, type CreateUserInput } from '@/lib/actions/user'
import { toast } from 'sonner'

interface CreateClientDialogProps {
    onSuccess?: () => void
}

export function CreateClientDialog({ onSuccess }: CreateClientDialogProps) {
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState<CreateUserInput>({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
        quartier: ''
    })

    // Réinitialiser le formulaire
    const resetForm = () => {
        setFormData({
            nom: '',
            prenom: '',
            email: '',
            telephone: '',
            adresse: '',
            quartier: ''
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const result = await createUser(formData)

            if (result.success) {
                toast.success('Client créé avec succès', {
                    description: `Mot de passe temporaire : ${result.password}`
                })
                setOpen(false)
                resetForm()
                if (onSuccess) onSuccess()
            } else {
                toast.error('Erreur lors de la création', {
                    description: result.error
                })
            }
        } catch (error) {
            toast.error('Erreur inattendue')
        } finally {
            setSubmitting(false)
        }
    }

    const handleChange = (field: keyof CreateUserInput, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="w-4 h-4" />
                    Nouveau Client
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 animate-in fade-in zoom-in-95 sm:rounded-lg">
                    <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                        <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                            Ajouter un nouveau client
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-muted-foreground">
                            Créez un compte client manuellement. Un mot de passe sera généré.
                        </Dialog.Description>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
                    >
                        <X className="w-4 h-4" />
                        <span className="sr-only">Fermer</span>
                    </button>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nom</label>
                                <input
                                    required
                                    value={formData.nom}
                                    onChange={(e) => handleChange('nom', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    placeholder="Nom"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Prénom</label>
                                <input
                                    required
                                    value={formData.prenom}
                                    onChange={(e) => handleChange('prenom', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    placeholder="Prénom"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                placeholder="client@exemple.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Téléphone</label>
                            <input
                                value={formData.telephone || ''}
                                onChange={(e) => handleChange('telephone', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                placeholder="90000000"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Quartier</label>
                                <input
                                    value={formData.quartier || ''}
                                    onChange={(e) => handleChange('quartier', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    placeholder="Quartier"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Adresse</label>
                                <input
                                    value={formData.adresse || ''}
                                    onChange={(e) => handleChange('adresse', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                    placeholder="Adresse"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted"
                                disabled={submitting}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-black/90 disabled:opacity-50 flex items-center gap-2"
                            >
                                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Créer le client
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
