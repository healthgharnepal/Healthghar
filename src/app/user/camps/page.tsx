import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CampList from './camp-list'

export default async function CampsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch Upcoming Camps
    const { data: camps } = await supabase.from('upcoming_camps').select('*').order('camp_date', { ascending: true })

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                <Link
                    href="/user/home"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-8 group"
                >
                    <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Dashboard</span>
                </Link>

                <div className="mb-12 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 tracking-tight">
                        Upcoming Health Camps
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Join our community health events. Expert care, right in your neighborhood.
                        Book your spot today ensuring a healthier tomorrow.
                    </p>
                </div>

                <CampList camps={camps || []} />
            </div>
        </div>
    )
}
