import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '@/app/login/actions'
import ClientDashboard from './client'

export default async function DoctorDashboard() {
    const supabase = await createClient()

    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // 2. Check if User is a Doctor
    const { data: doctor } = await supabase
        .from('telehealth_doctors')
        .select('*')
        .eq('email', user.email)
        .single()

    if (!doctor) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md border border-red-100">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">
                        Your email <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{user.email}</span> is not registered as an authorized doctor.
                    </p>
                    <form action={signout}>
                        <button className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition-colors">
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    // 3. Fetch Bookings for this Doctor
    const { data: bookings } = await supabase
        .from('telehealth_bookings')
        .select(`
            *,
            telehealth_slots (
                start_time,
                end_time
            )
        `)
        .eq('doctor_id', doctor.id)
        .order('booking_date', { ascending: true })

    return <ClientDashboard doctor={doctor} bookings={bookings || []} />
}
