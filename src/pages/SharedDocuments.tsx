import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Download, Loader2, FolderLock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

type SharedDoc = {
  share_id: string;
  owner_name: string | null;
  label: string | null;
  document_id: string;
  title: string;
  description: string | null;
  category: string;
  storage_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  expires_at: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  transcript: 'Transcript',
  resume: 'Resume / Player Profile',
  release: 'Release Form',
  recommendation: 'Recommendation Letter',
  test_score: 'Test Score Report',
  other: 'Other',
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function SharedDocuments() {
  const { token } = useParams<{ token: string }>();
  const [docs, setDocs] = useState<SharedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const { data, error } = await supabase.rpc('get_shared_documents', { _token: token });
      if (error) {
        setError('This link is invalid or has expired.');
      } else if (!data || data.length === 0) {
        setError('This link is invalid, has been revoked, or has expired.');
      } else {
        setDocs(data as SharedDoc[]);
        // Track view (fire-and-forget)
        supabase.rpc('increment_share_view', { _token: token });
      }
      setLoading(false);
    })();
  }, [token]);

  async function handleOpen(d: SharedDoc) {
    const { data, error } = await supabase.storage
      .from('member-documents')
      .createSignedUrl(d.storage_path, 300);
    if (error || !data) {
      toast({ title: 'Could not open file', description: error?.message, variant: 'destructive' });
      return;
    }
    window.open(data.signedUrl, '_blank');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-3">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h1 className="font-display text-xl font-bold">Link unavailable</h1>
            <p className="text-sm text-muted-foreground">{error}</p>
            <p className="text-xs text-muted-foreground">If you believe this is a mistake, please contact the sender directly.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ownerName = docs[0]?.owner_name;
  const label = docs[0]?.label;
  const expiresAt = docs[0]?.expires_at;

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6 flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <FolderLock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {ownerName ? `${ownerName}'s Documents` : 'Shared Documents'}
            </h1>
            {label && <p className="text-muted-foreground mt-1">{label}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              Shared securely via College Fairway Advisors
              {expiresAt && ` · expires ${new Date(expiresAt).toLocaleDateString()}`}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{docs.length} document{docs.length === 1 ? '' : 's'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {docs.map(d => (
              <div key={d.document_id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{d.title}</p>
                    <Badge variant="secondary" className="text-[10px]">{CATEGORY_LABELS[d.category] ?? d.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{d.file_name} · {formatSize(d.file_size)}</p>
                  {d.description && <p className="text-xs text-muted-foreground mt-0.5">{d.description}</p>}
                </div>
                <Button size="sm" onClick={() => handleOpen(d)}>
                  <Download className="w-4 h-4 mr-2" /> Open
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          College Fairway Advisors · cfa.golf
        </p>
      </div>
    </div>
  );
}
