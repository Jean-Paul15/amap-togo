'use client'

import { useEffect, useRef } from 'react'
import { incrementPageView } from '@/lib/actions/analytics'

export function PageViewTracker() {
    const initialized = useRef(false)

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true

        // Simple check session storage to avoid incrementing on every refresh
        const hasVisited = sessionStorage.getItem('has_visited_home')
        if (!hasVisited) {
            incrementPageView('/')
            sessionStorage.setItem('has_visited_home', 'true')
        }
    }, [])

    return null
}
