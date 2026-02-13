"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";

type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];

export function useRealtimeBookmarks(initialBookmarks: Bookmark[], userId: string) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();
    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

    useEffect(() => {
        let isMounted = true;

        const setupSubscription = async () => {
            // 1. Check session first
            const { data: { session } } = await supabase.auth.getSession();
            if (!isMounted) return;

            console.log(`[Realtime] Session check for ${userId}:`, session ? "Active" : "None");
            if (!session) {
                console.warn("[Realtime] Warning: No active session. RLS might block updates.");
            }

            // 2. Clean up any existing channel before creating a new one
            if (channelRef.current) {
                console.log("[Realtime] Removing existing channel before re-subscribing");
                supabase.removeChannel(channelRef.current);
            }

            const channelName = `bookmarks-realtime-${userId}`;
            console.log(`[Realtime] Subscribing to: ${channelName}`);

            const channel = supabase
                .channel(channelName)
                .on(
                    "postgres_changes",
                    { event: "INSERT", schema: "public", table: "bookmarks" },
                    (payload) => {
                        if (!isMounted) return;
                        console.log("[Realtime] INSERT received:", payload.new);
                        const newBookmark = payload.new as Bookmark;
                        setBookmarks((prev) => {
                            if (prev.some((b) => b.id === newBookmark.id)) return prev;
                            return [newBookmark, ...prev];
                        });
                    }
                )
                .on(
                    "postgres_changes",
                    { event: "UPDATE", schema: "public", table: "bookmarks" },
                    (payload) => {
                        if (!isMounted) return;
                        console.log("[Realtime] UPDATE received:", payload.new);
                        const updatedBookmark = payload.new as Bookmark;
                        setBookmarks((prev) =>
                            prev.map((b) => (b.id === updatedBookmark.id ? updatedBookmark : b))
                        );
                    }
                )
                .on(
                    "postgres_changes",
                    { event: "DELETE", schema: "public", table: "bookmarks" },
                    (payload) => {
                        if (!isMounted) return;
                        console.log("[Realtime] DELETE received:", payload.old);
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
                    }
                );

            channel.subscribe((status, err) => {
                if (!isMounted) return;
                console.log(`[Realtime] Channel status: ${status}`);
                if (err) console.error("[Realtime] Subscription error:", err);

                if (status === "CHANNEL_ERROR") {
                    setError("Realtime connection error. Please refresh the page.");
                }
                if (status === "TIMED_OUT") {
                    console.warn("[Realtime] Subscription timed out. Check Supabase Replication settings.");
                }
            });

            channelRef.current = channel;
        };

        setupSubscription();

        return () => {
            isMounted = false;
            if (channelRef.current) {
                console.log(`[Realtime] Cleaning up channel: ${channelRef.current.topic}`);
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, [supabase, userId]);

    const addBookmark = useCallback(async (url: string, title?: string) => {
        setLoading(true);
        setError(null);

        let finalTitle = title;
        if (!finalTitle) {
            try {
                const urlObj = new URL(url);
                finalTitle = urlObj.hostname;
            } catch (e) {
                finalTitle = url;
            }
        }

        // Use custom cast because of Postgrest type mismatches with SSR client
        const { data, error: insertError } = await (supabase
            .from("bookmarks") as any)
            .insert({
                user_id: userId,
                url,
                title: finalTitle || url,
            })
            .select()
            .single();

        if (insertError) {
            setError(insertError.message);
            setLoading(false);
            return { data: null, error: insertError };
        }

        // Optimistic UI update
        if (data) {
            setBookmarks((prev) => {
                if (prev.some(b => b.id === data.id)) return prev;
                return [data, ...prev];
            });
        }

        setLoading(false);
        return { data, error: null };
    }, [supabase, userId]);

    const deleteBookmark = useCallback(async (id: string) => {
        const previousBookmarks = [...bookmarks];
        setBookmarks((prev) => prev.filter((b) => b.id !== id));

        const { error: deleteError } = await supabase
            .from("bookmarks")
            .delete()
            .eq("id", id);

        if (deleteError) {
            setError(deleteError.message);
            setBookmarks(previousBookmarks);
            return { error: deleteError };
        }

        return { error: null };
    }, [supabase, bookmarks]);

    return {
        bookmarks,
        loading,
        error,
        addBookmark,
        deleteBookmark,
        setBookmarks
    };
}
