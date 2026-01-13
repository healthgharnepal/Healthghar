'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Use Service Role for Admin Actions (Bypass RLS)
const getService = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 1. Home Checkups
export async function addHomeCheckupPackage(formData: FormData) {
    const supabase = getService()
    const title = String(formData.get('title'))
    const price = Number(formData.get('price'))
    const description = String(formData.get('description'))

    const { error } = await supabase.from('home_checkup_packages').insert({ title, price, description })
    if (error) console.error('Error adding home package:', error)
    revalidatePath('/admin/dashboard')
}

// 2. Telehealth
export async function addTelehealthDoctor(formData: FormData) {
    const supabase = getService()
    const email = String(formData.get('email'))
    const name = String(formData.get('name'))
    const description = String(formData.get('description'))
    const category = String(formData.get('category'))
    const specialization = String(formData.get('specialization'))

    const { error } = await supabase.from('telehealth_doctors').insert({
        email, name, description, category, specialization
    })
    if (error) console.error('Error adding telehealth doctor:', error)
    revalidatePath('/admin/dashboard')
}







export async function updateTelehealthDoctor(formData: FormData) {
    const supabase = getService()
    const id = String(formData.get('id'))
    const email = String(formData.get('email'))
    const name = String(formData.get('name'))
    const description = String(formData.get('description'))
    const category = String(formData.get('category'))
    const specialization = String(formData.get('specialization'))

    const { error } = await supabase.from('telehealth_doctors').update({
        email, name, description, category, specialization
    }).eq('id', id)

    if (error) console.error('Error updating doctor:', error)
    revalidatePath('/admin/dashboard')
}


export async function addTelehealthSlot(formData: FormData) {
    const supabase = getService()
    const doctorId = String(formData.get('doctorId'))
    const startTime = String(formData.get('startTime'))
    const endTime = String(formData.get('endTime'))

    const { error } = await supabase.from('telehealth_slots').insert({
        doctor_id: doctorId,
        start_time: startTime,
        end_time: endTime
    })
    if (error) console.error('Error adding slot:', error)
    revalidatePath('/admin/dashboard')
}

export async function deleteTelehealthSlot(id: string) {
    const supabase = getService()
    await supabase.from('telehealth_slots').delete().eq('id', id)
    revalidatePath('/admin/dashboard')
}

export async function updateTelehealthSlot(formData: FormData) {
    const supabase = getService()
    const id = String(formData.get('slotId'))
    const startTime = String(formData.get('startTime'))
    const endTime = String(formData.get('endTime'))

    const { error } = await supabase.from('telehealth_slots').update({
        start_time: startTime,
        end_time: endTime
    }).eq('id', id)

    if (error) console.error('Error updating slot:', error)
    revalidatePath('/admin/dashboard')
}

// 3. Camps
export async function addCamp(formData: FormData) {
    const supabase = getService()
    const title = String(formData.get('title'))
    const date = String(formData.get('date')) // Format: YYYY-MM-DD
    const time = String(formData.get('time')) // Format: HH:MM
    const venue = String(formData.get('venue'))
    const price = Number(formData.get('price'))
    const description = String(formData.get('description'))
    const mapLink = String(formData.get('mapLink'))

    const { error } = await supabase.from('upcoming_camps').insert({
        title, camp_date: date, camp_time: time, venue, price, description, google_map_link: mapLink
    })
    if (error) console.error('Error adding camp:', error)
    revalidatePath('/admin/dashboard')
}

// 4. Memberships
export async function addMembership(formData: FormData) {
    const supabase = getService()
    const title = String(formData.get('title'))
    const price = Number(formData.get('price'))
    const duration = Number(formData.get('duration'))
    const benefits = String(formData.get('benefits'))

    const { error } = await supabase.from('membership_plans').insert({
        title, price, duration_months: duration, benefits
    })
    if (error) console.error('Error adding membership:', error)
    revalidatePath('/admin/dashboard')
}

// Delete Actions
export async function deleteHomeCheckupPackage(id: string) {
    const supabase = getService()
    await supabase.from('home_checkup_packages').delete().eq('id', id)
    revalidatePath('/admin/dashboard')
}

