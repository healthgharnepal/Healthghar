
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Shield, Users, Award, Quote } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased text-foreground selection:bg-primary/20">
            <Navbar />
            <main className="flex-1">
                <section className="container mx-auto px-4 md:px-6 py-12 md:py-24 lg:py-32">
                    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl p-8 md:p-12 lg:p-16 text-center max-w-[64rem] mx-auto">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">Who We Are</span>
                        <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl mb-6 text-slate-900">
                            About <span className="text-blue-600">HealthGhar</span>
                        </h1>
                        <p className="max-w-2xl mx-auto leading-relaxed text-slate-600 sm:text-lg mb-6">
                            HealthGhar is a local healthcare service platform built to make medical services simple, accessible, and reliable. We connect patients with trusted doctors, diagnostic labs, and pharmacies through one easy system.
                        </p>
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mb-6"></div>
                        <p className="max-w-2xl mx-auto leading-relaxed text-slate-600 sm:text-lg">
                            Our focus is on convenience, affordability, and quality healthcare — especially for people who prefer home services or local clinics.
                        </p>
                    </div>

                    <div className="mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 mt-16 max-w-[64rem]">
                        <Card className="bg-white border-slate-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 rounded-xl">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 shadow-inner">
                                    <Target className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">Our Mission</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    To make quality healthcare accessible to everyone by connecting patients with trusted medical service providers through a simple digital platform.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-slate-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 rounded-xl">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 shadow-inner">
                                    <Eye className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">Our Vision</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    To become a trusted healthcare platform in Nepal by improving how people book, access, and receive medical services — both online and offline.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="relative mt-24 max-w-4xl mx-auto">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white p-3 rounded-full border border-slate-200 shadow-sm z-10">
                            <Quote className="h-8 w-8 text-blue-600 fill-blue-50" />
                        </div>
                        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl p-6 md:p-8 text-center shadow-lg relative overflow-hidden">
                            <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl mb-4 text-slate-900">Why We Started</h2>
                            <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-700 italic max-w-3xl mx-auto">
                                &quot;Many people struggle to find reliable doctors, affordable lab tests, or timely medicine delivery.&quot;
                            </p>
                            <div className="mt-5 flex flex-col items-center">
                                <div className="h-6 w-px bg-slate-300 mb-3"></div>
                                <p className="max-w-2xl mx-auto leading-relaxed text-slate-600 sm:text-lg">
                                    <span className="font-semibold text-blue-600">HealthGhar</span> was created to solve this gap by bringing healthcare services closer to homes through technology and local partnerships.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto mt-16 max-w-[64rem]">
                        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl text-center mb-8">Our Values</h2>
                        <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4">
                            {[
                                { title: "Trust & Transparency", icon: Shield },
                                { title: "Patient-first approach", icon: Heart },
                                { title: "Local healthcare support", icon: Users },
                                { title: "Quality service delivery", icon: Award },
                            ].map((value) => (
                                <div key={value.title} className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-slate-300 hover:shadow-lg transition-all duration-300">
                                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-50 shadow-inner mb-3 sm:mb-4">
                                        <value.icon className="h-5 w-5 sm:h-6 sm:w-6 text-green-700" />
                                    </div>
                                    <h3 className="text-sm sm:text-lg font-bold">{value.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>

                </section>
            </main>
            <Footer />
        </div>
    );
}
