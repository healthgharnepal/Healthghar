'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar, Shield, Activity, Users } from "lucide-react";

const features = [
    {
        icon: Calendar,
        title: "Easy Scheduling",
        description: "Book appointments with top specialists in just a few clicks.",
    },
    {
        icon: Shield,
        title: "Secure Records",
        description: "Your health data is encrypted and safe, accessible only to you.",
    },
    {
        icon: Activity,
        title: "Real-time Monitoring",
        description: "Track your vitals and health progress with our intuitive dashboard.",
    },
    {
        icon: Users,
        title: "Family Accounts",
        description: "Manage healthcare for your entire family from one account.",
    },
];

export function Features() {
    return (
        <section id="features" className="container mx-auto px-6 py-24 md:px-12 scroll-mt-28">
            <div className="mb-16 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Why Choose Healthghar?
                </h2>
                <p className="mt-4 text-muted-foreground">
                    Everything you need for better health management in one place.
                </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                            <CardHeader>
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <feature.icon size={24} />
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
