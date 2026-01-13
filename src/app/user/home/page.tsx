import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Home, Video, Tent, FileText, Crown, Calendar, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default async function UserHome() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const quickActions = [
        {
            title: 'Home Checkup',
            description: 'Schedule a doctor visit at home',
            icon: Home,
            color: 'text-blue-600',
            bg: 'bg-blue-100/50 dark:bg-blue-900/20',
            href: '/user/home-checkup',
            delay: 'delay-[100ms]'
        },
        {
            title: 'Telehealth',
            description: 'Consult specialists online',
            icon: Video,
            color: 'text-violet-600',
            bg: 'bg-violet-100/50 dark:bg-violet-900/20',
            href: '/user/telehealth',
            delay: 'delay-[200ms]'
        },
        {
            title: 'Upcoming Camps',
            description: 'Join health camps near you',
            icon: Tent,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100/50 dark:bg-emerald-900/20',
            href: '/user/camps',
            delay: 'delay-[300ms]'
        },
        {
            title: 'My Reports',
            description: 'Access your medical history',
            icon: FileText,
            color: 'text-orange-600',
            bg: 'bg-orange-100/50 dark:bg-orange-900/20',
            href: '/user/reports',
            delay: 'delay-[400ms]'
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Welcome back, {profile?.full_name?.split(' ')[0] || 'User'} 👋
                </h1>
                <p className="text-muted-foreground text-lg">
                    Manage your health journey with ease.
                </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action) => (
                    <Link key={action.title} href={action.href} className={`group block h-full animate-in zoom-in-95 duration-500 fill-mode-both ${action.delay}`}>
                        <Card className="h-full border-transparent bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 dark:bg-gray-900">
                            <CardContent className="p-4 md:p-6 flex flex-col items-center text-center gap-3 md:gap-4 h-full justify-center">
                                <div className={`p-3 md:p-4 rounded-full ${action.bg} transition-transform group-hover:scale-110 duration-300`}>
                                    <action.icon className={`h-6 w-6 md:h-8 md:w-8 ${action.color}`} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm md:text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                                        {action.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed hidden md:block">
                                        {action.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Status Section */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
                {/* Upcoming Bookings Widget (Moved First) */}
                <Link href="/user/bookings" className="block group h-full">
                    <Card className="h-full bg-white border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all dark:bg-gray-900 text-left h-32 md:h-40">
                        <CardContent className="p-6 flex items-center gap-4 md:gap-6 h-full">
                            <div className="p-3 md:p-4 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors dark:bg-blue-900/30 shrink-0">
                                <Calendar className="h-6 w-6 md:h-8 md:w-8" />
                            </div>
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-foreground mb-0.5">Bookings</h3>
                                <p className="text-xs md:text-sm text-muted-foreground">Check appointments.</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Membership Card (Moved Second) */}
                <Card className="relative overflow-hidden border-none bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg h-32 md:h-auto">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-24 w-24 rounded-full bg-black/10 blur-2xl" />

                    <CardContent className="p-6 flex items-center gap-4 md:gap-6 relative z-10 h-full">
                        <div className="p-3 md:p-4 rounded-full bg-white/20 backdrop-blur-sm shadow-inner shrink-0">
                            <Crown className="h-6 w-6 md:h-8 md:w-8 text-yellow-300" />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-2xl font-bold mb-0.5">Premium</h3>
                            <p className="text-xs md:text-sm text-indigo-100 line-clamp-1">Pro benefits & support.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
