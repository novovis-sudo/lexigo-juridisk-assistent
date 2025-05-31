
import { supabase } from '@/integrations/supabase/client';

export class FileService {
  // File upload for documents (PDFs, images, etc.)
  static async uploadFile(file: File, bucket: string = 'legal-documents'): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  static async deleteFile(fileName: string, bucket: string = 'legal-documents'): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }
}
