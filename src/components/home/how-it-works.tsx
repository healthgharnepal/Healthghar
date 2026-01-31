
import { MousePointerClick, MessageCircle, CheckCircle, Truck } from "lucide-react";

interface StepProps {
    title: string;
    description: string;
    icon: React.ElementType;
}

const steps: StepProps[] = [
    {
        title: "1. Choose Service",
        description: "Select the healthcare service you need.",
        icon: MousePointerClick,
    },
    {
        title: "2. Book Details",
        description: "Book via WhatsApp or simple form.",
        icon: MessageCircle,
    },
    {
        title: "3. Confirmation",
        description: "Get instant confirmation from HealthGhar.",
        icon: CheckCircle,
    },
    {
        title: "4. Service Delivered",
        description: "Experience quality care at your convenience.",
        icon: Truck,
    },
];

export function HowItWorks() {
    return (
        <section className="container mx-auto px-4 md:px-6 py-12 md:pb-24 md:pt-8 lg:pb-12 lg:pt-12 bg-slate-50 dark:bg-slate-900/50">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
                <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
                    How HealthGhar Works
                </h2>
                <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                    Simple steps to get the care you need.
                </p>
            </div>
            <div className="mx-auto grid justify-center gap-8 grid-cols-2 md:max-w-[64rem] md:grid-cols-4 mt-8">
                {steps.map((step) => (
                    <div key={step.title} className="flex flex-col items-center text-center p-4 sm:p-6 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-slate-300 hover:shadow-lg transition-all duration-300">
                        <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 shadow-inner mb-3 sm:mb-4">
                            <step.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        </div>
                        <h3 className="text-base sm:text-xl font-bold">{step.title}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
