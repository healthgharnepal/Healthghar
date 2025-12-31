'use client'

import { adminLogin } from '@/app/actions/auth-admin'
import { useState } from 'react'

export default function AdminLoginPage() {
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (formData: FormData) => {
        const res = await adminLogin(formData)
        if (res?.error) {
            setError(res.error)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 text-black">
            <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg border border-gray-300">
                <h1 className="mb-6 text-center text-2xl font-bold text-black">Admin Portal</h1>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-500 text-red-600 p-2 rounded text-sm text-center font-bold">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-black">Username</label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md bg-white border-2 border-gray-400 p-2 text-black font-medium focus:border-blue-600 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-black">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="mt-1 block w-full rounded-md bg-white border-2 border-gray-400 p-2 text-black font-medium focus:border-blue-600 focus:ring-blue-600"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-700 px-4 py-3 font-bold text-white transition hover:bg-blue-800 shadow-md"
                    >
                        Access Dashboard
                    </button>
                </form>
            </div>
        </div>
    )
}
