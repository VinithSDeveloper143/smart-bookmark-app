"use client";

import { useRealtimeBookmarks } from "@/hooks/useRealtimeBookmarks";
import BookmarkForm from "@/components/bookmark-form";
import BookmarkList from "@/components/bookmark-list";
import { Database } from "@/types/supabase";

type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];

export default function BookmarkManager({
    initialBookmarks,
    userId
}: {
    initialBookmarks: Bookmark[],
    userId: string
}) {
    const {
        bookmarks,
        addBookmark,
        deleteBookmark,
        setBookmarks,
        error: realtimeError
    } = useRealtimeBookmarks(initialBookmarks, userId);

    const handleAddSuccess = async (url: string, title?: string) => {
        await addBookmark(url, title);
    };

    const handleDelete = async (id: string) => {
        await deleteBookmark(id);
    };

    const handleRestore = (previousBookmarks: Bookmark[]) => {
        setBookmarks(previousBookmarks);
    };

    return (
        <div className="space-y-6">
            {realtimeError && (
                <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md text-sm border border-destructive/20">
                    {realtimeError}
                </div>
            )}

            <BookmarkForm
                userId={userId}
                onSubmit={handleAddSuccess}
            />

            <BookmarkList
                bookmarks={bookmarks}
                userId={userId}
                onDelete={handleDelete}
                onRestore={handleRestore}
            />
        </div>
    );
}
