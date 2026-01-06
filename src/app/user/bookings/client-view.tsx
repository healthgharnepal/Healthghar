'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Activity, Home, Video, Tent, ExternalLink, ArrowLeft, ChevronRight, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BookingsClientView({ homeBookings, teleBookings, campBookings }: {
    homeBookings: any[],
    teleBookings: any[],
    campBookings: any[]
}) {
    const [activeTab, setActiveTab] = useState('home')

    const tabs = [
        { id: 'home', label: 'Home Checkups', icon: Home, count: homeBookings.length, color: 'text-blue-600', bg: 'bg-blue-100' },
        { id: 'telehealth', label: 'Telehealth', icon: Video, count: teleBookings.length, color: 'text-green-600', bg: 'bg-green-100' },
        { id: 'camps', label: 'Medical Camps', icon: Tent, count: campBookings.length, color: 'text-orange-600', bg: 'bg-orange-100' }
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <Link
                        href="/user/home"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-4 group"
                    >
                        <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">My Bookings</span>
                    </h1>
                    <p className="text-gray-500 mt-2">Manage and view your upcoming health appointments.</p>
                </div>

                {/* Animated Tabs */}
                <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl grid grid-cols-2 md:flex gap-2 md:gap-1 border border-white/60 shadow-sm">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center md:justify-start gap-2 whitespace-nowrap outline-none ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:bg-white/40'
                                } ${index === 2 ? 'col-span-2 md:w-auto' : ''}`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white shadow-md rounded-xl border border-gray-100"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? tab.color : 'text-gray-400'}`} />
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${activeTab === tab.id ? `${tab.bg} ${tab.color}` : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Active Tab */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"
                >
                    {activeTab === 'home' && (
                        <>
                            {homeBookings.length === 0 ? (
                                <EmptyState message="No Home Checkup bookings found." icon={Home} />
                            ) : (
                                homeBookings.map((booking, idx) => (
                                    <BookingCard key={booking.id} index={idx}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                                    <Home className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 leading-tight">
                                                        {booking.home_checkup_packages?.title || 'Home Checkup'}
                                                    </h3>
                                                    <p className="text-xs text-blue-600 font-medium mt-0.5">Home Visit</p>
                                                </div>
                                            </div>
                                            <StatusBadge status={booking.status} />
                                        </div>
                                        <div className="space-y-3">
                                            <InfoRow icon={Calendar} text={booking.preferred_date || 'Date Pending'} color="text-gray-500" />
                                            <InfoRow icon={Clock} text={booking.preferred_time || 'Time Pending'} color="text-gray-500" />
                                            <InfoRow icon={MapPin} text={booking.patient_address} color="text-gray-500" />
                                        </div>
                                    </BookingCard>
                                ))
                            )}
                        </>
                    )}

                    {activeTab === 'telehealth' && (
                        <>
                            {teleBookings.length === 0 ? (
                                <EmptyState message="No Telehealth appointments found." icon={Video} />
                            ) : (
                                teleBookings.map((booking, idx) => (
                                    <BookingCard key={booking.id} index={idx}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                                    <Video className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 leading-tight">
                                                        Dr. {booking.telehealth_doctors?.name}
                                                    </h3>
                                                    <p className="text-xs text-green-600 font-medium mt-0.5">{booking.telehealth_doctors?.specialization}</p>
                                                </div>
                                            </div>
                                            <StatusBadge status={booking.status} />
                                        </div>
                                        <div className="space-y-3">
                                            <InfoRow icon={Calendar} text={new Date(booking.booking_date).toDateString()} color="text-gray-500" />
                                            <InfoRow icon={Clock} text={booking.slot_time_start?.slice(0, 5) || 'TBD'} color="text-gray-500" />
                                        </div>
                                    </BookingCard>
                                ))
                            )}
                        </>
                    )}

                    {activeTab === 'camps' && (
                        <>
                            {campBookings.length === 0 ? (
                                <EmptyState message="No Camp registrations found." icon={Tent} />
                            ) : (
                                campBookings.map((booking, idx) => (
                                    <BookingCard key={booking.id} index={idx}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                                                    <Tent className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 leading-tight">
                                                        {booking.upcoming_camps?.title}
                                                    </h3>
                                                    <p className="text-xs text-orange-600 font-medium mt-0.5">Camp Event</p>
                                                </div>
                                            </div>
                                            <StatusBadge status={booking.status} />
                                        </div>
                                        <div className="space-y-3">
                                            <InfoRow icon={MapPin} text={booking.upcoming_camps?.venue} color="text-gray-500" />
                                            <InfoRow icon={Calendar} text={new Date(booking.upcoming_camps?.camp_date).toDateString()} color="text-gray-500" />
                                            <InfoRow icon={Clock} text={booking.upcoming_camps?.camp_time?.slice(0, 5) || 'All Day'} color="text-gray-500" />
                                        </div>

                                        {booking.upcoming_camps?.google_map_link && (
                                            <div className="mt-5 pt-4 border-t border-gray-100">
                                                <a
                                                    href={booking.upcoming_camps.google_map_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition-colors w-fit group"
                                                >
                                                    View Venue Location
                                                    <ExternalLink className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                                                </a>
                                            </div>
                                        )}
                                    </BookingCard>
                                ))
                            )}
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

function BookingCard({ children, index }: { children: React.ReactNode, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/60 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-1"
        >
            {children}
        </motion.div>
    )
}

function InfoRow({ icon: Icon, text, color }: { icon: any, text: string, color: string }) {
    return (
        <div className={`flex items-start gap-3 text-sm ${color}`}>
            <Icon className="h-4 w-4 shrink-0 mt-0.5 opacity-70" />
            <span className="font-medium">{text}</span>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        confirmed: 'bg-green-50 text-green-700 border-green-200',
        completed: 'bg-blue-50 text-blue-700 border-blue-200',
        cancelled: 'bg-red-50 text-red-700 border-red-200',
        registered: 'bg-purple-50 text-purple-700 border-purple-200'
    }
    const safeStatus = status?.toLowerCase() || 'pending'
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[safeStatus] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
            {status}
        </span>
    )
}

function EmptyState({ message, icon: Icon }: { message: string, icon: any }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-16 text-center bg-white/40 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 flex flex-col items-center justify-center"
        >
            <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Icon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-lg">{message}</p>
        </motion.div>
    )
}
