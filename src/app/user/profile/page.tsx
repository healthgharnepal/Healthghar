import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { updateProfile } from '@/app/actions/user-update';
import Link from 'next/link';
import { ArrowLeft, User, Phone, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function ProfilePage({ searchParams }: { searchParams: { updated?: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <div className="flex justify-center w-full">
            <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header Section */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Profile Settings</h1>
                        <p className="text-muted-foreground">Manage your account settings and personal information.</p>
                    </div>
                </div>

                {searchParams?.updated && (
                    <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Your profile has been updated successfully.</span>
                    </div>
                )}

                <Card className="border-white/20 bg-white/50 dark:bg-black/40 backdrop-blur-xl shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Personal Information</CardTitle>
                        <CardDescription>
                            Update your personal details here. Click save when you're done.
                        </CardDescription>
                    </CardHeader>

                    <form action={updateProfile}>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="fullName"
                                            value={profile?.full_name || ''}
                                            disabled
                                            className="pl-9 bg-gray-50/50 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Name cannot be changed. Contact support for help.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="flex gap-2">
                                        <select
                                            name="countryCode"
                                            defaultValue={(() => {
                                                const phone = profile?.phone || '';
                                                const codes = ['+1', '+91', '+44', '+977', '+81'];
                                                const found = codes.find(c => phone.startsWith(c));
                                                return found || '+91';
                                            })()}
                                            className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        >
                                            <option value="+91">+91 (IN)</option>
                                            <option value="+1">+1 (US)</option>
                                            <option value="+44">+44 (UK)</option>
                                            <option value="+977">+977 (NP)</option>
                                            <option value="+81">+81 (JP)</option>
                                        </select>
                                        <div className="relative flex-1">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                name="localPhone"
                                                type="tel"
                                                defaultValue={(() => {
                                                    const phone = profile?.phone || '';
                                                    const codes = ['+1', '+91', '+44', '+977', '+81'];
                                                    const found = codes.find(c => phone.startsWith(c));
                                                    return found ? phone.slice(found.length).trim() : phone;
                                                })()}
                                                required
                                                className="pl-9"
                                                placeholder="98765 43210"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="age"
                                            name="age"
                                            type="number"
                                            defaultValue={profile?.age || ''}
                                            required
                                            className="pl-9"
                                            placeholder="Your age"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <div className="relative">
                                        <select
                                            id="gender"
                                            name="gender"
                                            defaultValue={profile?.gender || ''}
                                            required
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="" disabled>Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <textarea
                                        id="address"
                                        name="address"
                                        defaultValue={profile?.address || ''}
                                        required
                                        rows={3}
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9 pt-2.5"
                                        placeholder="Enter your full address"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-4 border-t px-6 py-4 bg-gray-50/50 dark:bg-black/20">
                            <Link href="/user/home">
                                <Button variant="ghost" type="button">Cancel</Button>
                            </Link>
                            <Button type="submit" className="bg-primary hover:bg-primary/90">
                                Save Changes
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
