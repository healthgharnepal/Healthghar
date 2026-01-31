
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

export function CTA() {
    return (
        <section className="container py-12 md:py-24 lg:pt-8 lg:pb-32">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
                <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
                    Need healthcare today?
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                    Get in touch with us now.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row mt-4">
                    <Button asChild size="lg" className="bg-gradient-to-b from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-[0px_4px_0px_0px_#14532d] active:shadow-none active:translate-y-[4px] transition-all border-none">
                        <Link href="https://wa.me/YOUR_NUMBER" target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="mr-2 h-4 w-4 drop-shadow-sm" />
                            Book on WhatsApp
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="bg-gradient-to-b from-white to-slate-100 hover:from-slate-100 hover:to-slate-200 shadow-[0px_4px_0px_0px_#cbd5e1] active:shadow-none active:translate-y-[4px] transition-all border-slate-300">
                        <Link href="tel:YOUR_NUMBER">
                            <Phone className="mr-2 h-4 w-4 text-primary" />
                            Call HealthGhar
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
