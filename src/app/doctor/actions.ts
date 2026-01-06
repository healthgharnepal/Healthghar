'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getDoctorSlots() {
    const supabase = await createClient()

    // Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Get Doctor ID
    const { data: doctor } = await supabase
        .from('telehealth_doctors')
        .select('id')
        .eq('email', user.email)
        .single()

    if (!doctor) return []

    const { data: slots } = await supabase
        .from('telehealth_slots')
        .select('*')
        .eq('doctor_id', doctor.id)
        .order('start_time', { ascending: true })

    return slots || []
}

export async function addDoctorSlot(formData: FormData) {
    const supabase = await createClient()

    // Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Get Doctor ID
    const { data: doctor } = await supabase
        .from('telehealth_doctors')
        .select('id')
        .eq('email', user.email)
        .single()

    if (!doctor) return { error: 'Doctor profile not found' }

    const startTime = String(formData.get('startTime'))
    const endTime = String(formData.get('endTime'))

    if (startTime >= endTime) {
        return { error: 'Start time must be before end time' }
    }

    const { error } = await supabase.from('telehealth_slots').insert({
        doctor_id: doctor.id,
        start_time: startTime,
        end_time: endTime
    })

    if (error) {
        console.error('Error adding slot:', error)
        return { error: 'Failed to add slot' }
    }

    revalidatePath('/doctor/dashboard/schedule')
    return { success: true }
}

export async function updateDoctorSlot(formData: FormData) {
    const supabase = await createClient()

    // Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Get Doctor ID
    const { data: doctor } = await supabase
        .from('telehealth_doctors')
        .select('id')
        .eq('email', user.email)
        .single()

    if (!doctor) return { error: 'Doctor profile not found' }

    const slotId = String(formData.get('slotId'))
    const startTime = String(formData.get('startTime'))
    const endTime = String(formData.get('endTime'))

    if (startTime >= endTime) {
        return { error: 'Start time must be before end time' }
    }

    // Verify ownership
    const { data: slot } = await supabase
        .from('telehealth_slots')
        .select('id')
        .eq('id', slotId)
        .eq('doctor_id', doctor.id)
        .single()

    if (!slot) return { error: 'Slot not found or permission denied' }

    const { error } = await supabase.from('telehealth_slots').update({
        start_time: startTime,
        end_time: endTime
    }).eq('id', slotId)

    if (error) {
        console.error('Error updating slot:', error)
        return { error: 'Failed to update slot' }
    }

    revalidatePath('/doctor/dashboard/schedule')
    return { success: true }
}

export async function deleteDoctorSlot(slotId: string) {
    const supabase = await createClient()

    // Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Get Doctor ID
    const { data: doctor } = await supabase
        .from('telehealth_doctors')
        .select('id')
        .eq('email', user.email)
        .single()

    if (!doctor) return { error: 'Doctor profile not found' }

    const { error } = await supabase
        .from('telehealth_slots')
        .delete()
        .eq('id', slotId)
        .eq('doctor_id', doctor.id)

    if (error) {
        console.error('Error deleting slot:', error)
        return { error: 'Failed to delete slot' }
    }

    revalidatePath('/doctor/dashboard/schedule')
    return { success: true }
}
