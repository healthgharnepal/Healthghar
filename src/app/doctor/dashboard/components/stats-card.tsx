'use client'

import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    colorClass: string // e.g., 'bg-blue-100 text-blue-600'
}

export function StatsCard({ title, value, icon: Icon, description, colorClass }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between"
        >
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                {description && (
                    <p className="text-xs text-gray-400 mt-1">{description}</p>
                )}
            </div>
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <Icon className="w-5 h-5" />
            </div>
        </motion.div>
    )
}
