export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      manual_publish_tasks: {
        Row: {
          body_copied_at: string | null
          completed_at: string | null
          created_at: string
          id: string
          media_downloaded_at: string | null
          notes: string | null
          opened_platform_at: string | null
          post_draft_id: string
          status: string
          target_channel: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body_copied_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          media_downloaded_at?: string | null
          notes?: string | null
          opened_platform_at?: string | null
          post_draft_id: string
          status?: string
          target_channel: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body_copied_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          media_downloaded_at?: string | null
          notes?: string | null
          opened_platform_at?: string | null
          post_draft_id?: string
          status?: string
          target_channel?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "manual_publish_tasks_post_draft_id_fkey"
            columns: ["post_draft_id"]
            isOneToOne: false
            referencedRelation: "post_drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_publish_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          checksum: string | null
          created_at: string
          height: number | null
          id: string
          mime_type: string | null
          original_url: string | null
          size_bytes: number | null
          sort_order: number
          source_post_id: string | null
          storage_path: string
          user_id: string
          width: number | null
        }
        Insert: {
          checksum?: string | null
          created_at?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          original_url?: string | null
          size_bytes?: number | null
          sort_order?: number
          source_post_id?: string | null
          storage_path: string
          user_id: string
          width?: number | null
        }
        Update: {
          checksum?: string | null
          created_at?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          original_url?: string | null
          size_bytes?: number | null
          sort_order?: number
          source_post_id?: string | null
          storage_path?: string
          user_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_source_post_id_fkey"
            columns: ["source_post_id"]
            isOneToOne: false
            referencedRelation: "source_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_draft_media: {
        Row: {
          created_at: string
          id: string
          is_included: boolean
          media_asset_id: string
          post_draft_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_included?: boolean
          media_asset_id: string
          post_draft_id: string
          sort_order: number
        }
        Update: {
          created_at?: string
          id?: string
          is_included?: boolean
          media_asset_id?: string
          post_draft_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_draft_media_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_draft_media_post_draft_id_fkey"
            columns: ["post_draft_id"]
            isOneToOne: false
            referencedRelation: "post_drafts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_draft_sets: {
        Row: {
          created_at: string
          id: string
          source_post_id: string | null
          status: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          source_post_id?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          source_post_id?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_draft_sets_source_post_id_fkey"
            columns: ["source_post_id"]
            isOneToOne: false
            referencedRelation: "source_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_draft_sets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_drafts: {
        Row: {
          body: string | null
          created_at: string
          draft_set_id: string
          hashtags: string[]
          id: string
          link_url: string | null
          status: string
          target_channel: string
          updated_at: string
          user_id: string
          validation_errors: Json
        }
        Insert: {
          body?: string | null
          created_at?: string
          draft_set_id: string
          hashtags?: string[]
          id?: string
          link_url?: string | null
          status?: string
          target_channel: string
          updated_at?: string
          user_id: string
          validation_errors?: Json
        }
        Update: {
          body?: string | null
          created_at?: string
          draft_set_id?: string
          hashtags?: string[]
          id?: string
          link_url?: string | null
          status?: string
          target_channel?: string
          updated_at?: string
          user_id?: string
          validation_errors?: Json
        }
        Relationships: [
          {
            foreignKeyName: "post_drafts_draft_set_id_fkey"
            columns: ["draft_set_id"]
            isOneToOne: false
            referencedRelation: "post_draft_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_drafts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          onboarding_status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          onboarding_status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          onboarding_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      publish_jobs: {
        Row: {
          attempt_count: number
          created_at: string
          external_post_id: string | null
          id: string
          idempotency_key: string
          last_error_code: string | null
          last_error_message: string | null
          post_draft_id: string
          published_at: string | null
          scheduled_at: string | null
          status: string
          target_channel: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          external_post_id?: string | null
          id?: string
          idempotency_key: string
          last_error_code?: string | null
          last_error_message?: string | null
          post_draft_id: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          target_channel: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          external_post_id?: string | null
          id?: string
          idempotency_key?: string
          last_error_code?: string | null
          last_error_message?: string | null
          post_draft_id?: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          target_channel?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "publish_jobs_post_draft_id_fkey"
            columns: ["post_draft_id"]
            isOneToOne: false
            referencedRelation: "post_drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publish_jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      publish_logs: {
        Row: {
          code: string | null
          created_at: string
          id: string
          level: string
          manual_publish_task_id: string | null
          message: string
          metadata: Json
          publish_job_id: string | null
          user_id: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          level: string
          manual_publish_task_id?: string | null
          message: string
          metadata?: Json
          publish_job_id?: string | null
          user_id: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          level?: string
          manual_publish_task_id?: string | null
          message?: string
          metadata?: Json
          publish_job_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "publish_logs_manual_publish_task_id_fkey"
            columns: ["manual_publish_task_id"]
            isOneToOne: false
            referencedRelation: "manual_publish_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publish_logs_publish_job_id_fkey"
            columns: ["publish_job_id"]
            isOneToOne: false
            referencedRelation: "publish_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publish_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_accounts: {
        Row: {
          access_token_encrypted: string | null
          account_type: string | null
          created_at: string
          display_name: string | null
          id: string
          provider: string
          provider_account_id: string
          refresh_token_encrypted: string | null
          scopes: string[]
          status: string
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token_encrypted?: string | null
          account_type?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          provider: string
          provider_account_id: string
          refresh_token_encrypted?: string | null
          scopes?: string[]
          status: string
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token_encrypted?: string | null
          account_type?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          provider?: string
          provider_account_id?: string
          refresh_token_encrypted?: string | null
          scopes?: string[]
          status?: string
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      source_posts: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          permalink: string | null
          posted_at: string | null
          provider: string | null
          provider_post_id: string | null
          raw_metadata: Json
          social_account_id: string | null
          source_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          permalink?: string | null
          posted_at?: string | null
          provider?: string | null
          provider_post_id?: string | null
          raw_metadata?: Json
          social_account_id?: string | null
          source_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          permalink?: string | null
          posted_at?: string | null
          provider?: string | null
          provider_post_id?: string | null
          raw_metadata?: Json
          social_account_id?: string | null
          source_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_posts_social_account_id_fkey"
            columns: ["social_account_id"]
            isOneToOne: false
            referencedRelation: "social_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
