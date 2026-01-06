'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-background px-4 pt-24 text-center md:px-12 md:pt-32">
            {/* Background gradients */}
            <div className="absolute top-[-10%] left-[-10%] h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-primary/5 blur-[80px] md:blur-[100px] pointer-events-none select-none" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-blue-500/5 blur-[80px] md:blur-[100px] pointer-events-none select-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl relative z-10"
            >
                <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl">
                    Modern Healthcare <br />
                    <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent drop-shadow-sm pb-2 inline-block">
                        Simplified for Everyone
                    </span>
                </h1>
                <p className="mb-10 mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                    Experience seamless doctor appointments, secure health records, and personalized care.
                    Join Healthghar today for a healthier tomorrow.
                </p>

                <div className="relative z-50 flex flex-col items-center justify-center gap-4 sm:flex-row pointer-events-auto">
                    <Link href="/login" className="inline-block">
                        <Button size="lg" className="h-12 px-8 text-base">
                            Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        size="lg"
                        className="h-12 px-8 text-base cursor-pointer"
                        onClick={() => {
                            const featuresSection = document.getElementById('features');
                            if (featuresSection) {
                                featuresSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    >
                        Learn More
                    </Button>
                </div>
            </motion.div>
        </section>
    );
}
