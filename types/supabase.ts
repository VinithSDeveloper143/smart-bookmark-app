export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            bookmarks: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    url: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    url: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    url?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "bookmarks_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
