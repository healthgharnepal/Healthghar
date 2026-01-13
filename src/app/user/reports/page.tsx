import { createClient } from '@/utils/supabase/server';
import {
    Activity,
    User,
    Phone,
    QrCode,
    Calendar,
    ClipboardList,
    FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function UserReportsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: reports } = await supabase
        .from('camp_reports')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

    if (!reports || reports.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
                <div className="text-center p-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <FileText className="mx-auto h-16 w-16 text-slate-300 mb-6" />
                    <h3 className="text-xl font-bold text-slate-700">No Medical Reports</h3>
                    <p className="text-slate-500 mt-2">You haven't received any medical reports yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8 space-y-12">
            {reports.map((report) => (
                <HealthReportCard key={report.id} reportData={report} />
            ))}
        </div>
    );
}

// ----------------------------------------------------------------------
// Health Report Card Component
// ----------------------------------------------------------------------

interface HealthReportProps {
    reportData: {
        patient_name: string;
        patient_age: number;
        patient_gender: string;
        patient_address: string;
        patient_phone: string;
        patient_ward: string;
        departments: string[];
        vital_bp: string;
        vital_blood_sugar: number;
        vital_weight: number;
        vital_temp: number;
        vital_spo2: number;
        vital_pulse: number;
        doctors_advice: string;
        doctor_name: string;
        doctor_signature: string;
        created_at: string;
    };
}

const HealthReportCard = ({ reportData }: HealthReportProps) => {
    const today = new Date(reportData.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6 print:space-y-4 print:p-0">

            {/* 1. Header Section */}
            <header className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 print:shadow-none print:border-b print:rounded-none">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-black tracking-tight text-blue-600 print:text-black">HEALTH REPORT CARD</h1>
                    <p className="text-slate-500 font-medium print:text-slate-600">Preventive Health | Community Care | Doorstep Services</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-slate-400">
                        <Calendar size={16} />
                        <span>Issued on: {today}</span>
                    </div>
                </div>
                <div className="w-24 h-24 bg-blue-50 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-200 print:hidden">
                    <span className="text-blue-400 font-bold text-xs text-center px-2">LOGO PLACEHOLDER</span>
                </div>
            </header>

            {/* 2. Main Layout (Two-column on desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">

                {/* LEFT COLUMN – Patient Information */}
                <Card className="border-none shadow-md overflow-hidden bg-white rounded-2xl print:shadow-none print:border print:rounded-lg">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 print:bg-white print:border-b-2">
                        <CardTitle className="flex items-center gap-2 text-blue-700 text-lg print:text-black">
                            <User size={20} />
                            Patient Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                                <p className="text-lg font-semibold border-b border-slate-100 pb-1">{reportData.patient_name}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Age</label>
                                <p className="font-medium">{reportData.patient_age} Years</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Gender</label>
                                <p className="font-medium">{reportData.patient_gender}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Address</label>
                                <p className="text-sm text-slate-600 leading-relaxed">{reportData.patient_address}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Phone</label>
                                <p className="font-medium">{reportData.patient_phone}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Ward</label>
                                <p className="font-medium">{reportData.patient_ward || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Departments Visited</label>
                            <div className="flex flex-wrap gap-2">
                                {reportData.departments?.map(dept => (
                                    <span key={dept} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold print:border print:border-slate-300 print:text-black">
                                        {dept}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* RIGHT COLUMN – Vitals */}
                <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden print:shadow-none print:border print:rounded-lg">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 print:bg-white print:border-b-2">
                        <CardTitle className="flex items-center gap-2 text-blue-700 text-lg print:text-black">
                            <Activity size={20} />
                            Vitals
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-50/50 print:bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 font-bold">Parameter</th>
                                    <th className="px-6 py-3 font-bold">Result</th>
                                    <th className="px-6 py-3 font-bold text-right">Normal Range</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <VitalRow label="Blood Pressure" value={reportData.vital_bp} normal="120/80 mmHg" />
                                <VitalRow label="Blood Sugar" value={reportData.vital_blood_sugar} normal="70–140 mg/dL" />
                                <VitalRow label="Weight" value={reportData.vital_weight} normal="Unit: kg" />
                                <VitalRow label="Temperature" value={reportData.vital_temp} normal="36.5–37.5 °C" />
                                <VitalRow label="SpO₂" value={reportData.vital_spo2} normal="≥95%" />
                                <VitalRow label="Pulse Rate" value={reportData.vital_pulse} normal="60–100 bpm" />
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Doctor’s Advice Section */}
            <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden print:shadow-none print:border print:rounded-lg">
                <CardHeader className="bg-slate-50 border-b border-slate-100 print:bg-white print:border-b-2">
                    <CardTitle className="flex items-center gap-2 text-blue-700 text-lg print:text-black">
                        <ClipboardList size={20} />
                        Doctor’s Advice
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="bg-blue-50/30 p-6 rounded-xl border border-blue-100 min-h-[150px] print:bg-white print:border-slate-300">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap italic print:not-italic">
                            {reportData.doctors_advice}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* 4. Doctor Authentication Section */}
            <div className="flex flex-col md:flex-row justify-end items-end gap-4 p-6 print:break-inside-avoid">
                <div className="text-center md:text-right">
                    <div className="mb-2">
                        <p className="font-serif text-3xl text-slate-800 italic border-b-2 border-slate-200 px-8 inline-block">
                            {reportData.doctor_signature}
                        </p>
                    </div>
                    <p className="font-black text-blue-600 uppercase tracking-widest text-sm print:text-black">{reportData.doctor_name}</p>
                    <p className="text-[10px] text-slate-400 font-bold">AUTHORIZED MEDICAL OFFICER</p>
                </div>
            </div>

            {/* 5. Follow-up Section (Footer Card) */}
            <footer className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden print:bg-none print:text-black print:border print:shadow-none">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl print:hidden"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <h2 className="text-2xl font-bold">Follow-up Registration</h2>
                        <p className="text-blue-50 text-sm leading-relaxed max-w-xl print:text-black">
                            If you have any further health concerns, please reach out to our support team at
                            <span className="font-bold text-white mx-1 print:text-black">HealthGhar</span>.
                            Our team is available for doorstep consultations and follow-up medical care.
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <a href="tel:9840033680" className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full font-bold text-sm shadow-sm hover:bg-blue-50 transition-colors print:border print:border-black print:text-black">
                                <Phone size={16} />
                                9840033680
                            </a>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-inner flex flex-col items-center gap-2 print:border print:border-black">
                        <QrCode size={100} className="text-slate-900" />
                        <p className="text-[10px] text-slate-500 font-bold text-center uppercase">Scan to Book Visit</p>
                    </div>
                </div>
            </footer>

        </div>
    );
};

// Helper component for Vitals Table rows
const VitalRow = ({ label, value, normal }: { label: string; value: string | number; normal: string }) => (
    <tr className="hover:bg-slate-50/50 transition-colors print:hover:bg-transparent">
        <td className="px-6 py-4 font-semibold text-slate-600 print:text-black">{label}</td>
        <td className="px-6 py-4">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md font-bold print:bg-transparent print:text-black print:border print:px-0">
                {value || '--'}
            </span>
        </td>
        <td className="px-6 py-4 text-right text-slate-400 text-xs font-medium italic print:text-slate-600">{normal}</td>
    </tr>
);
