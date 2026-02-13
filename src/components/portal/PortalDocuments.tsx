import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, FileText, Download, File } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
  project_id: string;
}

interface Props {
  userId: string;
  selectedProjectId: string | null;
}

export default function PortalDocuments({ userId, selectedProjectId }: Props) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, [selectedProjectId]);

  const fetchDocuments = async () => {
    try {
      let query = supabase.from('client_documents').select('*').order('created_at', { ascending: false });
      
      if (selectedProjectId) {
        query = query.eq('project_id', selectedProjectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProjectId) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be less than 10MB');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${selectedProjectId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('client-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('client-documents')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from('client_documents').insert({
        project_id: selectedProjectId,
        uploaded_by: userId,
        name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
      });

      if (insertError) throw insertError;

      toast.success('Document uploaded');
      fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedProjectId && (
        <div className="flex justify-end">
          <input ref={fileInputRef} type="file" onChange={handleUpload} className="hidden" />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="glow-gold"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
            Upload Document
          </Button>
        </div>
      )}

      {!selectedProjectId && (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground font-sans">Select a project from the Projects tab to view its documents.</p>
          </CardContent>
        </Card>
      )}

      {selectedProjectId && documents.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground font-sans">No documents yet for this project.</p>
          </CardContent>
        </Card>
      )}

      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => (
            <Card key={doc.id} className="bg-card border-border">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gold/10 rounded-lg">
                    <File size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{doc.name}</p>
                    <p className="text-xs text-muted-foreground font-sans">
                      {formatFileSize(doc.file_size)} · {format(new Date(doc.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm">
                    <Download size={16} />
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
