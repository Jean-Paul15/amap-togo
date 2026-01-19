// Formulaire de livraison POS
// Nom, telephone, quartier, adresse, notes

'use client'

interface DeliveryInfo {
  nom: string
  prenom: string
  email: string
  telephone: string
  quartier: string
  adresse: string
  notes: string
}

interface POSDeliveryFormProps {
  values: DeliveryInfo
  onChange: (values: DeliveryInfo) => void
}

/**
 * Formulaire d'informations de livraison
 */
export function POSDeliveryForm({ values, onChange }: POSDeliveryFormProps) {
  const handleChange = (field: keyof DeliveryInfo, value: string) => {
    onChange({ ...values, [field]: value })
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-foreground">
        Informations de livraison
      </h4>

      {/* Nom et Prenom sur la meme ligne */}
      <div className="grid grid-cols-2 gap-3">
        {/* Nom */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Nom *
          </label>
          <input
            type="text"
            value={values.nom}
            onChange={(e) => handleChange('nom', e.target.value)}
            placeholder="DUPONT"
            className="
              w-full px-3 py-2
              bg-background border border-border rounded-lg
              text-sm placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-primary/20
            "
          />
        </div>

        {/* Prénom */}
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Prénom *
          </label>
          <input
            type="text"
            value={values.prenom}
            onChange={(e) => handleChange('prenom', e.target.value)}
            placeholder="Jean"
            className="
              w-full px-3 py-2
              bg-background border border-border rounded-lg
              text-sm placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-primary/20
            "
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Adresse email (optionnel)
        </label>
        <input
          type="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="votre@email.com"
          className="
            w-full px-3 py-2
            bg-background border border-border rounded-lg
            text-sm placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-primary/20
          "
        />
        <p className="text-xs text-muted-foreground mt-1">
          Pour recevoir les notifications de votre commande
        </p>
      </div>

      {/* Téléphone */}
      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Téléphone * (8 chiffres)
        </label>
        <input
          type="tel"
          value={values.telephone}
          onChange={(e) => {
            // Autoriser uniquement les chiffres, max 8
            const val = e.target.value.replace(/\D/g, '').slice(0, 8)
            handleChange('telephone', val)
          }}
          placeholder="90XXXXXX"
          maxLength={8}
          pattern="[0-9]{8}"
          className="
            w-full px-3 py-2
            bg-background border border-border rounded-lg
            text-sm placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-primary/20
          "
        />
        {values.telephone.length > 0 && values.telephone.length < 8 && (
          <p className="text-xs text-orange-500 mt-1">
            Le numéro doit contenir 8 chiffres ({values.telephone.length}/8)
          </p>
        )}
      </div>

      {/* Quartier */}
      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Quartier *
        </label>
        <input
          type="text"
          value={values.quartier}
          onChange={(e) => handleChange('quartier', e.target.value)}
          placeholder="Ex: Adidogome, Baguida..."
          className="
            w-full px-3 py-2
            bg-background border border-border rounded-lg
            text-sm placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-primary/20
          "
        />
      </div>

      {/* Adresse */}
      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Adresse complète
        </label>
        <input
          type="text"
          value={values.adresse}
          onChange={(e) => handleChange('adresse', e.target.value)}
          placeholder="Repère, rue, numéro..."
          className="
            w-full px-3 py-2
            bg-background border border-border rounded-lg
            text-sm placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-primary/20
          "
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Notes pour le livreur
        </label>
        <textarea
          value={values.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Instructions spéciales..."
          rows={2}
          className="
            w-full px-3 py-2
            bg-background border border-border rounded-lg
            text-sm placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-primary/20
            resize-none
          "
        />
      </div>
    </div>
  )
}
