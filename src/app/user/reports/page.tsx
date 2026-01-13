import { createClient } from '@/utils/supabase/server';
import ReportsClientView from './client-view';

export default async function UserReportsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500">Please log in to view reports.</p>
            </div>
        );
    }

    // 1. Fetch Camp Reports with Relation to get the Camp Name
    // We try to join camp_reports -> camp_bookings -> camps (or upcoming_camps) to get the 'title'
    // Note: The relation name inside camp_bookings depends on your foreign key naming.
    // Usually 'camps' or 'upcoming_camps'. We fetch both possibilities or rely on 'camps'.
    const { data: campReports } = await supabase
        .from('camp_reports')
        .select(`
            *,
            camp_bookings (
                upcoming_camps ( title )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // 2. Fetch Home Checkup Reports (Placeholder - ensure table exists)
    // const { data: homeReports } = await supabase
    //     .from('home_checkup_reports')
    //     .select('*')
    //     .eq('user_id', user.id);
    const homeReports: any[] = []; // Leaving empty until you create the table

    // 3. Fetch Telehealth Reports (Placeholder - ensure table exists)
    // const { data: telehealthReports } = await supabase
    //     .from('telehealth_reports')
    //     .select('*')
    //     .eq('user_id', user.id);
    const telehealthReports: any[] = []; // Leaving empty until you create the table

    return (
        <ReportsClientView
            campReports={campReports || []}
            homeReports={homeReports}
            telehealthReports={telehealthReports}
        />
    );
}
