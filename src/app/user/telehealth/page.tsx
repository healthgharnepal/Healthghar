import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Stethoscope } from 'lucide-react'
import TelehealthBookingFlow from './booking-flow'

export default async function TelehealthPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch Doctors and Active Slots
    const { data: doctors } = await supabase.from('telehealth_doctors').select('*')
    const { data: slots } = await supabase.from('telehealth_slots').select('*').eq('is_active', true)

    return (
        <div className="min-h-screen bg-gray-50/50 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/80 to-transparent pointer-events-none -z-10" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl opacity-50 pointer-events-none -z-10" />
            <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl opacity-50 pointer-events-none -z-10" />

            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
                    <Link href="/user/home" className="p-2 -ml-2 hover:bg-gray-100/80 rounded-full transition-colors group">
                        <ArrowLeft className="h-5 w-5 text-gray-500 group-hover:text-black transition-colors" />
                    </Link>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100/50 rounded-lg">
                            <Stethoscope className="h-4 w-4 text-blue-600" />
                        </div>
                        <h1 className="font-bold text-sm md:text-base text-gray-900">Telehealth Consultation</h1>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
                {/* Hero Text */}
                <div className="mb-8 md:mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                        Virtual Care, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Real Connections.</span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-lg">
                        Connect with top specialists from the comfort of your home. Secure, private, and convenient healthcare at your fingertips.
                    </p>
                </div>

                <div className="relative z-10">
                    <TelehealthBookingFlow
                        doctors={doctors || []}
                        slots={slots || []}
                    />
                </div>
            </div>
        </div>
    )
}
