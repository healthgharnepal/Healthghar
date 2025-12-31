import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function UserHome() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-black">User Dashboard</h1>
                        <form action={async () => {
                            'use server'
                            const sb = await createClient()
                            await sb.auth.signOut()
                            redirect('/')
                        }}>
                            <button className="text-sm text-red-600 hover:text-red-800 font-bold">Sign Out</button>
                        </form>
                    </div>
                </div>
            </nav>
            <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="rounded-lg border-4 border-dashed border-gray-400 p-4">
                        <h2 className="text-xl font-bold text-black mb-4">Welcome, {profile?.full_name}</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
                                <h3 className="font-bold text-lg text-black mb-2">My Profile</h3>
                                <div className="space-y-1 text-gray-900 font-medium">
                                    <p><span className="font-semibold text-black">Age:</span> {profile?.age}</p>
                                    <p><span className="font-semibold text-black">Phone:</span> {profile?.phone}</p>
                                    <p><span className="font-semibold text-black">Address:</span> {profile?.address}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
                                <h3 className="font-bold text-lg text-black mb-2">My Bookings</h3>
                                <p className="text-gray-900 font-medium">No bookings yet.</p>
                                {/* Fetch bookings here */}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
