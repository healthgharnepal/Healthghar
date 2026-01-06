'use client'

import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, MapPin, Calendar, User, CheckCircle2, Clock } from 'lucide-react'
import { bookHomeCheckup } from '@/app/actions/user-booking'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TimePicker } from '@/components/ui/time-picker'

type Package = {
    id: string
    title: string
    price: number
    description: string
}

export default function BookingModal({ pkg, userProfile, onClose }: { pkg: Package, userProfile: any, onClose: () => void }) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        contact: '',
        date: '',
        time: '',
        address: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSameAsProfile = () => {
        if (!userProfile) return;
        setFormData(prev => ({
            ...prev,
            name: userProfile.full_name || '',
            age: userProfile.age ? String(userProfile.age) : '',
            contact: userProfile.phone || '',
            address: userProfile.address || '' // Optionally auto-fill address too if available
        }))
    }

    const nextStep = () => setStep(s => s + 1)
    const prevStep = () => setStep(s => s - 1)

    const handleSubmit = async () => {
        setLoading(true)
        const data = new FormData()
        data.append('packageId', pkg.id)
        data.append('name', formData.name)
        data.append('age', formData.age)
        data.append('contact', formData.contact)
        data.append('date', formData.date)
        data.append('time', formData.time)
        data.append('address', formData.address)

        const res = await bookHomeCheckup(data)
        setLoading(false)
        if (res?.success) {
            setSuccess(true)
        } else {
            alert('Something went wrong. Please try again.')
        }
    }

    // Success State
    if (success) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center"
                >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
                    <p className="text-muted-foreground mb-8">
                        Your request for <span className="font-semibold text-foreground">{pkg.title}</span> has been received. Our team will contact you shortly to confirm.
                    </p>
                    <Button onClick={onClose} className="w-full py-6 text-lg font-semibold shadow-md">
                        Done
                    </Button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-black/20">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Book {pkg.title}</h3>
                        <p className="text-sm text-muted-foreground">Step {step} of 3</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 w-full">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto flex-1">
                    <AnimatePresence mode="wait">
                        {step === 1 && ( // Patient Details
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">Patient Details</h4>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSameAsProfile}
                                        className="text-xs h-8"
                                    >
                                        Same as Profile
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Patient Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter full name"
                                            autoFocus
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="age">Age</Label>
                                            <Input
                                                id="age"
                                                name="age"
                                                type="number"
                                                value={formData.age}
                                                onChange={handleChange}
                                                placeholder="Age"
                                                className="h-11"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact">Phone Number</Label>
                                            <Input
                                                id="contact"
                                                name="contact"
                                                type="tel"
                                                value={formData.contact}
                                                onChange={handleChange}
                                                placeholder="Phone number"
                                                className="h-11"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && ( // Date & Time
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">Schedule Visit</h4>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Preferred Date</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="date"
                                                name="date"
                                                type="date"
                                                min={new Date().toISOString().split('T')[0]}
                                                value={formData.date}
                                                onChange={handleChange}
                                                className="pl-10 h-11"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="time">Preferred Time</Label>
                                        <TimePicker
                                            value={formData.time}
                                            onChange={(val) => setFormData(prev => ({ ...prev, time: val }))}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && ( // Address
                            <motion.div
                                key="step3"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                        <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">Home Address</h4>
                                </div>
                                <div className="space-y-4">

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Full Address</Label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={e => handleChange(e as any)}
                                            rows={3}
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Street, City, Landmark..."
                                            autoFocus
                                        />
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border space-y-2 text-sm">
                                        <div className="flex justify-between font-semibold border-b pb-2 mb-2">
                                            <span>Package</span>
                                            <span>Rs. {pkg.price}</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Patient</span>
                                            <span>{formData.name} ({formData.age}y)</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Schedule</span>
                                            <span>{formData.date} at {formData.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-black/20">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={step === 1}
                        className={cn(step === 1 && "invisible")}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>

                    {step < 3 ? (
                        <Button
                            onClick={nextStep}
                            disabled={
                                (step === 1 && (!formData.name || !formData.age || !formData.contact)) ||
                                (step === 2 && (!formData.date || !formData.time))
                            }
                            className="bg-primary hover:bg-primary/90"
                        >
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={!formData.address || loading}
                            className="bg-primary hover:bg-primary/90 min-w-[140px]"
                        >
                            {loading ? 'Processing...' : 'Confirm'}
                        </Button>
                    )}
                </div>
            </motion.div >
        </div >
    )
}
