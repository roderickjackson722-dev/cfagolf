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
      agenda_template_tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          estimated_duration: number | null
          id: string
          link_text: string | null
          link_url: string | null
          sort_order: number
          template_id: string
          title: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          link_text?: string | null
          link_url?: string | null
          sort_order?: number
          template_id: string
          title: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          link_text?: string | null
          link_url?: string | null
          sort_order?: number
          template_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "agenda_template_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "agenda_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      agenda_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_default: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      coach_access_requests: {
        Row: {
          college_name: string
          conference: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          message: string | null
          phone: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          title: string | null
        }
        Insert: {
          college_name: string
          conference?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          message?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title?: string | null
        }
        Update: {
          college_name?: string
          conference?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          title?: string | null
        }
        Relationships: []
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
      coach_favorites: {
        Row: {
          coach_id: string
          created_at: string
          golfer_email: string | null
          golfer_name: string | null
          golfer_user_id: string | null
          id: string
          notes: string | null
        }
        Insert: {
          coach_id: string
          created_at?: string
          golfer_email?: string | null
          golfer_name?: string | null
          golfer_user_id?: string | null
          id?: string
          notes?: string | null
        }
        Update: {
          coach_id?: string
          created_at?: string
          golfer_email?: string | null
          golfer_name?: string | null
          golfer_user_id?: string | null
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_favorites_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_messages: {
        Row: {
          coach_id: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          sender_email: string
          sender_name: string
          sender_user_id: string | null
        }
        Insert: {
          coach_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          sender_email: string
          sender_name: string
          sender_user_id?: string | null
        }
        Update: {
          coach_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          sender_email?: string
          sender_name?: string
          sender_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_messages_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_profile_views: {
        Row: {
          coach_id: string
          created_at: string
          id: string
          view_date: string
          viewer_full_name: string | null
          viewer_graduation_year: number | null
          viewer_handicap: number | null
          viewer_session_id: string | null
          viewer_user_id: string | null
        }
        Insert: {
          coach_id: string
          created_at?: string
          id?: string
          view_date?: string
          viewer_full_name?: string | null
          viewer_graduation_year?: number | null
          viewer_handicap?: number | null
          viewer_session_id?: string | null
          viewer_user_id?: string | null
        }
        Update: {
          coach_id?: string
          created_at?: string
          id?: string
          view_date?: string
          viewer_full_name?: string | null
          viewer_graduation_year?: number | null
          viewer_handicap?: number | null
          viewer_session_id?: string | null
          viewer_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_profile_views_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      coaches: {
        Row: {
          bio: string | null
          college_name: string
          conference: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          last_login_at: string | null
          photo_url: string | null
          program_overview: string | null
          recruiting_preferences: string | null
          slug: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          college_name: string
          conference?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          photo_url?: string | null
          program_overview?: string | null
          recruiting_preferences?: string | null
          slug: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          college_name?: string
          conference?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          photo_url?: string | null
          program_overview?: string | null
          recruiting_preferences?: string | null
          slug?: string
          title?: string | null
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
          logo_needs_manual: boolean
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
          logo_needs_manual?: boolean
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
          logo_needs_manual?: boolean
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
      content_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      content_items: {
        Row: {
          category_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_global: boolean
          is_template: boolean
          parent_template_id: string | null
          storage_path: string | null
          tags: string[]
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_global?: boolean
          is_template?: boolean
          parent_template_id?: string | null
          storage_path?: string | null
          tags?: string[]
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_global?: boolean
          is_template?: boolean
          parent_template_id?: string | null
          storage_path?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_parent_template_id_fkey"
            columns: ["parent_template_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      content_versions: {
        Row: {
          changelog: string | null
          content_item_id: string
          created_at: string
          created_by: string | null
          file_name: string | null
          file_url: string | null
          id: string
          storage_path: string | null
          version_number: number
        }
        Insert: {
          changelog?: string | null
          content_item_id: string
          created_at?: string
          created_by?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          storage_path?: string | null
          version_number: number
        }
        Update: {
          changelog?: string | null
          content_item_id?: string
          created_at?: string
          created_by?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          storage_path?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_versions_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
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
      document_shares: {
        Row: {
          created_at: string
          document_ids: string[]
          expires_at: string | null
          id: string
          is_active: boolean
          label: string | null
          last_viewed_at: string | null
          recipient_name: string | null
          token: string
          updated_at: string
          user_id: string
          view_count: number
        }
        Insert: {
          created_at?: string
          document_ids?: string[]
          expires_at?: string | null
          id?: string
          is_active?: boolean
          label?: string | null
          last_viewed_at?: string | null
          recipient_name?: string | null
          token: string
          updated_at?: string
          user_id: string
          view_count?: number
        }
        Update: {
          created_at?: string
          document_ids?: string[]
          expires_at?: string | null
          id?: string
          is_active?: boolean
          label?: string | null
          last_viewed_at?: string | null
          recipient_name?: string | null
          token?: string
          updated_at?: string
          user_id?: string
          view_count?: number
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
      email_template_action_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          link_text: string | null
          link_url: string | null
          section_id: string
          sort_order: number
          task: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          link_text?: string | null
          link_url?: string | null
          section_id: string
          sort_order?: number
          task: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          link_text?: string | null
          link_url?: string | null
          section_id?: string
          sort_order?: number
          task?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_template_action_items_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "email_template_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      email_template_sections: {
        Row: {
          content: string
          created_at: string
          has_action_items: boolean
          id: string
          sort_order: number
          template_id: string
          title: string | null
        }
        Insert: {
          content?: string
          created_at?: string
          has_action_items?: boolean
          id?: string
          sort_order?: number
          template_id: string
          title?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          has_action_items?: boolean
          id?: string
          sort_order?: number
          template_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_template_sections_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      email_template_variables: {
        Row: {
          created_at: string
          id: string
          is_required: boolean
          template_id: string
          variable_label: string | null
          variable_name: string
          variable_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_required?: boolean
          template_id: string
          variable_label?: string | null
          variable_name: string
          variable_type?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_required?: boolean
          template_id?: string
          variable_label?: string | null
          variable_name?: string
          variable_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_template_variables_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates_v2"
            referencedColumns: ["id"]
          },
        ]
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
      email_templates_v2: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          subject: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
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
      inventory_brands: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      inventory_categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_editable: boolean
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_editable?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_editable?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          brand_id: string | null
          category_id: string | null
          color_hex: string | null
          color_name: string
          compatible_fabric: string | null
          created_at: string
          id: string
          image_url: string | null
          location: string | null
          notes: string | null
          quantity_on_hand: number
          quantity_reserved: number
          reorder_point: number
          selling_price: number | null
          size_id: string | null
          style_id: string | null
          transfer_type: string | null
          unit_cost: number | null
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          category_id?: string | null
          color_hex?: string | null
          color_name?: string
          compatible_fabric?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          location?: string | null
          notes?: string | null
          quantity_on_hand?: number
          quantity_reserved?: number
          reorder_point?: number
          selling_price?: number | null
          size_id?: string | null
          style_id?: string | null
          transfer_type?: string | null
          unit_cost?: number | null
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          category_id?: string | null
          color_hex?: string | null
          color_name?: string
          compatible_fabric?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          location?: string | null
          notes?: string | null
          quantity_on_hand?: number
          quantity_reserved?: number
          reorder_point?: number
          selling_price?: number | null
          size_id?: string | null
          style_id?: string | null
          transfer_type?: string | null
          unit_cost?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "inventory_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "inventory_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "inventory_sizes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "inventory_styles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_logs: {
        Row: {
          change_type: string
          created_at: string
          field_name: string | null
          id: string
          item_id: string | null
          new_value: string | null
          old_value: string | null
          quantity_change: number | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          change_type: string
          created_at?: string
          field_name?: string | null
          id?: string
          item_id?: string | null
          new_value?: string | null
          old_value?: string | null
          quantity_change?: number | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          change_type?: string
          created_at?: string
          field_name?: string | null
          id?: string
          item_id?: string | null
          new_value?: string | null
          old_value?: string | null
          quantity_change?: number | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_logs_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      inventory_shares: {
        Row: {
          accepted_at: string | null
          email: string
          id: string
          invited_at: string
          invited_by: string | null
          is_active: boolean
          role: string
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          email: string
          id?: string
          invited_at?: string
          invited_by?: string | null
          is_active?: boolean
          role: string
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          email?: string
          id?: string
          invited_at?: string
          invited_by?: string | null
          is_active?: boolean
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inventory_sizes: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      inventory_styles: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          client_address: string | null
          client_email: string | null
          client_name: string
          created_at: string
          created_by: string | null
          discount: number
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          items: Json
          notes: string | null
          status: string
          tax_percent: number
          total: number
          updated_at: string
        }
        Insert: {
          client_address?: string | null
          client_email?: string | null
          client_name?: string
          created_at?: string
          created_by?: string | null
          discount?: number
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string
          items?: Json
          notes?: string | null
          status?: string
          tax_percent?: number
          total?: number
          updated_at?: string
        }
        Update: {
          client_address?: string | null
          client_email?: string | null
          client_name?: string
          created_at?: string
          created_by?: string | null
          discount?: number
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          items?: Json
          notes?: string | null
          status?: string
          tax_percent?: number
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      link_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
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
      member_documents: {
        Row: {
          category: string
          created_at: string
          description: string | null
          file_name: string
          file_size: number
          id: string
          mime_type: string
          storage_path: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          file_name: string
          file_size?: number
          id?: string
          mime_type?: string
          storage_path: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          file_name?: string
          file_size?: number
          id?: string
          mime_type?: string
          storage_path?: string
          title?: string
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
      outreach_history: {
        Row: {
          body: string | null
          id: string
          notes: string | null
          recipient_email: string
          recipient_name: string | null
          sent_at: string
          sent_by: string | null
          status: string
          student_id: string | null
          subject: string | null
          template_id: string | null
          variables_used: Json | null
        }
        Insert: {
          body?: string | null
          id?: string
          notes?: string | null
          recipient_email: string
          recipient_name?: string | null
          sent_at?: string
          sent_by?: string | null
          status?: string
          student_id?: string | null
          subject?: string | null
          template_id?: string | null
          variables_used?: Json | null
        }
        Update: {
          body?: string | null
          id?: string
          notes?: string | null
          recipient_email?: string
          recipient_name?: string | null
          sent_at?: string
          sent_by?: string | null
          status?: string
          student_id?: string | null
          subject?: string | null
          template_id?: string | null
          variables_used?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "outreach_history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_history_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      player_coach_messages: {
        Row: {
          coach_college: string | null
          coach_email: string
          coach_name: string
          coach_phone: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          player_id: string
        }
        Insert: {
          coach_college?: string | null
          coach_email: string
          coach_name: string
          coach_phone?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          player_id: string
        }
        Update: {
          coach_college?: string | null
          coach_email?: string
          coach_name?: string
          coach_phone?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_coach_messages_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_gallery_images: {
        Row: {
          angle: string | null
          category: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string
          player_id: string
          thumbnail_url: string | null
          title: string | null
        }
        Insert: {
          angle?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url: string
          player_id: string
          thumbnail_url?: string | null
          title?: string | null
        }
        Update: {
          angle?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string
          player_id?: string
          thumbnail_url?: string | null
          title?: string | null
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
      player_references: {
        Row: {
          company: string | null
          created_at: string
          display_order: number
          id: string
          name: string
          photo_url: string | null
          player_id: string
          quote: string
          title: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          display_order?: number
          id?: string
          name: string
          photo_url?: string | null
          player_id: string
          quote: string
          title: string
        }
        Update: {
          company?: string | null
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          photo_url?: string | null
          player_id?: string
          quote?: string
          title?: string
        }
        Relationships: []
      }
      player_tournament_results: {
        Row: {
          course: string | null
          created_at: string
          date: string
          field_size: number | null
          finish: string | null
          id: string
          is_upcoming: boolean
          location: string | null
          notes: string | null
          player_id: string
          registration_link: string | null
          results_link: string | null
          score: number | null
          tournament_name: string
        }
        Insert: {
          course?: string | null
          created_at?: string
          date: string
          field_size?: number | null
          finish?: string | null
          id?: string
          is_upcoming?: boolean
          location?: string | null
          notes?: string | null
          player_id: string
          registration_link?: string | null
          results_link?: string | null
          score?: number | null
          tournament_name: string
        }
        Update: {
          course?: string | null
          created_at?: string
          date?: string
          field_size?: number | null
          finish?: string | null
          id?: string
          is_upcoming?: boolean
          location?: string | null
          notes?: string | null
          player_id?: string
          registration_link?: string | null
          results_link?: string | null
          score?: number | null
          tournament_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_tournament_results_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_videos: {
        Row: {
          category: string
          created_at: string
          id: string
          player_id: string
          sort_order: number
          thumbnail_url: string | null
          title: string
          url: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          player_id: string
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          player_id?: string
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_videos_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          act_score: number | null
          allow_editing: boolean
          bio: string | null
          contact_email: string | null
          created_at: string
          custom_domain: string | null
          full_name: string
          gpa: number | null
          graduation_year: number | null
          handicap: number | null
          hero_image_url: string | null
          hero_overlay_opacity: number
          hero_text_color: string
          high_school: string | null
          highlights: Json
          home_course: string | null
          id: string
          intended_major: string | null
          is_active: boolean
          profile_photo_url: string | null
          resume_url: string | null
          sat_score: number | null
          scoring_average: number | null
          slug: string
          social_links: Json | null
          tagline: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          act_score?: number | null
          allow_editing?: boolean
          bio?: string | null
          contact_email?: string | null
          created_at?: string
          custom_domain?: string | null
          full_name: string
          gpa?: number | null
          graduation_year?: number | null
          handicap?: number | null
          hero_image_url?: string | null
          hero_overlay_opacity?: number
          hero_text_color?: string
          high_school?: string | null
          highlights?: Json
          home_course?: string | null
          id?: string
          intended_major?: string | null
          is_active?: boolean
          profile_photo_url?: string | null
          resume_url?: string | null
          sat_score?: number | null
          scoring_average?: number | null
          slug: string
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          act_score?: number | null
          allow_editing?: boolean
          bio?: string | null
          contact_email?: string | null
          created_at?: string
          custom_domain?: string | null
          full_name?: string
          gpa?: number | null
          graduation_year?: number | null
          handicap?: number | null
          hero_image_url?: string | null
          hero_overlay_opacity?: number
          hero_text_color?: string
          high_school?: string | null
          highlights?: Json
          home_course?: string | null
          id?: string
          intended_major?: string | null
          is_active?: boolean
          profile_photo_url?: string | null
          resume_url?: string | null
          sat_score?: number | null
          scoring_average?: number | null
          slug?: string
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      presentation_slides: {
        Row: {
          bullets: Json
          created_at: string
          id: string
          image_url: string | null
          is_logo_slide: boolean
          logo_url: string | null
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          bullets?: Json
          created_at?: string
          id?: string
          image_url?: string | null
          is_logo_slide?: boolean
          logo_url?: string | null
          position: number
          title?: string
          updated_at?: string
        }
        Update: {
          bullets?: Json
          created_at?: string
          id?: string
          image_url?: string | null
          is_logo_slide?: boolean
          logo_url?: string | null
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      presentation_tokens: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          label: string | null
          token: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          label?: string | null
          token: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          label?: string | null
          token?: string
          updated_at?: string
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
      resource_links: {
        Row: {
          category: string | null
          click_count: number
          created_at: string
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          last_clicked_at: string | null
          name: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          category?: string | null
          click_count?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          last_clicked_at?: string | null
          name: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          category?: string | null
          click_count?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          last_clicked_at?: string | null
          name?: string
          sort_order?: number
          updated_at?: string
          url?: string
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
      student_activity_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          performed_by: string | null
          student_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by?: string | null
          student_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_activity_log_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_agenda_comments: {
        Row: {
          agenda_id: string
          comment: string
          created_at: string
          created_by: string | null
          id: string
          task_id: string | null
        }
        Insert: {
          agenda_id: string
          comment: string
          created_at?: string
          created_by?: string | null
          id?: string
          task_id?: string | null
        }
        Update: {
          agenda_id?: string
          comment?: string
          created_at?: string
          created_by?: string | null
          id?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_agenda_comments_agenda_id_fkey"
            columns: ["agenda_id"]
            isOneToOne: false
            referencedRelation: "student_agendas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_agenda_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "student_agenda_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      student_agenda_tasks: {
        Row: {
          agenda_id: string
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          estimated_duration: number | null
          id: string
          link_text: string | null
          link_url: string | null
          sort_order: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          agenda_id: string
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          link_text?: string | null
          link_url?: string | null
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          agenda_id?: string
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          link_text?: string | null
          link_url?: string | null
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_agenda_tasks_agenda_id_fkey"
            columns: ["agenda_id"]
            isOneToOne: false
            referencedRelation: "student_agendas"
            referencedColumns: ["id"]
          },
        ]
      }
      student_agendas: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          meeting_date: string | null
          meeting_type: string | null
          notes: string | null
          status: string
          student_id: string
          template_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          meeting_date?: string | null
          meeting_type?: string | null
          notes?: string | null
          status?: string
          student_id: string
          template_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          meeting_date?: string | null
          meeting_type?: string | null
          notes?: string | null
          status?: string
          student_id?: string
          template_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_agendas_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_agendas_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "agenda_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      student_content: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_customized: boolean
          parent_version_id: string | null
          source_template_id: string | null
          storage_path: string | null
          student_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_customized?: boolean
          parent_version_id?: string | null
          source_template_id?: string | null
          storage_path?: string | null
          student_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_customized?: boolean
          parent_version_id?: string | null
          source_template_id?: string | null
          storage_path?: string | null
          student_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_content_parent_version_id_fkey"
            columns: ["parent_version_id"]
            isOneToOne: false
            referencedRelation: "content_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_content_source_template_id_fkey"
            columns: ["source_template_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_content_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_custom_webpages: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          page_content: string | null
          page_name: string
          sort_order: number
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          page_content?: string | null
          page_name: string
          sort_order?: number
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          page_content?: string | null
          page_name?: string
          sort_order?: number
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_custom_webpages_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_notes: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note_text: string
          note_type: string
          pinned: boolean
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note_text: string
          note_type?: string
          pinned?: boolean
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note_text?: string
          note_type?: string
          pinned?: boolean
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_notes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_resumes: {
        Row: {
          created_at: string
          data: Json
          id: string
          last_generated_at: string | null
          pdf_url: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          last_generated_at?: string | null
          pdf_url?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          last_generated_at?: string | null
          pdf_url?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_resumes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          created_by: string | null
          email: string | null
          full_name: string
          gpa: number | null
          graduation_year: number | null
          handicap: number | null
          high_school: string | null
          id: string
          notes: string | null
          personal_website_url: string | null
          phone: string | null
          scoring_average: number | null
          slug: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name: string
          gpa?: number | null
          graduation_year?: number | null
          handicap?: number | null
          high_school?: string | null
          id?: string
          notes?: string | null
          personal_website_url?: string | null
          phone?: string | null
          scoring_average?: number | null
          slug: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          full_name?: string
          gpa?: number | null
          graduation_year?: number | null
          handicap?: number | null
          high_school?: string | null
          id?: string
          notes?: string | null
          personal_website_url?: string | null
          phone?: string | null
          scoring_average?: number | null
          slug?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      swing_videos: {
        Row: {
          camera_angle: string | null
          club: string | null
          created_at: string
          id: string
          is_public: boolean
          notes: string | null
          sort_order: number
          swing_type: string | null
          title: string
          updated_at: string
          user_id: string
          video_type: string
          video_url: string
        }
        Insert: {
          camera_angle?: string | null
          club?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          notes?: string | null
          sort_order?: number
          swing_type?: string | null
          title?: string
          updated_at?: string
          user_id: string
          video_type?: string
          video_url: string
        }
        Update: {
          camera_angle?: string | null
          club?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          notes?: string | null
          sort_order?: number
          swing_type?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          video_type?: string
          video_url?: string
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
      get_public_swing_golfers: {
        Args: never
        Returns: {
          avatar_url: string
          city: string
          full_name: string
          goal_division: string
          graduation_year: number
          handicap: number
          high_school: string
          latest_video_at: string
          state: string
          user_id: string
          video_count: number
        }[]
      }
      get_public_swing_profile: {
        Args: { _user_id: string }
        Returns: {
          avatar_url: string
          city: string
          club_team: string
          full_name: string
          goal_division: string
          graduation_year: number
          handicap: number
          high_school: string
          home_course: string
          state: string
          user_id: string
        }[]
      }
      get_shared_documents: {
        Args: { _token: string }
        Returns: {
          category: string
          description: string
          document_id: string
          expires_at: string
          file_name: string
          file_size: number
          label: string
          mime_type: string
          owner_name: string
          share_id: string
          storage_path: string
          title: string
        }[]
      }
      has_inventory_access: { Args: { _min_role?: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_promo_uses: { Args: { promo_id: string }; Returns: boolean }
      increment_referral_uses: {
        Args: { referral_id: string }
        Returns: boolean
      }
      increment_share_view: { Args: { _token: string }; Returns: undefined }
      validate_promo_code: {
        Args: { _code: string }
        Returns: {
          discount_percent: number
          is_valid: boolean
          name: string
        }[]
      }
      validate_referral_code: {
        Args: { _code: string }
        Returns: {
          discount_percent: number
          is_valid: boolean
        }[]
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "coach"
        | "inventory_admin"
        | "inventory_editor"
        | "inventory_viewer"
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
      app_role: [
        "admin",
        "moderator",
        "user",
        "coach",
        "inventory_admin",
        "inventory_editor",
        "inventory_viewer",
      ],
      division: ["D1", "D2", "D3", "NAIA", "JUCO"],
      school_size: ["Small", "Medium", "Large", "Very Large"],
    },
  },
} as const
