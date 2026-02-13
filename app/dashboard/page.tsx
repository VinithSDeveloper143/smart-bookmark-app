import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BookmarkManager from "@/components/bookmark-manager";
import SignOutButton from "@/components/sign-out-button";
import { Bookmark } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 border-b shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-primary">
                        <Bookmark className="w-6 h-6 fill-primary" />
                        <span>SmartMarks</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:inline-block">
                            {user.email}
                        </span>
                        <SignOutButton />
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">My Bookmarks</h1>
                    <p className="text-muted-foreground text-lg">
                        Manage your personal collection of links.
                    </p>
                </div>

                <BookmarkManager
                    initialBookmarks={bookmarks || []}
                    userId={user.id}
                />
            </main>
        </div>
    );
}
