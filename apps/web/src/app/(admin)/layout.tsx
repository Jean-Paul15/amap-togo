/**
 * Layout pour les pages admin (back-office)
 * Inclut RefineProvider et AdminLayout avec Sidebar
 */

'use client'

import { RefineProvider } from '@/providers/refine-provider'
import { AdminLayout } from '@/components/admin/layout/admin-layout'

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RefineProvider>
      <AdminLayout>
        {children}
      </AdminLayout>
    </RefineProvider>
  )
}
