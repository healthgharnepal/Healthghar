
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Stethoscope, FlaskConical, Pill, HeartPulse } from "lucide-react";

interface ServiceProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

const servicesList: ServiceProps[] = [
  {
    title: "Doctor Appointment",
    description: "Book verified doctors & clinics near you",
    icon: Stethoscope,
    href: "/services/doctor-appointment",
  },
  {
    title: "Lab Tests at Home",
    description: "Sample collection from your home",
    icon: FlaskConical,
    href: "/services/lab-tests",
  },
  {
    title: "Online Medicine Order",
    description: "Medicines delivered to your doorstep",
    icon: Pill,
    href: "/services/medicine",
  },
  {
    title: "Health Packages",
    description: "Affordable checkups & wellness plans",
    icon: HeartPulse,
    href: "/services/health-packages",
  },
];

export function Services() {
  return (
    <section className="container mx-auto px-4 md:px-6 py-12 md:pt-24 md:pb-8 lg:pt-32 lg:pb-12 overflow-hidden">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
          Services
        </h2>
      </div>
      <div className="mx-auto grid justify-center gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mt-8 w-full">
        {servicesList.map((service) => (
          <Card key={service.title} className="flex flex-col justify-between bg-white border-slate-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 rounded-xl">
            <CardHeader>
              <service.icon className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
