'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Plus, Trash2, Edit2, Check, X, AlertCircle, Calendar, ChevronRight, Info } from 'lucide-react'
import { addDoctorSlot, deleteDoctorSlot, updateDoctorSlot } from '@/app/doctor/actions'

interface Slot {
    id: string
    start_time: string
    end_time: string
    doctor_id: string
}

export default function ScheduleClient({ initialSlots }: { initialSlots: Slot[] }) {
    const [slots, setSlots] = useState<Slot[]>(initialSlots)
    const [isAdding, setIsAdding] = useState(false)
    const [editingSlot, setEditingSlot] = useState<Slot | null>(null)
    const [error, setError] = useState('')

    // Add Form State
    const [newStart, setNewStart] = useState('')
    const [newEnd, setNewEnd] = useState('')

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const formData = new FormData()
        formData.append('startTime', newStart)
        formData.append('endTime', newEnd)

        const res = await addDoctorSlot(formData)
        if (res.error) {
            setError(res.error)
        } else {
            setIsAdding(false)
            setNewStart('')
            setNewEnd('')
            window.location.reload()
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this slot?')) return
        const res = await deleteDoctorSlot(id)
        if (res.error) {
            alert(res.error)
        } else {
            setSlots(prev => prev.filter(s => s.id !== id))
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingSlot) return
        setError('')

        const formData = new FormData()
        formData.append('slotId', editingSlot.id)
        formData.append('startTime', editingSlot.start_time)
        formData.append('endTime', editingSlot.end_time)

        const res = await updateDoctorSlot(formData)
        if (res.error) {
            setError(res.error)
        } else {
            setEditingSlot(null)
            window.location.reload()
        }
    }

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-24 md:pb-12">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">My Schedule</h1>
                    <div className="flex items-center gap-2 text-gray-500 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit border border-gray-100 shadow-sm">
                        <Info className="w-4 h-4 text-blue-500" />
                        <span className="text-xs md:text-sm font-medium">Slots repeat daily</span>
                    </div>
                </div>

                {/* Desktop Add Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAdding(true)}
                    className="hidden md:flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-900/20 active:shadow-none"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Slot</span>
                </motion.button>
            </div>

            {/* Error Message Toast */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium border border-red-100 shadow-sm"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Slot Panel */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                    >
                        <motion.form
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            exit={{ y: 20 }}
                            onSubmit={handleAdd}
                            className="bg-white p-5 md:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-blue-500/5 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        New Availability
                                    </h3>
                                    <button type="button" onClick={() => setIsAdding(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Start Time</label>
                                        <div className="relative">
                                            <input
                                                type="time"
                                                required
                                                value={newStart}
                                                onChange={(e) => setNewStart(e.target.value)}
                                                className="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl px-4 py-4 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold outline-none text-xl md:text-lg appearance-none"
                                            />
                                            <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">End Time</label>
                                        <div className="relative">
                                            <input
                                                type="time"
                                                required
                                                value={newEnd}
                                                onChange={(e) => setNewEnd(e.target.value)}
                                                className="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl px-4 py-4 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold outline-none text-xl md:text-lg appearance-none"
                                            />
                                            <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col-reverse md:flex-row gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => { setIsAdding(false); setError('') }}
                                        className="w-full md:w-auto px-6 py-4 md:py-3 bg-white text-gray-600 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-8 py-4 md:py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all transform active:scale-95"
                                    >
                                        Save Slot
                                    </button>
                                </div>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Slots Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {slots.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-16 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200"
                        >
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Calendar className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No slots configured</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">Your schedule is empty. Add recurring availability slots to start receiving appointment bookings.</p>
                        </motion.div>
                    ) : (
                        slots.map((slot) => (
                            <motion.div
                                layout
                                key={slot.id}
                                variants={itemVariants}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`relative group bg-white rounded-2xl border transition-all duration-300 overflow-hidden
                                    ${editingSlot?.id === slot.id
                                        ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-xl z-10'
                                        : 'border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5'
                                    }`}
                            >
                                {editingSlot?.id === slot.id ? (
                                    // Edit Mode
                                    <form onSubmit={handleUpdate} className="p-5 md:p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Editing Slot</span>
                                            <button type="button" onClick={() => setEditingSlot(null)} className="text-gray-400 hover:text-gray-600 p-2 -mr-2">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="space-y-4 mb-6">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Start</label>
                                                <input
                                                    type="time"
                                                    required
                                                    value={editingSlot.start_time}
                                                    onChange={(e) => setEditingSlot({ ...editingSlot, start_time: e.target.value })}
                                                    className="w-full bg-gray-50 rounded-lg p-3 text-lg font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">End</label>
                                                <input
                                                    type="time"
                                                    required
                                                    value={editingSlot.end_time}
                                                    onChange={(e) => setEditingSlot({ ...editingSlot, end_time: e.target.value })}
                                                    className="w-full bg-gray-50 rounded-lg p-3 text-lg font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">Save Changes</button>
                                        </div>
                                    </form>
                                ) : (
                                    // View Mode
                                    <div className="p-5 md:p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-2.5 bg-gray-50 text-gray-900 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wide rounded-full border border-green-100">
                                                Active
                                            </span>
                                        </div>

                                        <div className="mb-6">
                                            <div className="flex items-center gap-1.5 text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                                {slot.start_time.slice(0, 5)}
                                                <span className="text-gray-300 font-light mx-1">/</span>
                                                {slot.end_time.slice(0, 5)}
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium mt-1">Daily Recurring</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEditingSlot(slot)}
                                                className="flex-1 py-2.5 md:py-2 bg-gray-50 text-gray-700 rounded-xl md:rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 active:scale-95 duration-200"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(slot.id)}
                                                className="py-2.5 md:py-2 px-3 bg-red-50 text-red-600 rounded-xl md:rounded-lg hover:bg-red-100 transition-colors active:scale-95 duration-200"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>

                {/* Add New Placeholder Card */}
                {slots.length > 0 && (
                    <motion.button
                        variants={itemVariants}
                        onClick={() => setIsAdding(true)}
                        className="min-h-[200px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-blue-300 hover:bg-blue-50/30 hover:text-blue-600 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-sm">Add Another Slot</span>
                    </motion.button>
                )}
            </motion.div>

            {/* Mobile Fixed Bottom Action Bar */}
            {!isAdding && (
                <div className="md:hidden fixed bottom-6 right-6 z-50">
                    <motion.button
                        layoutId="add-button"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 bg-black text-white px-6 py-4 rounded-full font-bold shadow-2xl shadow-black/30"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Slot</span>
                    </motion.button>
                </div>
            )}
        </div>
    )
}
