import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { updateProfile } from '@/app/actions/user-update'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ProfilePage({ searchParams }: { searchParams: { updated?: string } }) {
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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <div className="flex items-center mb-6">
                    <Link href="/user/home" className="mr-4 p-2 rounded-full hover:bg-gray-100 transition">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </Link>
                    <h1 className="text-2xl font-bold text-black">Edit Profile</h1>
                </div>

                {searchParams?.updated && (
                    <div className="mb-4 bg-green-50 border border-green-500 text-green-700 p-2 rounded text-sm text-center font-bold">
                        Profile updated successfully!
                    </div>
                )}

                <form action={updateProfile} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-black">Full Name (Read Only)</label>
                        <input
                            type="text"
                            value={profile?.full_name || ''}
                            disabled
                            className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-gray-100 p-2 text-gray-600 font-medium cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-black">Age</label>
                        <input
                            name="age"
                            type="number"
                            defaultValue={profile?.age || ''}
                            required
                            className="mt-1 block w-full rounded-md border-2 border-gray-400 p-2 shadow-sm text-black font-medium focus:border-blue-600 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-black">Phone Number</label>
                        <input
                            name="phone"
                            type="tel"
                            defaultValue={profile?.phone || ''}
                            required
                            className="mt-1 block w-full rounded-md border-2 border-gray-400 p-2 shadow-sm text-black font-medium focus:border-blue-600 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-black">Address</label>
                        <textarea
                            name="address"
                            defaultValue={profile?.address || ''}
                            required
                            rows={3}
                            className="mt-1 block w-full rounded-md border-2 border-gray-400 p-2 shadow-sm text-black font-medium focus:border-blue-600 focus:ring-blue-600"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-700 px-4 py-3 text-white font-bold transition hover:bg-blue-800 shadow-md"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    )
}
