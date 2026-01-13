'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
        // Keep loading true while redirecting
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-background to-background dark:from-blue-950 dark:via-background dark:to-background" />
            <div className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-violet-500/10 blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md px-6"
            >
                <Card className="border-white/20 bg-white/30 shadow-2xl backdrop-blur-2xl dark:bg-black/30 dark:border-white/10">
                    <CardHeader className="relative text-center space-y-2 pb-6 pt-12">
                        <Link href="/" className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="mx-auto mb-6 flex justify-center">
                            <Image
                                src="/HealthGhar_Logo_Upscaled.svg"
                                alt="HealthGhar Logo"
                                width={720}
                                height={192}
                                className="h-48 w-auto"
                            />
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight">Welcome Back</CardTitle>
                        <CardDescription className="text-base">
                            Sign in to Healthghar to access your dashboard
                        </CardDescription>
                    </CardHeader >
                    <CardContent className="grid gap-4">
                        <Button
                            variant="outline"
                            size="lg"
                            className="relative flex h-14 w-full items-center justify-center gap-3 rounded-xl border-gray-200 bg-white text-base font-medium text-black transition-all hover:bg-gray-50 hover:shadow-md dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900 dark:border-gray-800"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin text-primary" />
                            ) : (
                                <>
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.489 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.989 -25.464 56.619 L -21.484 53.529 Z" />
                                            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.439 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                        </g>
                                    </svg>
                                    <span>Sign in with Google</span>
                                </>
                            )}
                        </Button>
                    </CardContent>
                    <CardFooter className="flex justify-center text-sm text-muted-foreground">
                        <p>
                            By signing in, you agree to our{' '}
                            <Link href="#" className="underline hover:text-primary">Terms</Link>
                            {' '}and{' '}
                            <Link href="#" className="underline hover:text-primary">Privacy Policy</Link>
                            .
                        </p>
                    </CardFooter>
                </Card >
            </motion.div >
        </div >
    );
}
