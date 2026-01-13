'use client'

import { useState } from 'react';
import {
    Activity,
    User,
    Phone,
    QrCode,
    Calendar,
    ClipboardList,
    FileText,
    Tent,
    Home,
    Video,
    ChevronRight,
    ArrowLeft,
    Download
} from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface ReportProps {
    campReports: any[];
    homeReports: any[];
    telehealthReports: any[];
}

export default function ReportsClientView({ campReports, homeReports, telehealthReports }: ReportProps) {
    const [activeTab, setActiveTab] = useState<'camp' | 'home' | 'telehealth'>('camp');
    const [selectedReport, setSelectedReport] = useState<any>(null);

    // Get current list based on active tab
    const currentReports = {
        camp: campReports,
        home: homeReports,
        telehealth: telehealthReports
    }[activeTab];

    const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
        <button
            onClick={() => { setActiveTab(id); setSelectedReport(null); }}
            className={cn(
                "flex items-center justify-center gap-2 px-3 py-3 rounded-xl transition-all whitespace-nowrap md:rounded-full md:px-6",
                "flex-1 text-xs md:flex-none md:text-sm font-bold", // Mobile: flex-1, smaller text
                activeTab === id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            )}
        >
            <Icon className="w-4 h-4 md:w-5 md:h-5" />
            <span>{label}</span>
        </button>
    );

    // If a report is selected, show the Detail View
    if (selectedReport) {
        return (
            <div className="min-h-screen bg-slate-50 p-2 md:p-8 print:p-0 print:bg-white">
                <div className="max-w-5xl mx-auto mb-4 md:mb-6 print:hidden">
                    <button
                        onClick={() => setSelectedReport(null)}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors py-2 px-1 rounded-lg active:bg-slate-100"
                    >
                        <ArrowLeft size={20} />
                        Back to {activeTab === 'camp' ? 'Camp' : activeTab === 'home' ? 'Home Checkup' : 'Telehealth'} Reports
                    </button>
                </div>
                <HealthReportCard reportData={selectedReport} />
            </div>
        );
    }

    // Default: Show List View with Tabs
    return (
        <div className="min-h-screen bg-slate-50/50 p-3 md:p-8 space-y-6 md:space-y-8">

            {/* Header & Tabs */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Medical Reports</h1>
                    <p className="text-slate-500">View and download your health history</p>
                </div>

                {/* Tabs Container - Android Friendly (Full width buttons on mobile) */}
                <div className="flex gap-2 p-1 bg-slate-100/50 rounded-2xl overflow-hidden md:bg-transparent md:p-0 md:rounded-none md:overflow-visible">
                    <TabButton id="camp" label="Camp" icon={Tent} />
                    <TabButton id="home" label="Home" icon={Home} />
                    <TabButton id="telehealth" label="Telehealth" icon={Video} />
                </div>
            </div>

            {/* Reports List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="wait">
                    {currentReports && currentReports.length > 0 ? (
                        currentReports.map((report, idx) => {
                            // Determine display title based on report type
                            // For camps: Try to get the camp name from the nested join
                            let title = "Medical Report";
                            const createdDate = new Date(report.created_at).toLocaleDateString('en-US');

                            if (activeTab === 'camp') {
                                // Check both 'camps' and 'upcoming_camps' relations in case of schema variations
                                const campName = report.camp_bookings?.camps?.title ||
                                    report.camp_bookings?.upcoming_camps?.title ||
                                    "Health Camp Report";
                                title = campName;
                            } else if (activeTab === 'home') {
                                title = report.package_name || "Home Checkup Report";
                            } else if (activeTab === 'telehealth') {
                                title = report.doctor_name ? `Dr. ${report.doctor_name} Consultation` : "Telehealth Report";
                            }

                            return (
                                <motion.div
                                    key={report.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => setSelectedReport(report)}
                                    className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 cursor-pointer transition-all active:scale-95"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "p-3 rounded-xl",
                                                activeTab === 'camp' ? "bg-orange-50 text-orange-600" :
                                                    activeTab === 'home' ? "bg-blue-50 text-blue-600" :
                                                        "bg-purple-50 text-purple-600"
                                            )}>
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-1">
                                                    {title}
                                                </h3>
                                                <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {createdDate}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-xs">
                                        <span className="text-slate-400 font-medium uppercase tracking-wider">Patient</span>
                                        <span className="font-bold text-slate-700">{report.patient_name}</span>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="text-slate-300" size={32} />
                            </div>
                            <h3 className="text-slate-900 font-semibold">No Reports Found</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                There are no {activeTab === 'camp' ? 'camp' : activeTab === 'home' ? 'home checkup' : 'telehealth'} reports available yet.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
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
        // Optional fields that might exist in other report types
        [key: string]: any;
    };
}

const HealthReportCard = ({ reportData }: HealthReportProps) => {
    const today = new Date(reportData.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6 print:space-y-2 print:p-8 print:text-sm w-full print:flex print:flex-col print:h-screen print:justify-between">
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body {
                        print-color-adjust: exact !important;
                        -webkit-print-color-adjust: exact !important;
                    }
                }
            `}</style>

            {/* 1. Header Section */}
            <header className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 print:flex-row print:justify-between print:items-center print:shadow-none print:border-b print:rounded-none print:p-4 print:bg-blue-50/30 print:gap-2">
                <div className="text-center md:text-left print:text-left">
                    <h1 className="text-3xl font-black tracking-tight text-blue-600 print:text-black print:text-2xl">HEALTH REPORT CARD</h1>
                    <p className="text-slate-500 font-medium print:text-slate-600 print:text-xs">Preventive Health | Community Care | Doorstep Services</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-slate-400 print:mt-1 print:text-xs">
                        <Calendar size={16} className="print:w-3 print:h-3" />
                        <span>Issued on: {today}</span>
                    </div>
                </div>
                <div className="flex flex-col-reverse md:flex-row items-center gap-4 print:flex-row">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-blue-700 transition-colors shadow-blue-200 shadow-md active:scale-95 print:hidden"
                    >
                        <Download size={18} />
                        Download PDF
                    </button>
                    <div className="flex items-center justify-center p-2 print:border-none">
                        <Image
                            src="/HealthGhar_Logo_Upscaled.svg"
                            alt="HealthGhar Logo"
                            width={360}
                            height={96}
                            className="h-24 w-auto"
                        />
                    </div>
                </div>
            </header>

            {/* 2. Main Layout (Two-column on desktop) */}
            <div className="grid grid-cols-2 gap-6 print:grid-cols-2 print:gap-3">

                {/* LEFT COLUMN – Patient Information */}
                <Card className="border-none shadow-md overflow-hidden bg-white rounded-2xl print:shadow-none print:border print:rounded-lg">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 print:bg-blue-600 print:border-none print:rounded-t-lg print:py-2">
                        <CardTitle className="flex items-center gap-2 text-blue-700 text-lg print:text-white">
                            <User size={20} className="print:text-white" />
                            Patient Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4 print:p-3 print:space-y-2">
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
                            {reportData.patient_ward && (
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase">Ward</label>
                                    <p className="font-medium">{reportData.patient_ward}</p>
                                </div>
                            )}
                        </div>
                        {reportData.departments && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Departments Visited</label>
                                <div className="flex flex-wrap gap-2">
                                    {reportData.departments?.map((dept: string) => (
                                        <span key={dept} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold print:border print:border-slate-300 print:text-black">
                                            {dept}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* RIGHT COLUMN – Vitals */}
                <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden print:shadow-none print:border print:rounded-lg">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 print:bg-blue-600 print:border-none print:rounded-t-lg print:py-2">
                        <CardTitle className="flex items-center gap-2 text-blue-700 text-lg print:text-white">
                            <Activity size={20} className="print:text-white" />
                            Vitals
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-left print:text-xs">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-50/50 print:bg-blue-100 print:text-blue-800">
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
                <CardHeader className="bg-slate-50 border-b border-slate-100 print:bg-blue-600 print:border-none print:rounded-t-lg print:py-2">
                    <CardTitle className="flex items-center gap-2 text-blue-700 text-lg print:text-white">
                        <ClipboardList size={20} className="print:text-white" />
                        Doctor’s Advice
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="bg-blue-50/30 p-6 rounded-xl border border-blue-100 min-h-[150px] print:bg-white print:border-slate-300 print:p-3 print:min-h-0">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap italic print:not-italic print:text-sm">
                            {reportData.doctors_advice}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* 4. Doctor Authentication Section */}
            <div className="flex flex-col md:flex-row justify-end items-end gap-4 p-6 print:break-inside-avoid print:p-2 print:gap-1">
                <div className="text-center md:text-right">
                    <div className="mb-2 print:mb-1">
                        <p className="font-serif text-3xl text-slate-800 italic border-b-2 border-slate-200 px-8 inline-block print:text-xl">
                            {reportData.doctor_signature}
                        </p>
                    </div>
                    <p className="font-black text-blue-600 uppercase tracking-widest text-sm print:text-black print:text-xs">{reportData.doctor_name}</p>
                    <p className="text-[10px] text-slate-400 font-bold print:text-[8px]">AUTHORIZED MEDICAL OFFICER</p>
                </div>
            </div>

            {/* 5. Follow-up Section (Footer Card) */}
            <footer className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden print:bg-none print:text-black print:border print:shadow-none print:p-3 print:rounded-lg print:mt-auto">
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
    <tr className="hover:bg-slate-50/50 transition-colors print:hover:bg-transparent even:print:bg-blue-50/30">
        <td className="px-6 py-4 font-semibold text-slate-600 print:text-black print:py-1 print:px-2">{label}</td>
        <td className="px-6 py-4 print:py-1 print:px-2">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md font-bold print:bg-transparent print:text-black print:border print:px-0 print:py-0">
                {value || '--'}
            </span>
        </td>
        <td className="px-6 py-4 text-right text-slate-400 text-xs font-medium italic print:text-slate-600 print:py-1 print:px-2">{normal}</td>
    </tr>
);
