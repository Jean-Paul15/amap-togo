import { Eye } from 'lucide-react'
import { getPageViews } from '@/lib/actions/analytics'

export async function VisitorCountDisplay({ className }: { className?: string }) {
    const views = await getPageViews('/')

    return (
        <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
            <Eye className="w-4 h-4" />
            <span>{views.toLocaleString()} visiteurs</span>
        </div>
    )
}
