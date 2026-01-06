'use client'

import { LayoutDashboard, Calendar, Users, Settings, LogOut, Clock, FileText } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { signout } from '@/app/login/actions'

interface SidebarProps {
    doctorName: string
    doctorSpecialization?: string
    stats: {
        totalAppointments: number
        todayAppointments: number
        totalPatients: number
    }
}

const MENU_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/doctor/dashboard', active: true },
    { label: 'My Schedule', icon: Calendar, href: '/doctor/dashboard/schedule', active: false },
    { label: 'Patients', icon: Users, href: '#', active: false },
    { label: 'Reports', icon: FileText, href: '#', active: false },
    { label: 'Settings', icon: Settings, href: '#', active: false },
]

export function Sidebar({ doctorName, doctorSpecialization, stats }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className="h-full bg-white flex flex-col border-r border-gray-100">
            {/* Header */}
            <div className="h-20 flex items-center gap-2 px-6 border-b border-gray-50 flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">H</div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">Healthghar</span>
            </div>

            {/* Profile Summary (Mobile friendly if needed, optional) */}
            <div className="px-6 py-6 md:hidden">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                        {doctorName.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{doctorName}</h3>
                        <p className="text-xs text-gray-500">{doctorSpecialization}</p>
                    </div>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="px-4 py-4 space-y-1 flex-1 overflow-y-auto">
                {MENU_ITEMS.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                            ${item.active
                                ? 'bg-blue-600 text-white shadow-blue-200 shadow-md'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                        `}
                    >
                        <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-gray-400'}`} />
                        {item.label}
                    </a>
                ))}
            </nav>

            {/* Sidebar Stats */}
            <div className="px-4 py-4 mt-auto">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Overview</h4>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded bg-blue-100 text-blue-600"><Calendar className="w-3.5 h-3.5" /></div>
                            <span className="text-sm text-gray-600">Total</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{stats.totalAppointments}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded bg-orange-100 text-orange-600"><Clock className="w-3.5 h-3.5" /></div>
                            <span className="text-sm text-gray-600">Today</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{stats.todayAppointments}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded bg-green-100 text-green-600"><Users className="w-3.5 h-3.5" /></div>
                            <span className="text-sm text-gray-600">Patients</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{stats.totalPatients}</span>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-50 flex-shrink-0">
                <form action={signout}>
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    )
}
