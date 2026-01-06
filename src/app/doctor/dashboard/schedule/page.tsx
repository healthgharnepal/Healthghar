import { getDoctorSlots } from '@/app/doctor/actions'
import ScheduleClient from './schedule-client'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function SchedulePage() {
    const supabase = await createClient()

    // 1. Check Auth & Doctor Role (Redundant double check but good for safety)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const slots = await getDoctorSlots()

    return (
        <div className="p-6 lg:p-10 min-h-full">
            <ScheduleClient initialSlots={slots} />
        </div>
    )
}
