'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/about", label: "About" },
        { href: "/services", label: "Services" },
        { href: "#", label: "Doctors" },
        { href: "#", label: "Contact" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 z-[100] w-full transition-all duration-300",
                isScrolled || isMobileMenuOpen
                    ? "bg-background/80 backdrop-blur-md shadow-sm border-b"
                    : "bg-transparent"
            )}
        >
            <div className="container mx-auto flex h-20 items-center justify-between px-6 md:px-12">
                <Link href="/" className="flex items-center gap-2 -ml-10">
                    <Image
                        src="/HealthGhar_Logo_Upscaled.svg"
                        alt="HealthGhar Logo"
                        width={400}
                        height={96}
                        className="h-24 w-auto"
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden gap-8 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden items-center gap-4 md:flex">
                    <Link href="/login">
                        <Button>Sign In</Button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b bg-background md:hidden"
                    >
                        <div className="flex flex-col space-y-4 p-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="font-medium text-lg text-foreground transition-colors hover:text-primary"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full bg-black text-white hover:bg-black/90 transition-opacity">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
