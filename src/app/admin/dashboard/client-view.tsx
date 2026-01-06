'use client'

import { useState, useRef, useMemo } from 'react'
import { addDoctor, removeDoctor } from '@/app/admin/actions'
import {
    addHomeCheckupPackage, addTelehealthDoctor, addCamp, addMembership,
    deleteHomeCheckupPackage, deleteTelehealthDoctor, deleteCamp, deleteMembership,
    updateTelehealthDoctor, updateCamp,
    addTelehealthSlot, deleteTelehealthSlot, updateTelehealthSlot
} from '@/app/admin/actions-expansion'
import { UserPlus, Home, Video, Tent, Crown, Download, Search, Trash2, Edit2, Calendar, X, Clock } from 'lucide-react'

// Constants
const DOCTOR_CATEGORIES = {
    "Primary Care": ["Physicians", "Internists", "Pediatricians"],
    "Medical Specialists": [
        "Cardiologists", "Dermatologists", "Neurologists", "Oncologists",
        "Gastroenterologists", "Psychiatrists", "Endocrinologists"
    ],
    "Surgical Specialists": [
        "General Surgeons", "Orthopedic Surgeons", "Neurosurgeons", "Ophthalmologists"
    ],
    "Diagnostic & Support Specialists": ["Radiologists", "X-rays", "CT scan", "MRIs"]
}

