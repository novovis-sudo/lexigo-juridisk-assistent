
import { supabase } from '@/integrations/supabase/client';

export class LetterService {
  // Letter generation and storage
  static async storeLetter(letter: {
    document_id?: string;
    letter_type: string;
    recipient_name?: string;
    recipient_address?: string;
    subject: string;
    content: string;
    template_used?: string;
    metadata?: any;
  }, userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('letters')
      .insert({
        user_id: userId,
        document_id: letter.document_id,
        letter_type: letter.letter_type,
        recipient_name: letter.recipient_name,
        recipient_address: letter.recipient_address,
        subject: letter.subject,
        content: letter.content,
        template_used: letter.template_used,
        metadata: letter.metadata || {},
        status: 'generated'
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing letter:', error);
      throw new Error('Failed to store letter');
    }

    return data;
  }

  static async getUserLetters(limit: number = 20): Promise<any[]> {
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user letters:', error);
      return [];
    }

    return data || [];
  }
}