export async function deleteTelehealthDoctor(id: string) {
    const supabase = getService()

    // 1. Delete associated slots first (Manually verify cascade)
    const { error: slotError } = await supabase.from('telehealth_slots').delete().eq('doctor_id', id)
    if (slotError) {
        console.error('Error deleting related slots:', slotError)
        // We might continue or throw, but let's try to proceed to see the specific error if any
    }

    // 2. Delete the doctor
    const { error } = await supabase.from('telehealth_doctors').delete().eq('id', id)

    if (error) {
        console.error('Error deleting telehealth doctor:', error)
        // If error is due to bookings (FK), we should probably let the user know, but server actions return void here.
        // For now, logging it is the first step.
    }
    revalidatePath('/admin/dashboard')
}

export async function deleteCamp(id: string) {
    const supabase = getService()
    await supabase.from('upcoming_camps').delete().eq('id', id)
    revalidatePath('/admin/dashboard')
}

export async function updateCamp(formData: FormData) {
    const supabase = getService()
    const id = String(formData.get('id'))
    const title = String(formData.get('title'))
    const date = String(formData.get('date'))
    const time = String(formData.get('time'))
    const venue = String(formData.get('venue'))
    const price = Number(formData.get('price'))
    const description = String(formData.get('description'))
    const mapLink = String(formData.get('mapLink'))

    const { error } = await supabase.from('upcoming_camps').update({
        title, camp_date: date, camp_time: time, venue, price, description, google_map_link: mapLink
    }).eq('id', id)

    if (error) console.error('Error updating camp:', error)
    revalidatePath('/admin/dashboard')
}

export async function deleteMembership(id: string) {
    const supabase = getService()
    await supabase.from('membership_plans').delete().eq('id', id)
    revalidatePath('/admin/dashboard')
}

// 5. Camp Reports
export async function addCampReport(formData: FormData) {
    const supabase = getService(); // Uses service role to bypass RLS for admin actions

    // Process checkbox group for departments
    const departments = formData.getAll('departments').map(d => String(d));

    const reportPayload = {
        booking_id: String(formData.get('bookingId')),
        user_id: String(formData.get('userId')),
        patient_name: String(formData.get('name')),
        patient_age: Number(formData.get('age')),
        patient_gender: String(formData.get('gender')),
        patient_address: String(formData.get('address')),
        patient_phone: String(formData.get('phone')),
        patient_ward: String(formData.get('ward')),
        departments: departments,
        vital_bp: String(formData.get('bp')),
        vital_blood_sugar: Number(formData.get('bloodSugar')),
        vital_weight: Number(formData.get('weight')),
        vital_temp: Number(formData.get('temp')),
        vital_spo2: Number(formData.get('spo2')),
        vital_pulse: Number(formData.get('pulse')),
        doctors_advice: String(formData.get('advice')),
        doctor_signature: String(formData.get('signature')),
        doctor_name: String(formData.get('doctorName')),
    };

    const { error } = await supabase.from('camp_reports').insert(reportPayload);

    if (error) {
        console.error('Error adding camp report:', error);
        throw new Error('Failed to save report');
    }

    revalidatePath('/admin/dashboard');
}

export async function updateCampReport(formData: FormData) {
    const supabase = getService();

    const reportId = String(formData.get('reportId'));
    const departments = formData.getAll('departments').map(d => String(d));

    const reportPayload = {
        patient_name: String(formData.get('name')),
        patient_age: Number(formData.get('age')),
        patient_gender: String(formData.get('gender')),
        patient_address: String(formData.get('address')),
        patient_phone: String(formData.get('phone')),
        patient_ward: String(formData.get('ward')),
        departments: departments,
        vital_bp: String(formData.get('bp')),
        vital_blood_sugar: Number(formData.get('bloodSugar')),
        vital_weight: Number(formData.get('weight')),
        vital_temp: Number(formData.get('temp')),
        vital_spo2: Number(formData.get('spo2')),
        vital_pulse: Number(formData.get('pulse')),
        doctors_advice: String(formData.get('advice')),
        doctor_signature: String(formData.get('signature')),
        doctor_name: String(formData.get('doctorName')),
    };

    const { error } = await supabase.from('camp_reports').update(reportPayload).eq('id', reportId);

    if (error) {
        console.error('Error updating camp report:', error);
        throw new Error('Failed to update report');
    }

    revalidatePath('/admin/dashboard');
}
