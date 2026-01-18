// Champ de formulaire reutilisable
// Input avec label et styles standardises

interface FormFieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
  htmlFor?: string
}

/**
 * Wrapper de champ de formulaire avec label
 */
export function FormField({
  label,
  required = false,
  children,
  htmlFor,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && '*'}
      </label>
      {children}
    </div>
  )
}
