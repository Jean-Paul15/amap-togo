import { createClientServer } from '@amap-togo/database/server'
import { Metadata } from 'next'
import { getGalleryMedia } from '@/lib/actions/gallery'
import { CultureGallery } from '@/components/gallery/culture-gallery'

export const metadata: Metadata = {
    title: 'Nos Cultures - AMAP TOGO',
    description: 'Découvrez en images nos champs, nos récoltes et la vie de notre ferme.',
}

export default async function CulturesPage() {
    const mediaList = await getGalleryMedia()

    return (
        <main className="min-h-screen bg-[#0a1f12] text-white overflow-hidden">
            {/* --- Header Immersif --- */}
            <div className="relative pt-32 pb-20 px-4 text-center">
                {/* Background ambiances */}
                <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-green-900/20 to-transparent pointer-events-none" />
                <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

                <h1 className="relative z-10 text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                    Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-200">Cultures</span>
                </h1>
                <p className="relative z-10 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light">
                    Plongez au cœur de nos terres. Là où la nature travaille, libre et respectée.
                </p>
            </div>

            {/* --- Galerie --- */}
            <section className="container mx-auto px-4 pb-20">
                <CultureGallery initialMedia={mediaList} />
            </section>
        </main>
    )
}
