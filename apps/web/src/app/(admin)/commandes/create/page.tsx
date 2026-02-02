import { CreateOrderForm } from '@/components/admin/commandes/create-order-form'

export default function CreateOrderPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Nouvelle commande</h1>
                <p className="text-muted-foreground">Importer depuis WhatsApp ou créer manuellement</p>
            </div>

            <CreateOrderForm />
        </div>
    )
}
