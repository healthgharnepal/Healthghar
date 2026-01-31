
export function Stats() {
    return (
        <section className="container py-12 md:py-24 lg:pt-12 lg:pb-12 bg-primary text-primary-foreground">
            <div className="mx-auto grid justify-center gap-4 sm:gap-8 grid-cols-2 sm:grid-cols-3 text-center md:max-w-[64rem]">
                <div className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm shadow-inner border border-white/10">
                    <span className="text-4xl md:text-6xl font-bold drop-shadow-md">50+</span>
                    <span className="text-lg md:text-xl mt-2 font-medium">Doctors</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm shadow-inner border border-white/10">
                    <span className="text-4xl md:text-6xl font-bold drop-shadow-md">20+</span>
                    <span className="text-lg md:text-xl mt-2 font-medium">Labs</span>
                </div>
                <div className="flex flex-col items-center col-span-2 sm:col-span-1 p-4 bg-white/10 rounded-xl backdrop-blur-sm shadow-inner border border-white/10">
                    <span className="text-4xl md:text-6xl font-bold drop-shadow-md">1000+</span>
                    <span className="text-lg md:text-xl mt-2 font-medium">Patients Served</span>
                </div>
            </div>
        </section>
    );
}
