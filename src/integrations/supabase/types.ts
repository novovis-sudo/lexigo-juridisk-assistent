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
      ai_analyses: {
        Row: {
          analysis: Json | null
          created_at: string | null
          document_id: string | null
          id: string
        }
        Insert: {
          analysis?: Json | null
          created_at?: string | null
          document_id?: string | null
          id?: string
        }
        Update: {
          analysis?: Json | null
          created_at?: string | null
          document_id?: string | null
          id?: string
        }
        Relationships: []
      }
      analysis_results: {
        Row: {
          ai_model_used: string | null
          confidence_score: number | null
          created_at: string | null
          document_id: string
          entities: Json | null
          id: string
          key_points: string[] | null
          legal_issues: Json | null
          legal_references: Json | null
          next_steps: Json | null
          processing_time_ms: number | null
          recommendations: Json | null
          summary: string
          urgency_assessment: Json | null
          user_id: string
        }
        Insert: {
          ai_model_used?: string | null
          confidence_score?: number | null
          created_at?: string | null
          document_id: string
          entities?: Json | null
          id?: string
          key_points?: string[] | null
          legal_issues?: Json | null
          legal_references?: Json | null
          next_steps?: Json | null
          processing_time_ms?: number | null
          recommendations?: Json | null
          summary: string
          urgency_assessment?: Json | null
          user_id?: string
        }
        Update: {
          ai_model_used?: string | null
          confidence_score?: number | null
          created_at?: string | null
          document_id?: string
          entities?: Json | null
          id?: string
          key_points?: string[] | null
          legal_issues?: Json | null
          legal_references?: Json | null
          next_steps?: Json | null
          processing_time_ms?: number | null
          recommendations?: Json | null
          summary?: string
          urgency_assessment?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      document_classifications: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          label: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          label: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          label?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string
          created_at: string | null
          id: number
          title: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: never
          title: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: never
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      legal_concepts: {
        Row: {
          concept: string | null
          created_at: string | null
          id: string
          long_definition: string | null
          related_tags: string[] | null
          short_definition: string | null
          term: string
        }
        Insert: {
          concept?: string | null
          created_at?: string | null
          id?: string
          long_definition?: string | null
          related_tags?: string[] | null
          short_definition?: string | null
          term: string
        }
        Update: {
          concept?: string | null
          created_at?: string | null
          id?: string
          long_definition?: string | null
          related_tags?: string[] | null
          short_definition?: string | null
          term?: string
        }
        Relationships: []
      }
      legal_precedents: {
        Row: {
          case_date: string
          created_at: string | null
          id: string
          link: string | null
          summary: string | null
          title: string
        }
        Insert: {
          case_date: string
          created_at?: string | null
          id?: string
          link?: string | null
          summary?: string | null
          title: string
        }
        Update: {
          case_date?: string
          created_at?: string | null
          id?: string
          link?: string | null
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      legal_prompts: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          document_classification_id: string | null
          id: string
          prompt: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          document_classification_id?: string | null
          id?: string
          prompt: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          document_classification_id?: string | null
          id?: string
          prompt?: string
        }
        Relationships: []
      }
      legal_updates: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          published_at: string | null
          source: string | null
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          published_at?: string | null
          source?: string | null
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          published_at?: string | null
          source?: string | null
          title?: string
        }
        Relationships: []
      }
      letters: {
        Row: {
          content: string
          created_at: string | null
          document_id: string | null
          id: string
          letter_type: string
          metadata: Json | null
          recipient_address: string | null
          recipient_name: string | null
          status: string | null
          subject: string
          template_used: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          letter_type: string
          metadata?: Json | null
          recipient_address?: string | null
          recipient_name?: string | null
          status?: string | null
          subject: string
          template_used?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          letter_type?: string
          metadata?: Json | null
          recipient_address?: string | null
          recipient_name?: string | null
          status?: string | null
          subject?: string
          template_used?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          created_at: string | null
          id: string
          result: string | null
          user_input: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          result?: string | null
          user_input?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          result?: string | null
          user_input?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      document_type:
        | "eviction_notice"
        | "rental_contract"
        | "court_decision"
        | "benefit_decision"
        | "employment_contract"
        | "consumer_contract"
        | "insurance_document"
        | "debt_notice"
        | "other"
      urgency_level: "critical" | "high" | "medium" | "low"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      document_type: [
        "eviction_notice",
        "rental_contract",
        "court_decision",
        "benefit_decision",
        "employment_contract",
        "consumer_contract",
        "insurance_document",
        "debt_notice",
        "other",
      ],
      urgency_level: ["critical", "high", "medium", "low"],
    },
  },
} as const
