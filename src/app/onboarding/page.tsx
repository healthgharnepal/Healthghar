'use client'

import { completeProfile } from '@/app/actions/user'
import { useState } from 'react'

export default function OnboardingPage() {
    const [loading, setLoading] = useState(false)

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Complete Your Profile</h2>
                <p className="mb-8 text-gray-600">Please provide a few details to get started.</p>

                <form action={completeProfile} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-black">Age</label>
                        <input
                            name="age"
                            type="number"
                            required
                            className="mt-1 block w-full rounded-md border-2 border-gray-400 p-2 shadow-sm text-black font-medium focus:border-blue-600 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-black">Phone Number</label>
                        <input
                            name="phone"
                            type="tel"
                            required
                            className="mt-1 block w-full rounded-md border-2 border-gray-400 p-2 shadow-sm text-black font-medium focus:border-blue-600 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-black">Address</label>
                        <textarea
                            name="address"
                            required
                            rows={3}
                            className="mt-1 block w-full rounded-md border-2 border-gray-400 p-2 shadow-sm text-black font-medium focus:border-blue-600 focus:ring-blue-600"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-700 px-4 py-3 text-white font-bold transition hover:bg-blue-800 shadow-md"
                    >
                        Save & Continue
                    </button>
                </form>
            </div>
        </div>
    )
}
