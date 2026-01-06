'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowRight, Calendar, User, Clock, CheckCircle, Stethoscope, Heart, Brain, Microscope, Activity, ChevronLeft, ShieldCheck, Clipboard, Baby, Sun, MessageCircle, Droplet, Scissors, Bone, Eye, Scan, ScanLine, Disc
}
    from 'lucide-react'
import { bookTelehealth } from '@/app/actions/user-booking'
import { cn } from '@/lib/utils'

// Category Icons Mapping
const categoryIcons: any = {
    'Primary Care': Stethoscope,
    'Medical Specialists': Heart,
    'Surgical Specialists': Activity,
    'Diagnostic Specialists': Microscope
}

const specialistIcons: any = {
    'Physicians': User,
    'Internists': Clipboard,
    'Pediatricians': Baby,
    'Cardiologists': Heart,
    'Dermatologists': Sun,
    'Neurologists': Brain,
    'Oncologists': Microscope,
    'Gastroenterologists': Activity, // Fallback
    'Psychiatrists': MessageCircle,
    'Endocrinologists': Droplet,
    'General Surgeons': Scissors,
    'Orthopedic Surgeons': Bone,
    'Neurosurgeons': Brain,
    'Ophthalmologists': Eye,
    'Radiologists': Scan,
    'X-ray': ScanLine,
    'CT-scan': Scan,
    'MRI': Disc,
}

const categories = {
    'Primary Care': ['Physicians', 'Internists', 'Pediatricians'],
    'Medical Specialists': ['Cardiologists', 'Dermatologists', 'Neurologists', 'Oncologists', 'Gastroenterologists', 'Psychiatrists', 'Endocrinologists'],
    'Surgical Specialists': ['General Surgeons', 'Orthopedic Surgeons', 'Neurosurgeons', 'Ophthalmologists'],
    'Diagnostic Specialists': ['Radiologists', 'X-ray', 'CT-scan', 'MRI']
}

