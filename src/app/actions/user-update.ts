'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Not authenticated')
    }

    const age = formData.get('age')
    const countryCode = formData.get('countryCode')
    const localPhone = formData.get('localPhone')
    const fullPhone = `${countryCode}${localPhone}`.trim()
    const address = formData.get('address')
    const gender = formData.get('gender')

    const { error } = await supabase
        .from('profiles')
        .update({
            age: Number(age),
            phone: fullPhone,
            address: String(address),
            gender: String(gender)
        })
        .eq('id', user.id)

    if (error) {
        console.error('Profile update failed:', error)
        throw new Error('Failed to update profile')
    }

    revalidatePath('/user/profile')
    redirect('/user/profile?updated=true')
}
