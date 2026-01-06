'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Bell, Search, X } from 'lucide-react'
import { Sidebar } from './components/sidebar'
import { AppointmentList } from './components/appointment-list'

export default function ClientDashboard({ doctor, bookings }: { doctor: any, bookings: any[] }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Calculate simplified stats
    const totalAppointments = bookings?.length || 0
    const todayAppointments = bookings?.filter((b: any) =>
        new Date(b.booking_date).toDateString() === new Date().toDateString()
    ).length || 0

    // Stats object
    const stats = {
        totalAppointments,
        todayAppointments,
        totalPatients: totalAppointments // Proxy
    }

    return (
        <div className="min-h-screen bg-gray-50/50 flex text-gray-900 font-sans">

            {/* --- DESKTOP SIDEBAR --- */}
            {/* Hidden on mobile, block on md/desktop */}
            <aside className="hidden md:block w-72 flex-shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100 z-50">
                <Sidebar
                    doctorName={doctor.name}
                    doctorSpecialization={doctor.specialization}
                    stats={stats}
                />
            </aside>


            {/* --- MOBILE SIDEBAR DRAWER --- */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl z-50 md:hidden"
                        >
                            <div className="relative h-full">
                                {/* Close Button */}
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <Sidebar
                                    doctorName={doctor.name}
                                    doctorSpecialization={doctor.specialization}
                                    stats={stats}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>


            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 hover:text-black rounded-lg transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="md:hidden">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">H</div>
                        </div>

                        <div className="hidden md:block">
                            <h1 className="text-lg font-bold text-gray-900">Good Morning, Dr. {doctor.name.split(' ')[0]}</h1>
                            <p className="text-xs text-gray-500">Here's what's happening today.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 w-64">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                className="bg-transparent border-none text-sm focus:ring-0 w-full text-gray-800 placeholder:text-gray-400"
                            />
                        </div>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-100">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-bold text-gray-900">{doctor.name}</p>
                                <p className="text-xs text-gray-500">{doctor.specialization}</p>
                            </div>
                            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                {doctor.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Area */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* Mobile Welcome (Since desktop has it in header) */}
                        <div className="md:hidden mb-4">
                            <h1 className="text-xl font-bold text-gray-900">Good Morning, Dr. {doctor.name.split(' ')[0]}</h1>
                            <p className="text-sm text-gray-500">Here's what's happening today.</p>
                        </div>

                        {/* Recent Appointments */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <AppointmentList appointments={bookings} />
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    )
}
