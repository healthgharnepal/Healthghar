import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Services } from "@/components/home/services";
import { HowItWorks } from "@/components/home/how-it-works";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Stats } from "@/components/home/stats";
import { CTA } from "@/components/home/cta";

export default function ServicesPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased text-foreground selection:bg-primary/20">
            <Navbar />
            <main className="flex-1">
                <Services />
                <HowItWorks />
                <WhyChooseUs />
                <Stats />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}
