import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-muted/50 py-12 md:py-16">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="text-xl font-bold text-primary">
                            Healthghar
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Modern healthcare simplified for everyone. Book appointments, manage records, and more.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold">Product</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">Features</Link></li>
                            <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-primary">Security</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">About Us</Link></li>
                            <li><Link href="#" className="hover:text-primary">Careers</Link></li>
                            <li><Link href="#" className="hover:text-primary">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 flex flex-col items-center justify-between border-t border-border pt-8 md:flex-row text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Healthghar. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
