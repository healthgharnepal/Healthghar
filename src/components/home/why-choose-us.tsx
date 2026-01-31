
import { ShieldCheck, MapPin, Wallet, Home, Headphones } from "lucide-react";

interface FeatureProps {
    title: string;
    description: string;
    icon: React.ElementType;
}

const features: FeatureProps[] = [
    {
        title: "Verified Doctors & Labs",
        description: "100% verified and certified healthcare professionals.",
        icon: ShieldCheck,
    },
    {
        title: "Local Healthcare Partners",
        description: "Trusted local clinics and labs in your neighborhood.",
        icon: MapPin,
    },
    {
        title: "Transparent Pricing",
        description: "No hidden charges. Pay what you see.",
        icon: Wallet,
    },
    {
        title: "Home Service Available",
        description: "Lab tests and consultations from the comfort of your home.",
        icon: Home,
    },
    {
        title: "Fast Customer Support",
        description: "We are always here to help you with your queries.",
        icon: Headphones,
    },
];

export function WhyChooseUs() {
    return (
        <section className="container mx-auto px-4 md:px-6 py-12 md:py-24 lg:pt-12 lg:pb-12 overflow-hidden">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
                <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
                    Why HealthGhar?
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                    Choose us for trusted, affordable, and accessible healthcare.
                </p>
            </div>
            <div className="mx-auto grid justify-center gap-3 sm:gap-8 grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-8">
                {features.map((feature) => (
                    <div key={feature.title} className="flex flex-col items-center text-center p-4 sm:p-6 border border-slate-300 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 shadow-inner mb-3 sm:mb-4">
                            <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-base sm:text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