export default function TelehealthBookingFlow({ doctors, slots }: { doctors: any[], slots: any[] }) {
    const [step, setStep] = useState(1) // 1: Cat, 2: Doc, 3: Slot, 4: Details, 5: Success
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedSpec, setSelectedSpec] = useState('')
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
    const [selectedSlot, setSelectedSlot] = useState<any>(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Generate dates (Next 14 days)
    const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() + i)
        return d.toISOString().split('T')[0]
    })

    const filteredDoctors = doctors.filter(d => d.category === selectedCategory && d.specialization === selectedSpec)
    const SelectedIcon = categoryIcons[selectedCategory] || Stethoscope

    const handleBook = async (formData: FormData) => {
        setIsSubmitting(true)
        const res = await bookTelehealth(formData)
        setIsSubmitting(false)
        if (res?.success) {
            setStep(5)
        } else {
            alert('Error booking: ' + res?.error)
        }
    }

    const steps = [
        { id: 1, label: 'Specialty' },
        { id: 2, label: 'Doctor' },
        { id: 3, label: 'Time' },
        { id: 4, label: 'Details' }
    ]

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Stepper */}
            {step < 5 && (
                <div className="mb-8 md:mb-12">
                    <div className="flex items-center justify-between relative max-w-2xl mx-auto px-4">
                        {/* Connecting Line */}
                        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 -z-10 rounded-full">
                            <motion.div
                                className="h-full bg-blue-600 rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: `${((step - 1) / 3) * 100}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>

                        {steps.map((s) => (
                            <div key={s.id} className="flex flex-col items-center gap-2 bg-gray-50/50 px-2 backdrop-blur-sm rounded-xl">
                                <motion.div
                                    className={cn(
                                        "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold border-2 transition-colors duration-300 relative z-10",
                                        step >= s.id
                                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                                            : "bg-white text-gray-400 border-gray-200"
                                    )}
                                    initial={false}
                                    animate={{
                                        scale: step === s.id ? 1.1 : 1,
                                        transition: { type: "spring", stiffness: 300, damping: 20 }
                                    }}
                                >
                                    {step > s.id ? <CheckCircle className="h-4 w-4 md:h-5 md:w-5" /> : s.id}
                                </motion.div>
                                <span className={cn(
                                    "text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-colors duration-300",
                                    step >= s.id ? "text-blue-900" : "text-gray-400"
                                )}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {/* Step 1: Category & Specialization */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6 md:space-y-8"
                    >
                        {!selectedCategory ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                                {Object.keys(categories).map((cat, idx) => {
                                    const Icon = categoryIcons[cat] || Stethoscope
                                    // @ts-ignore
                                    const specialists = categories[cat].join(', ')
                                    return (
                                        <motion.button
                                            key={cat}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            onClick={() => setSelectedCategory(cat)}
                                            className="group relative bg-white/60 backdrop-blur-md p-4 md:p-6 rounded-3xl border border-white/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all text-left flex flex-col justify-between overflow-hidden min-h-[160px] md:min-h-[180px]"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            <div className="relative z-10">
                                                <div className="p-3 bg-blue-50 group-hover:bg-blue-600 rounded-2xl w-fit transition-all duration-300 mb-3 md:mb-4 shadow-sm group-hover:shadow-lg group-hover:shadow-blue-600/30 group-hover:scale-110">
                                                    <Icon className="h-5 w-5 md:h-6 md:w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                                </div>
                                                <h3 className="font-bold text-base md:text-lg text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{cat}</h3>
                                                <div className="w-8 h-1 bg-blue-100 group-hover:bg-blue-500 rounded-full transition-all duration-300 group-hover:w-16 mb-2 md:mb-4" />
                                            </div>

                                            <p className="text-[10px] md:text-xs text-gray-500 relative z-10 line-clamp-2">
                                                {specialists}
                                            </p>
                                        </motion.button>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto">
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className="mb-6 md:mb-8 group flex items-center gap-2 text-xs md:text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors bg-white/50 w-fit px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-sm border border-transparent hover:border-blue-100 shadow-sm"
                                >
                                    <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 group-hover:-translate-x-1 transition-transform" />
                                    Change Category
                                </button>

                                <div className="flex items-center gap-4 mb-6 md:mb-8">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
                                        <SelectedIcon className="h-5 w-5 md:h-6 md:w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{selectedCategory}</h2>
                                        <p className="text-xs md:text-base text-gray-500">Select a specialized doctor</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                    {/* @ts-ignore */}
                                    {categories[selectedCategory].map((spec, idx) => {
                                        const SpecIcon = specialistIcons[spec] || Stethoscope
                                        return (
                                            <motion.button
                                                key={spec}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.05 }}
                                                onClick={() => { setSelectedSpec(spec); setStep(2) }}
                                                className="group flex items-center justify-between p-3 md:p-4 bg-white hover:bg-blue-50/50 rounded-2xl border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all duration-300"
                                            >
                                                <div className="flex items-center gap-3 md:gap-4">
                                                    <div className="p-2 md:p-2.5 bg-gray-50 group-hover:bg-white rounded-xl text-gray-600 group-hover:text-blue-600 transition-colors shadow-sm">
                                                        <SpecIcon className="h-4 w-4 md:h-5 md:w-5" />
                                                    </div>
                                                    <span className="font-semibold text-sm md:text-base text-gray-700 group-hover:text-gray-900 text-left">{spec}</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent group-hover:bg-white text-gray-300 group-hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 shadow-sm translate-x-2 group-hover:translate-x-0">
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </motion.button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Step 2: Select Doctor */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-5xl mx-auto"
                    >
                        <button onClick={() => setStep(1)} className="mb-4 md:mb-6 group flex items-center gap-2 text-xs md:text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors bg-white/50 w-fit px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-sm border border-transparent hover:border-blue-100 shadow-sm">
                            <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to {selectedCategory}
                        </button>

                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <div>
                                <h2 className="text-xl md:text-3xl font-bold text-gray-900">Available Doctors</h2>
                                <p className="text-xs md:text-base text-gray-500 mt-1">Specialists in <span className="font-semibold text-blue-600">{selectedSpec}</span></p>
                            </div>
                            <div className="hidden md:block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                                {filteredDoctors.length} Doctors Found
                            </div>
                        </div>

                        {filteredDoctors.length === 0 ? (
                            <div className="text-center py-16 md:py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
                                </div>
                                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">No doctors available</h3>
                                <p className="text-gray-500 text-xs md:text-sm max-w-sm mx-auto px-4">
                                    We couldn't find any doctors for this specialization at the moment. Please try another category.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {filteredDoctors.map((doc, idx) => (
                                    <motion.div
                                        key={doc.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white rounded-3xl p-4 md:p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
                                    >
                                        <div className="flex items-start justify-between mb-4 md:mb-6">
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 font-bold text-xl md:text-2xl shadow-inner uppercase">
                                                {doc.name.charAt(0)}
                                            </div>
                                            <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 h-fit">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                Available
                                            </div>
                                        </div>

                                        <div className="mb-4 md:mb-6 flex-grow">
                                            <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">Dr. {doc.name}</h3>
                                            <p className="text-xs md:text-sm font-medium text-blue-600 mb-3">{doc.specialization}</p>
                                            <div className="w-full h-px bg-gray-50 mb-3" />
                                            <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-3">{doc.description}</p>
                                        </div>

                                        <button
                                            onClick={() => { setSelectedDoctor(doc); setStep(3) }}
                                            className="w-full py-2.5 md:py-3 rounded-xl bg-gray-900 text-white font-semibold text-sm shadow-lg shadow-gray-900/10 hover:bg-blue-600 hover:shadow-blue-600/20 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                        >
                                            Book Appointment
                                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Step 3: Select Date & Time */}
                {step === 3 && selectedDoctor && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-4xl mx-auto"
                    >
                        <button onClick={() => setStep(2)} className="mb-4 md:mb-6 group flex items-center gap-2 text-xs md:text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors bg-white/50 w-fit px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-sm border border-transparent hover:border-blue-100 shadow-sm">
                            <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 group-hover:-translate-x-1 transition-transform" />
                            Change Doctor
                        </button>

                        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                            {/* Doctor Summary Card */}
                            <div className="md:col-span-1">
                                <div className="bg-white rounded-3xl p-4 md:p-6 border border-gray-100 shadow-lg shadow-gray-100 sticky top-24">
                                    <div className="flex items-center gap-4 mb-4 md:mb-6">
                                        <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 font-bold text-lg md:text-2xl flex-shrink-0">
                                            {selectedDoctor.name.charAt(0)}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-base md:text-lg text-gray-900 leading-tight">Dr. {selectedDoctor.name}</h3>
                                            <p className="text-xs md:text-sm text-blue-600 font-medium mt-1">{selectedDoctor.specialization}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:space-y-3">
                                        <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600 bg-gray-50 p-2 md:p-3 rounded-xl border border-gray-100/50">
                                            <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-400 shrink-0" />
                                            <span>30 mins</span>
                                        </div>
                                        <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600 bg-gray-50 p-2 md:p-3 rounded-xl border border-gray-100/50">
                                            <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-400 shrink-0" />
                                            <span>Verified</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs md:text-sm text-gray-500 font-medium">Consultation Fee</span>
                                            <span className="text-base md:text-lg font-bold text-gray-900">₹500</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Interaction Area */}
                            <div className="md:col-span-2 space-y-6 md:space-y-8">
                                {/* Date Selection */}
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                                        <div className="p-1 md:p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Calendar className="h-3 w-3 md:h-4 md:w-4" /></div>
                                        Select Date
                                    </h3>
                                    <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 md:pb-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent -mx-4 px-4 md:mx-0 md:px-0">
                                        {dates.map(date => {
                                            const d = new Date(date)
                                            const isSelected = selectedDate === date
                                            return (
                                                <button
                                                    key={date}
                                                    onClick={() => { setSelectedDate(date); setSelectedSlot(null) }}
                                                    className={cn(
                                                        "min-w-[60px] md:min-w-[72px] p-2 md:p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 group relative overflow-hidden",
                                                        isSelected
                                                            ? "border-black bg-black text-white shadow-lg shadow-black/20"
                                                            : "border-gray-100 bg-white text-gray-500 hover:border-blue-300 hover:shadow-md"
                                                    )}
                                                >
                                                    <span className={cn("text-[9px] md:text-[10px] font-bold uppercase tracking-wider", isSelected ? "text-white/60" : "text-gray-400")}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                    <span className="text-lg md:text-xl font-bold">{d.getDate()}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Slot Selection */}
                                <AnimatePresence mode="wait">
                                    {selectedDate ? (
                                        <motion.div
                                            key="slots"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            <h3 className="font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                                                <div className="p-1 md:p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Clock className="h-3 w-3 md:h-4 md:w-4" /></div>
                                                Select Time Slot
                                            </h3>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                                                {slots.filter(s => s.doctor_id === selectedDoctor.id && s.is_active).map((slot, idx) => (
                                                    <motion.button
                                                        key={slot.id}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        onClick={() => { setSelectedSlot(slot); setStep(4) }}
                                                        className="py-2 md:py-3 px-3 rounded-xl border border-blue-100 bg-blue-50/30 text-blue-700 font-semibold hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/20 active:scale-95 transition-all text-xs md:text-sm flex items-center justify-center gap-2"
                                                    >
                                                        <Clock className="h-3 w-3 md:hidden opacity-50" />
                                                        {slot.start_time.slice(0, 5)}
                                                    </motion.button>
                                                ))}
                                            </div>

                                            {slots.filter(s => s.doctor_id === selectedDoctor.id && s.is_active).length === 0 && (
                                                <div className="text-center py-8 md:py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                    <p className="text-gray-400 text-xs md:text-sm">No slots available for this date.</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <div className="h-24 md:h-32 flex items-center justify-center text-gray-400 text-xs md:text-sm italic border-2 border-dashed border-gray-100 rounded-2xl">
                                            Select a date to view available time slots
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 4: Confirm Details */}
                {step === 4 && selectedSlot && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto"
                    >
                        <button onClick={() => setStep(3)} className="mb-4 md:mb-6 group flex items-center gap-2 text-xs md:text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors bg-white/50 w-fit px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-sm border border-transparent hover:border-blue-100 shadow-sm">
                            <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Schedule
                        </button>

                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 md:p-8 text-white relative overflow-hidden">
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold mb-1">Confirm Booking</h2>
                                        <p className="text-gray-400 text-xs md:text-sm">Review functionality details</p>
                                    </div>
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                                        <Clipboard className="h-5 w-5 md:h-6 md:w-6 text-white" />
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            </div>

                            <div className="p-5 md:p-8">
                                <div className="bg-blue-50/50 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-blue-100 space-y-3 md:space-y-4">
                                    <div className="flex justify-between items-center pb-3 md:pb-4 border-b border-blue-100/50">
                                        <span className="text-gray-500 text-xs md:text-sm font-medium">Specialist</span>
                                        <div className="text-right">
                                            <p className="font-bold text-sm md:text-base text-gray-900">Dr. {selectedDoctor.name}</p>
                                            <p className="text-[10px] md:text-xs text-blue-600">{selectedDoctor.specialization}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 md:pb-4 border-b border-blue-100/50">
                                        <span className="text-gray-500 text-xs md:text-sm font-medium">Date & Time</span>
                                        <div className="text-right">
                                            <p className="font-bold text-sm md:text-base text-gray-900">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                            <p className="text-[10px] md:text-xs text-blue-600 font-bold">{selectedSlot.start_time.slice(0, 5)}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-xs md:text-sm font-medium">Fee</span>
                                        <span className="font-bold text-green-600 text-base md:text-lg">₹500</span>
                                    </div>
                                </div>

                                <form action={handleBook} className="space-y-4 md:space-y-6">
                                    <input type="hidden" name="doctorId" value={selectedDoctor.id} />
                                    <input type="hidden" name="bookingDate" value={selectedDate} />
                                    <input type="hidden" name="slotTime" value={selectedSlot.start_time} />

                                    <div className="grid grid-cols-2 gap-4 md:gap-5">
                                        <div className="col-span-2 space-y-1.5 md:space-y-2">
                                            <label className="text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-wide">Patient Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                                                <input name="name" type="text" required className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 md:py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="Enter full name" />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 md:space-y-2">
                                            <label className="text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-wide">Age</label>
                                            <input name="age" type="number" required className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 md:py-3 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="Age" />
                                        </div>

                                        <div className="space-y-1.5 md:space-y-2">
                                            <label className="text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-wide">Gender</label>
                                            <select name="gender" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 md:py-3 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer">
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Other</option>
                                            </select>
                                        </div>

                                        <div className="col-span-2 space-y-1.5 md:space-y-2">
                                            <label className="text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-wide">Reason for Visit (Optional)</label>
                                            <textarea name="notes" rows={2} className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 md:py-3 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all resize-none" placeholder="Briefly describe your symptoms..." />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-black text-white py-3 md:py-4 rounded-xl font-bold text-sm md:text-base hover:bg-gray-800 hover:shadow-xl hover:shadow-black/20 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>Processing...</>
                                        ) : (
                                            <>
                                                <ShieldCheck className="h-5 w-5" /> Confirm & Pay
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 5: Success */}
                {step === 5 && (
                    <motion.div
                        key="step5"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto text-center pt-12 pb-20"
                    >
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                            >
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </motion.div>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Booking Confirmed!</h2>
                        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                            Your telehealth appointment has been successfully scheduled. You will receive a confirmation shortly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/user/home" className="w-full sm:w-auto bg-gray-100 text-gray-900 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm">
                                Back to Dashboard
                            </a>
                            <a href="/user/bookings" className="w-full sm:w-auto bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 hover:shadow-lg transition-all shadow text-sm">
                                View My Bookings
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
