'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, User, ChevronRight, Video } from 'lucide-react'

interface Appointment {
    id: string
    patient_name: string
    patient_age: number | string
    patient_gender?: string // Optional if not available
    booking_date: string
    slot_time_start: string
    status?: string // 'pending', 'confirmed', etc.
    telehealth_slots?: {
        start_time: string
        end_time: string
    }
}

export function AppointmentList({ appointments }: { appointments: Appointment[] }) {
    if (!appointments || appointments.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-gray-900 font-semibold">No Upcoming Appointments</h3>
                <p className="text-gray-500 text-sm">You are all caught up for today.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Upcoming Appointments</h2>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                    {appointments.length} Total
                </span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-900 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Patient</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {appointments.map((apt, index) => (
                            <motion.tr
                                key={apt.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-blue-50/50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                            {apt.patient_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{apt.patient_name}</p>
                                            <p className="text-xs text-gray-500">{apt.patient_age} yrs</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">{apt.booking_date}</span>
                                        <span className="text-xs text-gray-500">{apt.slot_time_start.slice(0, 5)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        Confirmed
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1">
                                        <Video className="w-3.5 h-3.5" /> Join
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100">
                {appointments.map((apt, index) => (
                    <motion.div
                        key={apt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 active:bg-gray-50"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {apt.patient_name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{apt.patient_name}</h4>
                                    <p className="text-xs text-gray-500">{apt.patient_age} years old</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-[10px] font-bold uppercase tracking-wide border border-green-100">
                                Confirmed
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 bg-gray-50 p-2.5 rounded-lg">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>{new Date(apt.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="w-px h-3 bg-gray-300"></div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{apt.slot_time_start.slice(0, 5)}</span>
                            </div>
                        </div>

                        <button className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm shadow-blue-200 shadow-md active:scale-[0.98] transition-all">
                            <Video className="w-4 h-4" /> Join Consultation
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
