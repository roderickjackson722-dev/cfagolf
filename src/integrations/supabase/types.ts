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
      course_lesson_videos: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          updated_at: string
          video_type: string
          video_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          updated_at?: string
          video_type?: string
          video_url?: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          updated_at?: string
          video_type?: string
          video_url?: string
        }
        Relationships: []
      }
      digital_product_purchases: {
        Row: {
          amount_paid: number | null
          buyer_email: string | null
          buyer_name: string | null
          city: string | null
          country: string | null
          created_at: string
          id: string
          product_key: string
          purchase_type: string
          referrer_path: string | null
          referrer_url: string | null
          region: string | null
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          buyer_email?: string | null
          buyer_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          product_key?: string
          purchase_type?: string
          referrer_path?: string | null
          referrer_url?: string | null
          region?: string | null
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          buyer_email?: string | null
          buyer_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          product_key?: string
          purchase_type?: string
          referrer_path?: string | null
          referrer_url?: string | null
          region?: string | null
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      digital_products: {
        Row: {
          bg_color: string
          color: string
          created_at: string
          description: string
          file_url: string | null
          icon_name: string
          id: string
          is_active: boolean
          price_cents: number
          product_key: string
          route: string
          sort_order: number
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          bg_color?: string
          color?: string
          created_at?: string
          description?: string
          file_url?: string | null
          icon_name?: string
          id?: string
          is_active?: boolean
          price_cents?: number
          product_key: string
          route: string
          sort_order?: number
          subtitle?: string
          title: string
          updated_at?: string
        }
        Update: {
          bg_color?: string
          color?: string
          created_at?: string
          description?: string
          file_url?: string | null
          icon_name?: string
          id?: string
          is_active?: boolean
          price_cents?: number
          product_key?: string
          route?: string
          sort_order?: number
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_subscribers: {
        Row: {
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          lead_magnet_downloaded: boolean
          source: string
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          lead_magnet_downloaded?: boolean
          source?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          lead_magnet_downloaded?: boolean
          source?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          category: string
          created_at: string
          id: string
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          body: string
          category?: string
          created_at?: string
          id?: string
          name: string
          subject: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string
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
      flyer_content: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      high_schools: {
        Row: {
          area_coordinator_name: string | null
          area_coordinator_school: string | null
          area_number: number | null
          city: string | null
          classification: string
          coach_email: string | null
          coach_name: string | null
          coach_phone: string | null
          contact_status: string | null
          created_at: string
          has_boys_team: boolean | null
          has_girls_team: boolean | null
          id: string
          last_contacted_at: string | null
          name: string
          notes: string | null
          state: string
          total_emails_sent: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          area_coordinator_name?: string | null
          area_coordinator_school?: string | null
          area_number?: number | null
          city?: string | null
          classification: string
          coach_email?: string | null
          coach_name?: string | null
          coach_phone?: string | null
          contact_status?: string | null
          created_at?: string
          has_boys_team?: boolean | null
          has_girls_team?: boolean | null
          id?: string
          last_contacted_at?: string | null
          name: string
          notes?: string | null
          state?: string
          total_emails_sent?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          area_coordinator_name?: string | null
          area_coordinator_school?: string | null
          area_number?: number | null
          city?: string | null
          classification?: string
          coach_email?: string | null
          coach_name?: string | null
          coach_phone?: string | null
          contact_status?: string | null
          created_at?: string
          has_boys_team?: boolean | null
          has_girls_team?: boolean | null
          id?: string
          last_contacted_at?: string | null
          name?: string
          notes?: string | null
          state?: string
          total_emails_sent?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      hs_coach_outreach: {
        Row: {
          body: string | null
          created_at: string
          high_school_id: string
          id: string
          notes: string | null
          opened_at: string | null
          outreach_type: string
          sent_at: string
          status: string
          subject: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          high_school_id: string
          id?: string
          notes?: string | null
          opened_at?: string | null
          outreach_type?: string
          sent_at?: string
          status?: string
          subject?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          high_school_id?: string
          id?: string
          notes?: string | null
          opened_at?: string | null
          outreach_type?: string
          sent_at?: string
          status?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hs_coach_outreach_high_school_id_fkey"
            columns: ["high_school_id"]
            isOneToOne: false
            referencedRelation: "high_schools"
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
          meet_link: string | null
          module_number: number
          module_title: string
          next_agenda: string | null
          session_date: string | null
          session_duration_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          completed_date?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          meet_link?: string | null
          module_number: number
          module_title: string
          next_agenda?: string | null
          session_date?: string | null
          session_duration_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          completed_date?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          meet_link?: string | null
          module_number?: number
          module_title?: string
          next_agenda?: string | null
          session_date?: string | null
          session_duration_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      newsletter_tips: {
        Row: {
          action_items: Json
          created_at: string
          id: string
          month_index: number
          month_name: string
          subject: string
          tip: string
          title: string
          updated_at: string
        }
        Insert: {
          action_items?: Json
          created_at?: string
          id?: string
          month_index: number
          month_name: string
          subject: string
          tip: string
          title: string
          updated_at?: string
        }
        Update: {
          action_items?: Json
          created_at?: string
          id?: string
          month_index?: number
          month_name?: string
          subject?: string
          tip?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      player_profile_releases: {
        Row: {
          ack_can_withdraw: boolean
          ack_flat_fee: boolean
          ack_no_control_third_party: boolean
          ack_no_guarantees: boolean
          ack_not_agency: boolean
          act_score: string | null
          auth_academic_info: boolean
          auth_athletic_profile: boolean
          auth_direct_coach_contact: boolean
          auth_personal_info: boolean
          created_at: string
          current_school: string
          date_of_birth: string
          full_name: string
          golf_achievements: string
          gpa: string
          graduation_year: number
          id: string
          parent_email: string | null
          parent_name: string | null
          parent_phone: string | null
          parent_relationship: string | null
          parent_signature: string | null
          parent_signature_date: string | null
          player_email: string
          player_phone: string
          player_signature: string
          player_signature_date: string
          release_marketing: boolean | null
          release_name_achievements: boolean | null
          release_success_story: boolean | null
          release_website_social: boolean | null
          sat_score: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ack_can_withdraw?: boolean
          ack_flat_fee?: boolean
          ack_no_control_third_party?: boolean
          ack_no_guarantees?: boolean
          ack_not_agency?: boolean
          act_score?: string | null
          auth_academic_info?: boolean
          auth_athletic_profile?: boolean
          auth_direct_coach_contact?: boolean
          auth_personal_info?: boolean
          created_at?: string
          current_school: string
          date_of_birth: string
          full_name: string
          golf_achievements: string
          gpa: string
          graduation_year: number
          id?: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          parent_relationship?: string | null
          parent_signature?: string | null
          parent_signature_date?: string | null
          player_email: string
          player_phone: string
          player_signature: string
          player_signature_date: string
          release_marketing?: boolean | null
          release_name_achievements?: boolean | null
          release_success_story?: boolean | null
          release_website_social?: boolean | null
          sat_score?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ack_can_withdraw?: boolean
          ack_flat_fee?: boolean
          ack_no_control_third_party?: boolean
          ack_no_guarantees?: boolean
          ack_not_agency?: boolean
          act_score?: string | null
          auth_academic_info?: boolean
          auth_athletic_profile?: boolean
          auth_direct_coach_contact?: boolean
          auth_personal_info?: boolean
          created_at?: string
          current_school?: string
          date_of_birth?: string
          full_name?: string
          golf_achievements?: string
          gpa?: string
          graduation_year?: number
          id?: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          parent_relationship?: string | null
          parent_signature?: string | null
          parent_signature_date?: string | null
          player_email?: string
          player_phone?: string
          player_signature?: string
          player_signature_date?: string
          release_marketing?: boolean | null
          release_name_achievements?: boolean | null
          release_success_story?: boolean | null
          release_website_social?: boolean | null
          sat_score?: string | null
          status?: string
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
          program_type: string
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
          program_type?: string
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
          program_type?: string
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          discount_percent: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          name: string
          updated_at: string
          uses_count: number
        }
        Insert: {
          code: string
          created_at?: string
          discount_percent?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          name: string
          updated_at?: string
          uses_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          discount_percent?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          name?: string
          updated_at?: string
          uses_count?: number
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
      session_action_items: {
        Row: {
          assigned_by: string
          completed_date: string | null
          created_at: string
          due_date: string | null
          id: string
          is_completed: boolean
          module_number: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_by?: string
          completed_date?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_completed?: boolean
          module_number: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_by?: string
          completed_date?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_completed?: boolean
          module_number?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      session_notes: {
        Row: {
          author_id: string
          author_role: string
          content: string
          created_at: string
          id: string
          module_number: number
          updated_at: string
          user_id: string
        }
        Insert: {
          author_id: string
          author_role?: string
          content: string
          created_at?: string
          id?: string
          module_number: number
          updated_at?: string
          user_id: string
        }
        Update: {
          author_id?: string
          author_role?: string
          content?: string
          created_at?: string
          id?: string
          module_number?: number
          updated_at?: string
          user_id?: string
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
      transfer_portal_entries: {
        Row: {
          academic_fit_rating: number | null
          athletic_fit_rating: number | null
          coach_email: string | null
          coach_name: string | null
          created_at: string
          credits_accepted: number | null
          current_school: string | null
          division: string | null
          eligibility_years_remaining: number | null
          id: string
          notes: string | null
          overall_interest: string | null
          portal_entry_date: string | null
          scholarship_offer: number | null
          school_name: string
          status: string
          total_credits: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          academic_fit_rating?: number | null
          athletic_fit_rating?: number | null
          coach_email?: string | null
          coach_name?: string | null
          created_at?: string
          credits_accepted?: number | null
          current_school?: string | null
          division?: string | null
          eligibility_years_remaining?: number | null
          id?: string
          notes?: string | null
          overall_interest?: string | null
          portal_entry_date?: string | null
          scholarship_offer?: number | null
          school_name: string
          status?: string
          total_credits?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          academic_fit_rating?: number | null
          athletic_fit_rating?: number | null
          coach_email?: string | null
          coach_name?: string | null
          created_at?: string
          credits_accepted?: number | null
          current_school?: string | null
          division?: string | null
          eligibility_years_remaining?: number | null
          id?: string
          notes?: string | null
          overall_interest?: string | null
          portal_entry_date?: string | null
          scholarship_offer?: number | null
          school_name?: string
          status?: string
          total_credits?: number | null
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
      wagr_attendance: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          status: string
          tournament_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          tournament_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          tournament_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wagr_attendance_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "wagr_tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      wagr_tournaments: {
        Row: {
          city: string | null
          country: string | null
          course_name: string | null
          created_at: string
          end_date: string | null
          event_type: string | null
          external_url: string | null
          gender: string | null
          id: string
          notes: string | null
          power_rating: number | null
          start_date: string
          state: string | null
          tournament_name: string
          updated_at: string
          wagr_url: string | null
          winner_name: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          course_name?: string | null
          created_at?: string
          end_date?: string | null
          event_type?: string | null
          external_url?: string | null
          gender?: string | null
          id?: string
          notes?: string | null
          power_rating?: number | null
          start_date: string
          state?: string | null
          tournament_name: string
          updated_at?: string
          wagr_url?: string | null
          winner_name?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          course_name?: string | null
          created_at?: string
          end_date?: string | null
          event_type?: string | null
          external_url?: string | null
          gender?: string | null
          id?: string
          notes?: string | null
          power_rating?: number | null
          start_date?: string
          state?: string | null
          tournament_name?: string
          updated_at?: string
          wagr_url?: string | null
          winner_name?: string | null
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
      increment_promo_uses: { Args: { promo_id: string }; Returns: undefined }
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
