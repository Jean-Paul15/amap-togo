'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ProfileTab } from '@/components/admin/settings/profile-tab'
import { SystemTab } from '@/components/admin/settings/system-tab'
import { User, Settings as SettingsIcon } from 'lucide-react'

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'system'>('profile')

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
                <p className="text-muted-foreground">Gérez votre profil et la configuration du système</p>
            </div>

            {/* Navigation des onglets */}
            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'profile'
                            ? "border-black text-black"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    )}
                >
                    <User className="w-4 h-4" />
                    Mon Profil
                </button>
                <button
                    onClick={() => setActiveTab('system')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'system'
                            ? "border-black text-black"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    )}
                >
                    <SettingsIcon className="w-4 h-4" />
                    Configuration
                </button>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'profile' && <ProfileTab />}
                {activeTab === 'system' && <SystemTab />}
            </div>
        </div>
    )
}
