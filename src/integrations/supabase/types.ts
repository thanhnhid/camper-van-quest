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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          camper_id: string
          created_at: string
          customer_id: string
          end_date: string
          id: string
          start_date: string
          status: string
          total_price: number
          updated_at: string
        }
        Insert: {
          camper_id: string
          created_at?: string
          customer_id: string
          end_date: string
          id?: string
          start_date: string
          status?: string
          total_price: number
          updated_at?: string
        }
        Update: {
          camper_id?: string
          created_at?: string
          customer_id?: string
          end_date?: string
          id?: string
          start_date?: string
          status?: string
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_camper_id_fkey"
            columns: ["camper_id"]
            isOneToOne: false
            referencedRelation: "campers"
            referencedColumns: ["id"]
          },
        ]
      }
      campers: {
        Row: {
          additional_offers: string[] | null
          beds: number | null
          cancellation_fee: number | null
          capacity: number
          cleaning_fee: number | null
          created_at: string
          description: string | null
          dimensions_height: number | null
          dimensions_length: number | null
          dimensions_width: number | null
          drive_type: string | null
          drivers_license: string | null
          emission_class: string | null
          empty_weight: number | null
          engine_power: string | null
          features: string[] | null
          fuel_consumption: string | null
          gas_type: string | null
          id: string
          images: string[] | null
          insurance_included: boolean | null
          location: string
          max_weight: number | null
          name: string
          payload: number | null
          price_per_day: number
          provider_id: string
          security_deposit: number | null
          status: string
          trailer_coupling: boolean | null
          updated_at: string
          variable_pricing: Json | null
        }
        Insert: {
          additional_offers?: string[] | null
          beds?: number | null
          cancellation_fee?: number | null
          capacity: number
          cleaning_fee?: number | null
          created_at?: string
          description?: string | null
          dimensions_height?: number | null
          dimensions_length?: number | null
          dimensions_width?: number | null
          drive_type?: string | null
          drivers_license?: string | null
          emission_class?: string | null
          empty_weight?: number | null
          engine_power?: string | null
          features?: string[] | null
          fuel_consumption?: string | null
          gas_type?: string | null
          id?: string
          images?: string[] | null
          insurance_included?: boolean | null
          location: string
          max_weight?: number | null
          name: string
          payload?: number | null
          price_per_day: number
          provider_id: string
          security_deposit?: number | null
          status?: string
          trailer_coupling?: boolean | null
          updated_at?: string
          variable_pricing?: Json | null
        }
        Update: {
          additional_offers?: string[] | null
          beds?: number | null
          cancellation_fee?: number | null
          capacity?: number
          cleaning_fee?: number | null
          created_at?: string
          description?: string | null
          dimensions_height?: number | null
          dimensions_length?: number | null
          dimensions_width?: number | null
          drive_type?: string | null
          drivers_license?: string | null
          emission_class?: string | null
          empty_weight?: number | null
          engine_power?: string | null
          features?: string[] | null
          fuel_consumption?: string | null
          gas_type?: string | null
          id?: string
          images?: string[] | null
          insurance_included?: boolean | null
          location?: string
          max_weight?: number | null
          name?: string
          payload?: number | null
          price_per_day?: number
          provider_id?: string
          security_deposit?: number | null
          status?: string
          trailer_coupling?: boolean | null
          updated_at?: string
          variable_pricing?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "campers_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          points: number | null
          role: Database["public"]["Enums"]["user_role"]
          terms_accepted: boolean | null
          terms_accepted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          points?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          points?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          terms_accepted?: boolean | null
          terms_accepted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          camper_id: string
          created_at: string
          customer_id: string
          id: string
          rating: number
          review: string | null
          updated_at: string
        }
        Insert: {
          booking_id: string
          camper_id: string
          created_at?: string
          customer_id: string
          id?: string
          rating: number
          review?: string | null
          updated_at?: string
        }
        Update: {
          booking_id?: string
          camper_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          rating?: number
          review?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          camper_id: string
          created_at: string
          customer_id: string
          id: string
        }
        Insert: {
          camper_id: string
          created_at?: string
          customer_id: string
          id?: string
        }
        Update: {
          camper_id?: string
          created_at?: string
          customer_id?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_role_by_user_id: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      user_has_booking_with_profile: {
        Args: { _profile_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "customer" | "provider" | "admin"
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
      user_role: ["customer", "provider", "admin"],
    },
  },
} as const
