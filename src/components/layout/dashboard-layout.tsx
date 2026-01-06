'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, User, Calendar, FileText, Tent, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const navItems = [
        { label: 'Home', href: '/user/home', icon: Home },
        { label: 'Profile', href: '/user/profile', icon: User },
        { label: 'Bookings', href: '/user/bookings', icon: Calendar },
        { label: 'Upcoming Camps', href: '/user/camps', icon: Tent },
        { label: 'My Reports', href: '#', icon: FileText }, // Placeholder
    ];

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-black font-sans flex flex-row-reverse">
            {/* Desktop Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex fixed top-4 right-4 z-[60] bg-white/50 backdrop-blur-sm hover:bg-white/80 border shadow-sm dark:bg-black/50 dark:hover:bg-black/80"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Desktop Sidebar (Right Side) */}
            <aside
                className={cn(
                    "hidden md:flex w-52 flex-col border-l bg-white dark:bg-black fixed right-0 inset-y-0 z-50 transition-transform duration-300 ease-in-out",
                    isSidebarOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex h-16 items-center px-6 border-b justify-start">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <LayoutDashboard className="h-6 w-6" />
                        Healthghar
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-900"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={handleSignOut}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-4 bg-white/80 backdrop-blur-md border-b dark:bg-black/80">
                <Link href="/" className="font-bold text-lg text-primary">Healthghar</Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Mobile Menu Drawer (Right Side) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed inset-y-0 right-0 z-50 w-3/4 max-w-xs bg-white dark:bg-black border-l flex flex-col md:hidden"
                        >
                            <div className="flex h-16 items-center px-6 border-b">
                                <span className="font-bold text-xl">Menu</span>
                            </div>
                            <nav className="flex-1 py-6 px-4 space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                                            pathname === item.href
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-900"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                            <div className="p-4 border-t">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-red-600"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </Button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main
                className={cn(
                    "flex-1 pt-16 md:pt-0 min-h-screen transition-all duration-300 ease-in-out w-full",
                    isSidebarOpen ? "md:pr-52" : "md:pr-0"
                )}
            >
                <div className="container mx-auto p-4 md:p-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
