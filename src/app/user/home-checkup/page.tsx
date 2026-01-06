import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Stethoscope } from 'lucide-react'
import PackagesList from './packages-list'
import { Button } from '@/components/ui/button'

export default async function HomeCheckupPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch Packages
    const { data: packages, error } = await supabase.from('home_checkup_packages').select('*').order('price', { ascending: true })

    // Fetch User Profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    if (error) {
        console.error("Error fetching packages:", error)
    }

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Link href="/user/home" className="hover:text-primary transition-colors flex items-center gap-1">
                            <ArrowLeft className="h-4 w-4" /> Back
                        </Link>
                        <span>/</span>
                        <span className="font-medium text-foreground">Home Checkup</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                        <Stethoscope className="h-8 w-8 text-primary" />
                        Book Home Checkup
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Professional healthcare at your doorstep. Select a package below to schedule a visit from our expert medical team.
                    </p>
                </div>
            </div>

            {/* Packages List */}
            <PackagesList packages={packages || []} userProfile={profile} />
        </div>
    )
}
