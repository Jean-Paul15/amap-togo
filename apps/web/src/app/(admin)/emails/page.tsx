'use client'

import { useState, useEffect } from 'react'
import { Mail, Plus, Trash2, Send, ExternalLink, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Editor, EditorProvider } from 'react-simple-wysiwyg';
import { sendEmailAction, getMailingContacts, addMailingContact, deleteMailingContact, getAllRecipients } from '@/lib/actions/emailing'
import { cn } from '@/lib/utils'
import * as Dialog from '@radix-ui/react-dialog'

export default function EmailsPage() {
    const [activeTab, setActiveTab] = useState<'compose' | 'contacts'>('compose')

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Emailing</h1>
                    <p className="text-muted-foreground">Envoyez des newsletters et gérez vos contacts</p>
                </div>
                <a
                    href="https://mail.google.com/mail/u/?authuser=amap.togo@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white border shadow-sm rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                    <Mail className="w-4 h-4 text-red-500" />
                    Ouvrir Gmail (Réception)
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
            </div>

            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setActiveTab('compose')}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'compose' ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                >
                    Nouveau message
                </button>
                <button
                    onClick={() => setActiveTab('contacts')}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'contacts' ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                >
                    Contacts Manuels
                </button>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'compose' && <ComposeTab />}
                {activeTab === 'contacts' && <ContactsTab />}
            </div>
        </div>
    )
}

function ComposeTab() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [recipients, setRecipients] = useState<any[]>([])
    const [loadingRecipients, setLoadingRecipients] = useState(true)
    const [sending, setSending] = useState(false)
    const [showRecipients, setShowRecipients] = useState(false)

    const [subject, setSubject] = useState('')
    const [html, setHtml] = useState('')
    const [target, setTarget] = useState('all') // all, adherents, manual

    useEffect(() => {
        getAllRecipients().then(data => {
            setRecipients(data)
            setLoadingRecipients(false)
        })
    }, [])

    const getFilteredRecipients = () => {
        if (target === 'adherents') {
            return recipients.filter(r => r.type === 'adherent')
        } else if (target === 'clients') {
            return recipients.filter(r => r.type === 'client' || r.type === 'adherent')
        } else if (target === 'manual') {
            return recipients.filter(r => r.type === 'manuel')
        }
        return recipients
    }

    const filteredRecipients = getFilteredRecipients()

    const handleSend = async () => {
        if (!subject || !html) return toast.error('Veuillez remplir le sujet et le message')

        setSending(true)

        // Extraire emails
        const emails = filteredRecipients.map(r => r.email).filter(Boolean)

        if (emails.length === 0) {
            setSending(false)
            return toast.error('Aucun destinataire sélectionné')
        }

        if (!confirm(`Envoyer cet email à ${emails.length} personnes ?`)) {
            setSending(false)
            return
        }

        const res = await sendEmailAction({ to: emails, subject, html })

        if (res.success) {
            toast.success('Emails envoyés avec succès')
            setSubject('')
            setHtml('')
        } else {
            toast.error('Erreur lors de l\'envoi: ' + res.error)
        }
        setSending(false)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Sujet de l'email"
                    className="w-full px-4 py-3 text-lg font-medium border-b focus:outline-none focus:border-black transition-colors"
                />

                <div className="border rounded-lg overflow-hidden min-h-[300px]">
                    <EditorProvider>
                        <Editor value={html} onChange={(e) => setHtml(e.target.value)} containerProps={{ style: { minHeight: '300px' } }} />
                    </EditorProvider>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border h-fit space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Destinataires</label>
                    <select
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-white mb-2"
                    >
                        <option value="all">Tous ({recipients.length})</option>
                        <option value="adherents">Adhérents uniquement</option>
                        <option value="clients">Clients & Adhérents</option>
                        <option value="manual">Contacts manuels uniquement</option>
                    </select>

                    <div className="text-sm text-muted-foreground mb-2">
                        {loadingRecipients ? (
                            <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Chargement...</span>
                        ) : (
                            <span>{filteredRecipients.length} destinataire(s) sélectionné(s)</span>
                        )}
                    </div>

                    <button
                        onClick={() => setShowRecipients(!showRecipients)}
                        className="text-xs text-blue-600 hover:text-blue-800 underline block mb-3"
                    >
                        {showRecipients ? 'Masquer la liste' : 'Voir la liste des emails'}
                    </button>

                    {showRecipients && !loadingRecipients && (
                        <div className="max-h-48 overflow-y-auto bg-white border rounded p-2 text-xs text-gray-600 space-y-1">
                            {filteredRecipients.map((r, i) => (
                                <div key={i} className="flex justify-between">
                                    <span className="truncate flex-1" title={r.email}>{r.email}</span>
                                    <span className="text-gray-400 ml-2 shrink-0 capitalize">{r.type}</span>
                                </div>
                            ))}
                            {filteredRecipients.length === 0 && <p className="text-center italic opacity-50">Aucun contact</p>}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSend}
                    disabled={sending || loadingRecipients}
                    className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-black/90 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Envoyer Maintenant
                </button>
            </div>
        </div>
    )
}

function ContactsTab() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [contacts, setContacts] = useState<any[]>([])
    const [, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)

    const load = () => {
        setLoading(true)
        getMailingContacts().then(data => {
            setContacts(data)
            setLoading(false)
        })
    }

    useEffect(() => { load() }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        await addMailingContact(fd.get('email') as string, fd.get('nom') as string)
        setIsOpen(false)
        toast.success('Contact ajouté')
        load()
    }

    const handleDelete = async (id: string) => {
        if (confirm('Supprimer ?')) {
            await deleteMailingContact(id)
            load()
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <h3 className="font-semibold">Contacts ajoutés manuellement</h3>

                <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                    <Dialog.Trigger asChild>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-black text-white text-sm rounded-lg">
                            <Plus className="w-4 h-4" /> Ajouter
                        </button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white p-6 rounded-xl z-50 w-full max-w-sm">
                            <Dialog.Title className="font-bold mb-4">Ajouter un contact</Dialog.Title>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input name="email" type="email" required placeholder="Email" className="w-full p-2 border rounded" />
                                <input name="nom" type="text" placeholder="Nom (Optionnel)" className="w-full p-2 border rounded" />
                                <button className="w-full py-2 bg-black text-white rounded">Ajouter</button>
                            </form>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Nom</th>
                            <th className="px-4 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {contacts.length === 0 ? (
                            <tr><td colSpan={3} className="p-4 text-center text-gray-500">Aucun contact manuel</td></tr>
                        ) : contacts.map(c => (
                            <tr key={c.id}>
                                <td className="px-4 py-3">{c.email}</td>
                                <td className="px-4 py-3">{c.nom || '-'}</td>
                                <td className="px-4 py-3">
                                    <button onClick={() => handleDelete(c.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
