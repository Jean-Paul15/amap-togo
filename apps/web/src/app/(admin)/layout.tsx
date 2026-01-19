/**
 * Layout pour les pages admin (back-office)
 * Inclut RefineProvider et AdminLayout avec Sidebar
 */

'use client'

import { Suspense } from 'react'
import { RefineProvider } from '@/providers/refine-provider'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { AccessDeniedToast } from '@/components/admin/access-denied-toast'

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RefineProvider>
      <AdminLayout>
        <Suspense fallback={null}>
          <AccessDeniedToast />
        </Suspense>
        {children}
      </AdminLayout>
    </RefineProvider>
  )
}
