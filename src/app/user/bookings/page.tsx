import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BookingsClientView from './client-view'

export default async function MyBookingsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // 1. Fetch Home Checkup Bookings
    const { data: homeBookings } = await supabase
        .from('home_checkup_bookings')
        .select(`
            *,
            home_checkup_packages ( title )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // 2. Fetch Telehealth Bookings
    const { data: teleBookings } = await supabase
        .from('telehealth_bookings')
        .select(`
            *,
            telehealth_doctors ( name, specialization )
        `)
        .eq('user_id', user.id)
        .order('booking_date', { ascending: true })

    // 3. Fetch Camp Bookings
    const { data: campBookings } = await supabase
        .from('camp_bookings')
        .select(`
            *,
            upcoming_camps ( title, venue, camp_date, camp_time, google_map_link )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl" />
            </div>

            <BookingsClientView
                homeBookings={homeBookings || []}
                teleBookings={teleBookings || []}
                campBookings={campBookings || []}
            />
        </div>
    )
}
