"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
    children: React.ReactNode
    className?: string
    direction?: "up" | "down" | "left" | "right" | "none"
    delay?: number
    duration?: number
    once?: boolean
    amount?: number | "some" | "all"
    staggerChildren?: number
}

export function ScrollReveal({
    children,
    className,
    direction = "up",
    delay = 0,
    duration = 0.5,
    once = true,
    amount = 0.2,
    staggerChildren = 0
}: ScrollRevealProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once, amount })

    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
            x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
            scale: direction === "none" ? 0.95 : 1
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            transition: {
                duration,
                delay,
                ease: "easeOut",
                staggerChildren
            }
        }
    }

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            className={cn(className)}
        >
            {children}
        </motion.div>
    )
}

export function StaggerContainer({
    children,
    className,
    delay = 0,
    stagger = 0.1,
    amount = 0.2
}: {
    children: React.ReactNode
    className?: string
    delay?: number
    stagger?: number
    amount?: number
}) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount })

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                delayChildren: delay,
                staggerChildren: stagger
            }
        }
    }

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}
