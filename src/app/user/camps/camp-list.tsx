'use client'

import { useState } from 'react'
import { MapPin, Calendar, Clock, CheckCircle, X, ArrowRight, User, Phone, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { bookCamp } from '@/app/actions/user-booking'

export default function CampList({ camps }: { camps: any[] }) {
    const [selectedCamp, setSelectedCamp] = useState<any>(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleBook = async (formData: FormData) => {
        if (loading) return
        setLoading(true)
        const res = await bookCamp(formData)
        setLoading(false)
        if (res?.success) {
            setSuccess(true)
            setSelectedCamp(null)
        } else {
            alert('Error booking camp: ' + res?.error)
        }
    }

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-md border border-green-100 rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-2xl"
            >
                <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-6">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Registration Successful!</h2>
                <p className="text-gray-600 text-lg mb-10 leading-relaxed max-w-md mx-auto">
                    Your spot has been confirmed. We look forward to seeing you there.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => setSuccess(false)}
                        className="px-8 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all transform hover:scale-105"
                    >
                        Book Another
                    </button>
                    <a
                        href="/user/home"
                        className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-200 hover:shadow-green-300 transition-all transform hover:scale-105"
                    >
                        Return to Dashboard
                    </a>
                </div>
            </motion.div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {camps.map((camp, index) => (
                    <motion.div
                        key={camp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg shadow-indigo-100/50 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-indigo-200/50 transition-all duration-300"
                    >
                        <div className="h-32 bg-gradient-to-br from-indigo-600 to-purple-700 p-4 flex flex-col justify-end relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full blur-xl transform -translate-x-5 translate-y-5" />

                            <h3 className="font-bold text-lg text-white relative z-10 leading-tight mb-1 shadow-black/20 text-shadow line-clamp-2">
                                {camp.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-indigo-100 text-xs relative z-10">
                                <MapPin className="h-3.5 w-3.5" />
                                <span className="truncate">{camp.venue}</span>
                            </div>
                        </div>

                        <div className="p-4 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-2 w-full">
                                    <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-1.5 rounded-md">
                                        <Calendar className="h-4 w-4 text-indigo-500" />
                                        <span className="font-medium text-sm">{new Date(camp.camp_date).toDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-1.5 rounded-md">
                                        <Clock className="h-4 w-4 text-indigo-500" />
                                        <span className="font-medium text-sm">{camp.camp_time ? camp.camp_time.slice(0, 5) : 'All Day'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 flex-grow">
                                <div className="flex items-start gap-2 text-gray-500 text-sm leading-relaxed">
                                    <Info className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                                    <p className="line-clamp-2 text-xs">{camp.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${Number(camp.price) === 0 ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                    {Number(camp.price) === 0 ? 'Free Entry' : `Rs. ${camp.price}`}
                                </span>
                                {camp.google_map_link && (
                                    <a
                                        href={camp.google_map_link}
                                        target="_blank"
                                        className="text-indigo-600 hover:text-indigo-800 text-xs font-medium hover:underline"
                                    >
                                        View Map
                                    </a>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedCamp(camp)}
                                className="w-full mt-4 bg-gray-900 text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-indigo-600 transition-colors"
                            >
                                Book Now <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {camps.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300"
                    >
                        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900">No Upcoming Camps</h3>
                        <p className="text-gray-500 mt-2">Check back later for new health events in your area.</p>
                    </motion.div>
                )}
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {selectedCamp && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCamp(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
                        >
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-start text-white">
                                <div>
                                    <h2 className="text-2xl font-bold">Registration</h2>
                                    <p className="opacity-90 text-sm mt-1">Book your spot for {selectedCamp.title.slice(0, 25)}...</p>
                                </div>
                                <button
                                    onClick={() => setSelectedCamp(null)}
                                    className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form action={handleBook} className="p-8 space-y-6">
                                <input type="hidden" name="campId" value={selectedCamp.id} />

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Details</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                        <input
                                            name="name"
                                            type="text"
                                            required
                                            placeholder="Full Name"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                                        <input
                                            name="age"
                                            type="number"
                                            required
                                            placeholder="Ex: 25"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                                        <div className="relative">
                                            <select
                                                name="gender"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 appearance-none"
                                            >
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Other</option>
                                            </select>
                                            <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                        <input
                                            name="contact"
                                            type="tel"
                                            required
                                            placeholder="Mobile Number"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing Registration...' : 'Confirm Registration'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
