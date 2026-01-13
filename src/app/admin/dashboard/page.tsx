import { createClient } from '@supabase/supabase-js'
import { adminLogout } from '@/app/actions/auth-admin'
import AdminClientView from './client-view'

const getService = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminDashboard() {
    const supabase = getService()

    // Parallel fetching for performance
    const [
        { data: doctors },
        { count: usersCount },
        { data: homePackages },
        { data: teleDoctors },
        { data: bookingsHome },
        { data: bookingsTele },
        { data: upcomingCamps },
        { data: bookingsCamp },
        { data: memberships },
        { data: teleSlots },
        { data: campReports }
    ] = await Promise.all([
        supabase.from('doctors').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),

        supabase.from('home_checkup_packages').select('*').order('created_at', { ascending: false }),
        supabase.from('telehealth_doctors').select('*').order('created_at', { ascending: false }),

        supabase.from('home_checkup_bookings').select('*, home_checkup_packages(title)').order('created_at', { ascending: false }),
        supabase.from('telehealth_bookings').select('*').order('created_at', { ascending: false }),

        supabase.from('upcoming_camps').select('*').order('created_at', { ascending: false }),
        supabase.from('camp_bookings').select('*, upcoming_camps(title)').order('created_at', { ascending: false }),

        supabase.from('membership_plans').select('*').order('created_at', { ascending: false }),
        supabase.from('telehealth_slots').select('*').order('start_time', { ascending: true }),
        supabase.from('camp_reports').select('*')
    ])

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-gray-800 text-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-bold">Healthghar Admin</span>
                        <span className="bg-gray-700 px-2 py-1 rounded text-xs">{usersCount || 0} Users</span>
                    </div>
                    <form action={adminLogout}>
                        <button className="text-sm text-gray-400 hover:text-white">Logout</button>
                    </form>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                <AdminClientView
                    doctors={doctors || []}
                    homePackages={homePackages || []}
                    homeBookings={bookingsHome || []}
                    teleDoctors={teleDoctors || []}
                    teleBookings={bookingsTele || []}
                    teleSlots={teleSlots || []}
                    camps={upcomingCamps || []}
                    campBookings={bookingsCamp || []}
                    memberships={memberships || []}
                    campReports={campReports || []}
                />
            </main>
        </div>
    )
}
