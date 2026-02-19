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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      campus_visits: {
        Row: {
          academics_rating: number | null
          campus_rating: number | null
          coaching_rating: number | null
          college_id: string | null
          cons: string | null
          created_at: string
          custom_school_name: string | null
          facilities_rating: number | null
          follow_up_needed: boolean | null
          id: string
          notes: string | null
          overall_rating: number | null
          photo_urls: Json | null
          pros: string | null
          questions_asked: string | null
          team_culture_rating: number | null
          updated_at: string
          user_id: string
          visit_date: string
          visit_type: string | null
        }
        Insert: {
          academics_rating?: number | null
          campus_rating?: number | null
          coaching_rating?: number | null
          college_id?: string | null
          cons?: string | null
          created_at?: string
          custom_school_name?: string | null
          facilities_rating?: number | null
          follow_up_needed?: boolean | null
          id?: string
          notes?: string | null
          overall_rating?: number | null
          photo_urls?: Json | null
          pros?: string | null
          questions_asked?: string | null
          team_culture_rating?: number | null
          updated_at?: string
          user_id: string
          visit_date: string
          visit_type?: string | null
        }
        Update: {
          academics_rating?: number | null
          campus_rating?: number | null
          coaching_rating?: number | null
          college_id?: string | null
          cons?: string | null
          created_at?: string
          custom_school_name?: string | null
          facilities_rating?: number | null
          follow_up_needed?: boolean | null
          id?: string
          notes?: string | null
          overall_rating?: number | null
          photo_urls?: Json | null
          pros?: string | null
          questions_asked?: string | null
          team_culture_rating?: number | null
          updated_at?: string
          user_id?: string
          visit_date?: string
          visit_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campus_visits_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_contacts: {
        Row: {
          coach_name: string
          coach_title: string | null
          contact_type: string | null
          created_at: string
          email: string | null
          first_contact_date: string | null
          follow_up_date: string | null
          id: string
          notes: string | null
          phone: string | null
          priority: number | null
          response_received: boolean | null
          school_name: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          coach_name: string
          coach_title?: string | null
          contact_type?: string | null
          created_at?: string
          email?: string | null
          first_contact_date?: string | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          priority?: number | null
          response_received?: boolean | null
          school_name: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          coach_name?: string
          coach_title?: string | null
          contact_type?: string | null
          created_at?: string
          email?: string | null
          first_contact_date?: string | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          priority?: number | null
          response_received?: boolean | null
          school_name?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      colleges: {
        Row: {
          conference: string | null
          created_at: string
          division: Database["public"]["Enums"]["division"]
          golf_national_ranking: number | null
          id: string
          is_hbcu: boolean
          logo_url: string | null
          min_act_score: number | null
          min_sat_score: number | null
          name: string
          number_of_students: number | null
          out_of_state_cost: number | null
          recruiting_scoring_avg: number | null
          scholarships_available: number | null
          school_size: Database["public"]["Enums"]["school_size"]
          state: string
          team_gender: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          conference?: string | null
          created_at?: string
          division: Database["public"]["Enums"]["division"]
          golf_national_ranking?: number | null
          id?: string
          is_hbcu?: boolean
          logo_url?: string | null
          min_act_score?: number | null
          min_sat_score?: number | null
          name: string
          number_of_students?: number | null
          out_of_state_cost?: number | null
          recruiting_scoring_avg?: number | null
          scholarships_available?: number | null
          school_size: Database["public"]["Enums"]["school_size"]
          state: string
          team_gender?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          conference?: string | null
          created_at?: string
          division?: Database["public"]["Enums"]["division"]
          golf_national_ranking?: number | null
          id?: string
          is_hbcu?: boolean
          logo_url?: string | null
          min_act_score?: number | null
          min_sat_score?: number | null
          name?: string
          number_of_students?: number | null
          out_of_state_cost?: number | null
          recruiting_scoring_avg?: number | null
          scholarships_available?: number | null
          school_size?: Database["public"]["Enums"]["school_size"]
          state?: string
          team_gender?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          college_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          college_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          college_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_progress: {
        Row: {
          admin_notes: string | null
          completed_date: string | null
          created_at: string
          id: string
          is_completed: boolean | null
          module_number: number
          module_title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          completed_date?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          module_number: number
          module_title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          completed_date?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          module_number?: number
          module_title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          club_team: string | null
          created_at: string
          email: string | null
          full_name: string | null
          goal_division: string | null
          graduation_year: number | null
          handicap: number | null
          has_paid_access: boolean | null
          high_school: string | null
          home_course: string | null
          id: string
          phone: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          club_team?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          goal_division?: string | null
          graduation_year?: number | null
          handicap?: number | null
          has_paid_access?: boolean | null
          high_school?: string | null
          home_course?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          club_team?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          goal_division?: string | null
          graduation_year?: number | null
          handicap?: number | null
          has_paid_access?: boolean | null
          high_school?: string | null
          home_course?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recruiting_milestones: {
        Row: {
          category: string
          completed_date: string | null
          created_at: string
          description: string | null
          id: string
          is_completed: boolean | null
          notes: string | null
          priority: number | null
          reminder_days_before: number | null
          reminder_enabled: boolean | null
          target_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          completed_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          priority?: number | null
          reminder_days_before?: number | null
          reminder_enabled?: boolean | null
          target_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          completed_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          priority?: number | null
          reminder_days_before?: number | null
          reminder_enabled?: boolean | null
          target_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_uses: {
        Row: {
          created_at: string
          discount_applied: number
          id: string
          payment_amount: number
          referral_id: string
          referred_user_id: string
          referrer_notified: boolean | null
        }
        Insert: {
          created_at?: string
          discount_applied: number
          id?: string
          payment_amount: number
          referral_id: string
          referred_user_id: string
          referrer_notified?: boolean | null
        }
        Update: {
          created_at?: string
          discount_applied?: number
          id?: string
          payment_amount?: number
          referral_id?: string
          referred_user_id?: string
          referrer_notified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_uses_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          discount_percent: number
          id: string
          is_active: boolean
          max_uses: number | null
          notify_on_use: boolean | null
          referral_code: string
          referrer_user_id: string
          reward_type: string | null
          reward_value: number | null
          total_rewards_earned: number | null
          updated_at: string
          uses_count: number
        }
        Insert: {
          created_at?: string
          discount_percent?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          notify_on_use?: boolean | null
          referral_code: string
          referrer_user_id: string
          reward_type?: string | null
          reward_value?: number | null
          total_rewards_earned?: number | null
          updated_at?: string
          uses_count?: number
        }
        Update: {
          created_at?: string
          discount_percent?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          notify_on_use?: boolean | null
          referral_code?: string
          referrer_user_id?: string
          reward_type?: string | null
          reward_value?: number | null
          total_rewards_earned?: number | null
          updated_at?: string
          uses_count?: number
        }
        Relationships: []
      }
      scholarship_offers: {
        Row: {
          academic_scholarship: number | null
          athletic_scholarship: number | null
          books_fees: number | null
          created_at: string
          decision_deadline: string | null
          division: string | null
          id: string
          is_favorite: boolean | null
          loans_offered: number | null
          need_based_aid: number | null
          net_cost: number | null
          notes: string | null
          offer_date: string | null
          offer_type: string | null
          other_grants: number | null
          room_board_cost: number | null
          school_name: string
          status: string | null
          tuition_cost: number | null
          updated_at: string
          user_id: string
          work_study: number | null
        }
        Insert: {
          academic_scholarship?: number | null
          athletic_scholarship?: number | null
          books_fees?: number | null
          created_at?: string
          decision_deadline?: string | null
          division?: string | null
          id?: string
          is_favorite?: boolean | null
          loans_offered?: number | null
          need_based_aid?: number | null
          net_cost?: number | null
          notes?: string | null
          offer_date?: string | null
          offer_type?: string | null
          other_grants?: number | null
          room_board_cost?: number | null
          school_name: string
          status?: string | null
          tuition_cost?: number | null
          updated_at?: string
          user_id: string
          work_study?: number | null
        }
        Update: {
          academic_scholarship?: number | null
          athletic_scholarship?: number | null
          books_fees?: number | null
          created_at?: string
          decision_deadline?: string | null
          division?: string | null
          id?: string
          is_favorite?: boolean | null
          loans_offered?: number | null
          need_based_aid?: number | null
          net_cost?: number | null
          notes?: string | null
          offer_date?: string | null
          offer_type?: string | null
          other_grants?: number | null
          room_board_cost?: number | null
          school_name?: string
          status?: string | null
          tuition_cost?: number | null
          updated_at?: string
          user_id?: string
          work_study?: number | null
        }
        Relationships: []
      }
      site_visitors: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          id: string
          ip_address: string | null
          page_url: string | null
          referrer: string | null
          region: string | null
          user_agent: string | null
          visitor_id: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          region?: string | null
          user_agent?: string | null
          visitor_id: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          region?: string | null
          user_agent?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      target_schools: {
        Row: {
          category: string
          college_id: string | null
          created_at: string
          custom_school_name: string | null
          id: string
          notes: string | null
          priority: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          college_id?: string | null
          created_at?: string
          custom_school_name?: string | null
          id?: string
          notes?: string | null
          priority?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          college_id?: string | null
          created_at?: string
          custom_school_name?: string | null
          id?: string
          notes?: string | null
          priority?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "target_schools_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
          role: string | null
          status: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
          role?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
          role?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      tournament_results: {
        Row: {
          course_name: string | null
          created_at: string
          field_size: number | null
          finish_position: number | null
          id: string
          location: string | null
          notes: string | null
          relative_to_par: number | null
          round_scores: Json | null
          rounds: number | null
          total_score: number | null
          tournament_date: string
          tournament_name: string
          tournament_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          course_name?: string | null
          created_at?: string
          field_size?: number | null
          finish_position?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          relative_to_par?: number | null
          round_scores?: Json | null
          rounds?: number | null
          total_score?: number | null
          tournament_date: string
          tournament_name: string
          tournament_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          course_name?: string | null
          created_at?: string
          field_size?: number | null
          finish_position?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          relative_to_par?: number | null
          round_scores?: Json | null
          rounds?: number | null
          total_score?: number | null
          tournament_date?: string
          tournament_name?: string
          tournament_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      worksheet_data: {
        Row: {
          created_at: string
          data: Json
          id: string
          updated_at: string
          user_id: string
          worksheet_key: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id: string
          worksheet_key: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id?: string
          worksheet_key?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_referral_uses: {
        Args: { referral_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      division: "D1" | "D2" | "D3" | "NAIA" | "JUCO"
      school_size: "Small" | "Medium" | "Large" | "Very Large"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      division: ["D1", "D2", "D3", "NAIA", "JUCO"],
      school_size: ["Small", "Medium", "Large", "Very Large"],
    },
  },
} as const
