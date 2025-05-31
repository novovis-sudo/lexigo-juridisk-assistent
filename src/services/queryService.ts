
import { supabase } from '@/integrations/supabase/client';

export class QueryService {
  static async logLegalQuery(query: string, category: string, response: string): Promise<void> {
    // For now, we'll store this in the requests table until we create a specific legal_queries table
    const { error } = await supabase
      .from('requests')
      .insert({
        user_input: `${category}: ${query}`,
        result: response
      });

    if (error) {
      console.error('Error logging legal query:', error);
      // Don't throw error for logging failures
    }
  }

  static async getQueryHistory(limit: number = 20): Promise<any[]> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching query history:', error);
      return [];
    }

    return data || [];
  }
}
