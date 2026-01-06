'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// User Booking Actions

export async function bookHomeCheckup(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const packageId = String(formData.get('packageId'))
    const name = String(formData.get('name'))
    const age = Number(formData.get('age'))
    const address = String(formData.get('address'))
    const contact = String(formData.get('contact'))
    const date = String(formData.get('date'))
    const time = String(formData.get('time'))

    const { error } = await supabase.from('home_checkup_bookings').insert({
        package_id: packageId,
        user_id: user.id,
        patient_name: name,
        patient_age: age,
        patient_address: address,
        patient_contact: contact,
        preferred_date: date,
        preferred_time: time
    })

    if (error) {
        console.error('Home Checkup Booking Error:', error)
        return { error: error.message }
    }

    revalidatePath('/user/home')
    return { success: true }
}

export async function bookTelehealth(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const doctorId = String(formData.get('doctorId'))
    const slotTime = String(formData.get('slotTime')) // 'HH:MM:SS'
    const bookingDate = String(formData.get('bookingDate')) // 'YYYY-MM-DD'
    const name = String(formData.get('name'))
    const age = Number(formData.get('age'))
    const notes = String(formData.get('notes'))

    const { error } = await supabase.from('telehealth_bookings').insert({
        doctor_id: doctorId,
        user_id: user.id,
        booking_date: bookingDate,
        slot_time_start: slotTime,
        patient_name: name,
        patient_age: age,
        patient_notes: notes
    })

    if (error) {
        console.error('Telehealth Booking Error:', error)
        return { error: error.message }
    }

    revalidatePath('/user/home')
    return { success: true }
}

export async function bookCamp(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const campId = String(formData.get('campId'))
    // Assuming simple profile fetch or form input for these details if not provided
    // For simplicity, let's ask user to confirm/input name in the form even if logged in, or pull from profile?
    // User request: "users can book any camp by pressing book camp button".
    // I'll grab name from formData to be safe and consistent.
    const name = String(formData.get('name'))
    const age = Number(formData.get('age'))
    const contact = String(formData.get('contact'))
    const gender = String(formData.get('gender'))

    const { error } = await supabase.from('camp_bookings').insert({
        camp_id: campId,
        user_id: user.id,
        patient_name: name,
        patient_age: age,
        patient_contact: contact,
        patient_gender: gender
    })

    if (error) {
        console.error('Camp Booking Error:', error)
        return { error: error.message }
    }

    revalidatePath('/user/home')
    return { success: true }
}