export default function AdminClientView({
    doctors,
    homePackages, homeBookings,
    teleDoctors, teleBookings, teleSlots,
    camps, campBookings,
    memberships
}: {
    doctors: any[],
    homePackages: any[], homeBookings: any[],
    teleDoctors: any[], teleBookings: any[], teleSlots: any[],
    camps: any[], campBookings: any[],
    memberships: any[]
}) {
    const [activeTab, setActiveTab] = useState('doctors')
    const [teleSearchEmail, setTeleSearchEmail] = useState('')
    const [foundDoctor, setFoundDoctor] = useState<any>(null)
    const [filterDate, setFilterDate] = useState('')

    // Telehealth State
    const [selectedCategory, setSelectedCategory] = useState<string>('Primary Care')
    const [editDoctor, setEditDoctor] = useState<any>(null)
    const [manageSlots, setManageSlots] = useState<any>(null)
    // Camp State
    const [editingCamp, setEditingCamp] = useState<any>(null)


    const tabs = [
        { id: 'doctors', label: 'Auth Doctors', icon: UserPlus },
        { id: 'home', label: 'Home Checkup', icon: Home },
        { id: 'telehealth', label: 'Telehealth', icon: Video },
        { id: 'camps', label: 'Camps', icon: Tent },
        { id: 'memberships', label: 'Memberships', icon: Crown },
    ]

    const handlePrint = () => {
        window.print()
    }

    // Filter Logic
    const filteredHomeBookings = useMemo(() => {
        if (!filterDate) return homeBookings
        return homeBookings.filter(b => b.preferred_date === filterDate)
    }, [homeBookings, filterDate])

    const filteredTeleBookings = useMemo(() => {
        if (!filterDate) return teleBookings
        return teleBookings.filter(b => b.booking_date === filterDate)
    }, [teleBookings, filterDate])

    const filteredCampBookings = useMemo(() => {
        if (!filterDate) return campBookings
        return campBookings.filter(b => b.created_at.startsWith(filterDate))
    }, [campBookings, filterDate])

    const checkDoctorEmail = () => {
        const exists = doctors.find(d => d.email === teleSearchEmail)
        if (exists) setFoundDoctor(exists)
        else alert('Doctor not found in Authorized/Whitelisted list.')
    }

    const handleEditDoctor = (doc: any) => {
        setEditDoctor(doc)
        setSelectedCategory(doc.category)
        setFoundDoctor({ full_name: doc.name, email: doc.email }) // Reuse found state for simplicity
    }

    const cancelEdit = () => {
        setEditDoctor(null)
        setFoundDoctor(null)
        setManageSlots(null)
        setTeleSearchEmail('')
        setSelectedCategory('Primary Care')
    }



    const handleEditCamp = (camp: any) => {
        setEditingCamp(camp)
    }

    const cancelCampEdit = () => {
        setEditingCamp(null)
    }

    return (
        <div>
            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-lg shadow-sm border border-gray-200 sticky top-0 z-10 no-print">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Form / Controls Column */}
                <div className="bg-white p-6 shadow rounded-lg border border-gray-200 h-fit no-print">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                        {editDoctor ? 'Edit Doctor' : `Manage ${tabs.find(t => t.id === activeTab)?.label}`}
                    </h2>

                    {activeTab === 'doctors' && (
                        <form action={async (formData) => { await addDoctor(formData) }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900">Full Name</label>
                                <input name="fullName" type="text" required className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900">Google Email</label>
                                <input name="email" type="email" required className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" placeholder="doctor@gmail.com" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Add Authorized Doctor</button>
                        </form>
                    )}

                    {activeTab === 'home' && (
                        <form action={addHomeCheckupPackage} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900">Package Name</label>
                                <input name="title" type="text" required className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900">Price (NPR)</label>
                                <input name="price" type="number" required className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900">Description</label>
                                <textarea name="description" rows={3} className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Add Package</button>
                        </form>
                    )}

                    {activeTab === 'telehealth' && (
                        <div className="space-y-6">
                            {!editDoctor && (
                                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Search Doctor by Email</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            value={teleSearchEmail}
                                            onChange={(e) => setTeleSearchEmail(e.target.value)}
                                            className="flex-1 rounded-md border-gray-400 p-2 border text-black"
                                            placeholder="doctor@gmail.com"
                                        />
                                        <button type="button" onClick={checkDoctorEmail} className="bg-gray-800 text-white px-3 rounded"><Search className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            )}

                            {/* Add/Edit Profile Form */}
                            {(foundDoctor || editDoctor) && !manageSlots && (
                                <form action={editDoctor ? updateTelehealthDoctor : addTelehealthDoctor} className="space-y-4 pt-4 border-t animate-in fade-in">
                                    <h3 className="font-bold text-gray-800">{editDoctor ? 'Update Profile' : 'Add Doctor Profile'}</h3>
                                    {editDoctor && <input type="hidden" name="id" value={editDoctor.id} />}

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900">Email</label>
                                        <input name="email" type="email" defaultValue={foundDoctor.email} readOnly className="mt-1 block w-full rounded-md border-gray-400 bg-gray-100 p-2 border text-black cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900">Name</label>
                                        <input name="name" type="text" defaultValue={foundDoctor.full_name} required className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900">Category</label>
                                        <select
                                            name="category"
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black"
                                        >
                                            {Object.keys(DOCTOR_CATEGORIES).map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900">Specialization</label>
                                        <select
                                            name="specialization"
                                            defaultValue={editDoctor?.specialization}
                                            className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black"
                                        >
                                            {(DOCTOR_CATEGORIES as any)[selectedCategory]?.map((spec: string) => (
                                                <option key={spec} value={spec}>{spec}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900">Description</label>
                                        <textarea name="description" defaultValue={editDoctor?.description} rows={2} className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" />
                                    </div>

                                    <div className="flex gap-2">
                                        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
                                            {editDoctor ? 'Update' : 'Save Profile'}
                                        </button>
                                        {editDoctor && (
                                            <button type="button" onClick={cancelEdit} className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            )}

                            {/* Manage Slots UI */}
                            {manageSlots && (
                                <div className="space-y-4 pt-4 border-t animate-in fade-in">
                                    <div className="flex justify-between items-center bg-blue-50 p-2 rounded border border-blue-200">
                                        <div>
                                            <h3 className="font-bold text-gray-800">Manage Slots</h3>
                                            <p className="text-sm text-gray-600">For: <span className="font-semibold text-blue-700">{manageSlots.name}</span></p>
                                        </div>
                                        <button onClick={() => setManageSlots(null)} className="text-gray-500 hover:text-gray-800"><X className="h-4 w-4" /></button>
                                    </div>

                                    {/* Add Slot Form */}
                                    <form action={addTelehealthSlot} className="space-y-3 bg-gray-50 p-3 rounded border border-gray-200">
                                        <input type="hidden" name="doctorId" value={manageSlots.id} />
                                        <h4 className="text-xs font-bold uppercase text-gray-500">Add Availability</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700">Start Time</label>
                                                <input name="startTime" type="datetime-local" required className="mt-1 block w-full rounded border-gray-300 p-1 text-sm border text-black" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700">End Time</label>
                                                <input name="endTime" type="datetime-local" required className="mt-1 block w-full rounded border-gray-300 p-1 text-sm border text-black" />
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full bg-green-600 text-white py-1 rounded text-sm font-bold hover:bg-green-700">Add Slot</button>
                                    </form>

                                    {/* Existing Slots List */}
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        <h4 className="text-xs font-bold uppercase text-gray-500 sticky top-0 bg-white py-1">Existing Slots</h4>
                                        {teleSlots.filter(s => s.doctor_id === manageSlots.id).length === 0 ? (
                                            <p className="text-sm text-gray-500 italic">No slots added yet.</p>
                                        ) : (
                                            teleSlots.filter(s => s.doctor_id === manageSlots.id).map(slot => (
                                                <div key={slot.id} className="flex justify-between items-center bg-white border p-2 rounded shadow-sm text-sm">
                                                    <div className="text-gray-800">
                                                        <span className="block font-bold">{new Date(slot.start_time).toLocaleDateString()}</span>
                                                        <span className="text-xs text-gray-600">
                                                            {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                            {new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <form action={async () => await deleteTelehealthSlot(slot.id)}>
                                                        <button className="text-red-500 hover:text-red-700 p-1"><Trash2 className="h-4 w-4" /></button>
                                                    </form>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'camps' && (
                        <form action={editingCamp ? updateCamp : addCamp} className={`space-y-4 ${editingCamp ? 'bg-blue-50 p-4 border border-blue-200 rounded-md' : ''}`}>
                            {editingCamp && <input type="hidden" name="id" value={editingCamp.id} />}
                            <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">{editingCamp ? 'Edit Camp Details' : 'Add New Camp'}</h3>

                            <div>
                                <label className="block text-sm font-bold text-gray-900">Camp Name</label>
                                <input name="title" type="text" defaultValue={editingCamp?.title} required className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900">Venue (Building/Place/City)</label>
                                <input name="venue" type="text" defaultValue={editingCamp?.venue} required className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900">Date</label>
                                    <input name="date" type="date" defaultValue={editingCamp?.camp_date} required className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900">Time</label>
                                    <input name="time" type="time" defaultValue={editingCamp?.camp_time} required className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900">Price</label>
                                <input name="price" type="number" defaultValue={editingCamp?.price} required className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900">Map Link</label>
                                <input name="mapLink" type="url" defaultValue={editingCamp?.google_map_link} className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" placeholder="https://maps.google.com/..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900">Description</label>
                                <textarea name="description" defaultValue={editingCamp?.description} rows={2} className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" />
                            </div>

                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
                                    {editingCamp ? 'Update Camp' : 'Add Camp'}
                                </button>
                                {editingCamp && (
                                    <button type="button" onClick={cancelCampEdit} className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {activeTab === 'memberships' && (
                        <form action={addMembership} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900">Plan Name</label>
                                <input name="title" type="text" required className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" placeholder="e.g. Gold Membership" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900">Price (NPR)</label>
                                <input name="price" type="number" required className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900">Duration (Months)</label>
                                <input name="duration" type="number" required className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900">Benefits</label>
                                <textarea name="benefits" rows={3} className="mt-1 block w-full rounded-md border-gray-400 p-2 border text-black" placeholder="List benefits..." />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Add Membership</button>
                        </form>
                    )}
                </div>

                {/* List Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items List */}
                    <div className="bg-white p-6 shadow rounded-lg border border-gray-200 no-print">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">{tabs.find(t => t.id === activeTab)?.label} List</h2>
                        <div className="overflow-x-auto max-h-80">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Title/Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Details</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-black uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {activeTab === 'doctors' && doctors.map((doc) => (
                                        <tr key={doc.id}>
                                            <td className="px-6 py-4 text-sm font-bold text-black">{doc.full_name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{doc.email}</td>
                                            <td className="px-6 py-4 text-right text-sm">
                                                <form action={async () => { await removeDoctor(doc.id) }}>
                                                    <button className="text-red-600 hover:text-red-900 font-bold"><Trash2 className="h-4 w-4" /></button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                    {activeTab === 'home' && homePackages.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 text-sm font-bold text-black">{item.title}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">Rs. {item.price}</td>
                                            <td className="px-6 py-4 text-right text-sm">
                                                <form action={async () => await deleteHomeCheckupPackage(item.id)}>
                                                    <button className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                    {activeTab === 'telehealth' && teleDoctors.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 text-sm font-bold text-black">{item.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <span className="block font-semibold">{item.category}</span>
                                                <span className="text-xs text-gray-500">{item.specialization}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm flex justify-end gap-2">
                                                <button onClick={() => setManageSlots(item)} className="text-green-600 hover:text-green-800 border border-green-200 bg-green-50 px-2 py-1 rounded text-xs font-bold" title="Manage Schedule">
                                                    Manage Slots
                                                </button>
                                                <button onClick={() => handleEditDoctor(item)} className="text-blue-600 hover:text-blue-800" title="Edit Profile">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <form action={async () => await deleteTelehealthDoctor(item.id)}>
                                                    <button className="text-red-500 hover:text-red-700" title="Delete"><Trash2 className="h-4 w-4" /></button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                    {activeTab === 'camps' && camps.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 text-sm font-bold text-black">
                                                {item.title}
                                                <span className="block text-xs font-normal text-gray-500">{item.venue}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="flex flex-col gap-1">
                                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {item.camp_date}</span>
                                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {item.camp_time}</span>
                                                    <span className="font-semibold text-green-700">Rs. {item.price}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm flex justify-end gap-2 items-center">
                                                <button onClick={() => handleEditCamp(item)} className="text-blue-600 hover:text-blue-800" title="Edit Camp">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <form action={async () => await deleteCamp(item.id)}>
                                                    <button className="text-red-500 hover:text-red-700" title="Delete Camp"><Trash2 className="h-4 w-4" /></button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                    {activeTab === 'memberships' && memberships.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 text-sm font-bold text-black">{item.title}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">Rs. {item.price}</td>
                                            <td className="px-6 py-4 text-right text-sm">
                                                <form action={async () => await deleteMembership(item.id)}>
                                                    <button className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Booking Records Table (Only for relevant tabs) */}
                    {['home', 'telehealth', 'camps'].includes(activeTab) && (
                        <div className="bg-white p-6 shadow rounded-lg border border-gray-200" id="print-section">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-gray-900">Patient Records</h2>
                                <div className="flex items-center gap-2 no-print">
                                    <input
                                        type="date"
                                        value={filterDate}
                                        onChange={(e) => setFilterDate(e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-1 text-sm text-black"
                                    />
                                    <button onClick={handlePrint} className="flex items-center gap-2 bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
                                        <Download className="h-4 w-4" /> Download/Print
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Patient Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Contact/Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Date & Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {activeTab === 'home' && filteredHomeBookings.map((b) => (
                                            <tr key={b.id}><td className="px-6 py-4 text-sm font-bold text-black">{b.patient_name} <br /><span className="text-xs text-gray-500">Age: {b.patient_age}</span>
                                                {/* @ts-ignore */}
                                                <span className="block text-xs font-semibold text-blue-600 mt-1">PKG: {b.home_checkup_packages?.title}</span>
                                            </td><td className="px-6 py-4 text-sm text-gray-900">{b.patient_address} <br /> {b.patient_contact}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <div className="font-semibold">{b.preferred_date} {b.preferred_time}</div>
                                                    <div className="text-xs text-gray-500 mt-1">Booked: {new Date(b.created_at).toLocaleDateString()}</div>
                                                </td></tr>
                                        ))}
                                        {activeTab === 'telehealth' && filteredTeleBookings.map((b) => (
                                            <tr key={b.id}><td className="px-6 py-4 text-sm font-bold text-black">{b.patient_name} <br /><span className="text-xs text-gray-500">Age: {b.patient_age}</span></td><td className="px-6 py-4 text-sm text-gray-900">Notes: {b.patient_notes}</td><td className="px-6 py-4 text-sm text-gray-900">{b.booking_date} {b.slot_time_start}</td></tr>
                                        ))}
                                        {activeTab === 'camps' && filteredCampBookings.map((b) => (
                                            <tr key={b.id}><td className="px-6 py-4 text-sm font-bold text-black">{b.patient_name} <br /><span className="text-xs text-gray-500">Age: {b.patient_age}</span></td><td className="px-6 py-4 text-sm text-gray-900">{b.patient_contact} <br /> {b.patient_gender}</td><td className="px-6 py-4 text-sm text-gray-900">{new Date(b.created_at).toLocaleDateString()}</td></tr>
                                        ))}
                                        {/* Fallback empty states */}
                                        {((activeTab === 'home' && filteredHomeBookings.length === 0) ||
                                            (activeTab === 'telehealth' && filteredTeleBookings.length === 0) ||
                                            (activeTab === 'camps' && filteredCampBookings.length === 0)) && (
                                                <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No records found for selected date.</td></tr>
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>



            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .no-print {
                        display: none !important;
                    }
                    #print-section, #print-section * {
                        visibility: visible;
                    }
                    #print-section {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                         background: white;
                         border: none;
                         box-shadow: none;
                    }
                }
            `}</style>
        </div>
    )
}
