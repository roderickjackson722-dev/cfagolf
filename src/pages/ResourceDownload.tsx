import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useFreeResourceBySlug, trackResourceDownload } from '@/hooks/useFreeResources';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, FileText, ArrowLeft } from 'lucide-react';

async function resolveDownloadUrl(resource: { file_path?: string | null; file_url?: string | null }) {
  if (resource.file_path) {
    const { data, error } = await supabase.storage
      .from('free-resources')
      .createSignedUrl(resource.file_path, 300, { download: true });
    if (!error && data?.signedUrl) return data.signedUrl;
  }
  return resource.file_url || null;
}

export default function ResourceDownload() {
  const { slug } = useParams<{ slug: string }>();
  const [params] = useSearchParams();
  const source = params.get('src') || params.get('source') || 'Website';
  const auto = params.get('auto') === '1';
  const { data: resource, isLoading } = useFreeResourceBySlug(slug);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    document.title = resource ? `${resource.name} — Free Download` : 'Free Resource';
  }, [resource]);

  const startDownload = async () => {
    if (!resource?.file_url) return;
    setDownloaded(true);
    try { await trackResourceDownload(resource.slug, source); } catch {}
    window.location.href = resource.file_url;
  };

  useEffect(() => {
    if (auto && resource && !downloaded) {
      startDownload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, resource]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Resource Not Found</h1>
        <p className="text-muted-foreground mb-6">This download link is invalid or no longer active.</p>
        <Button asChild><Link to="/">Go Home</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-6">
      <Card className="max-w-xl w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div>
            {resource.category && (
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {resource.category}
              </div>
            )}
            <h1 className="text-3xl font-bold mb-2">{resource.name}</h1>
            {resource.description && (
              <p className="text-muted-foreground">{resource.description}</p>
            )}
          </div>
          {resource.thumbnail_url && (
            <img src={resource.thumbnail_url} alt={resource.name} className="max-h-48 mx-auto rounded" />
          )}
          <div className="text-sm text-muted-foreground">
            {resource.file_type} {resource.file_size && `• ${resource.file_size}`}
          </div>
          <Button size="lg" className="w-full" onClick={startDownload} disabled={!resource.file_url}>
            <Download className="w-5 h-5 mr-2" />
            {downloaded ? 'Download Started' : 'Download Now'}
          </Button>
          <div className="pt-4 border-t">
            <Button asChild variant="ghost" size="sm">
              <Link to="/"><ArrowLeft className="w-4 h-4 mr-1" /> College Fairway Advisors</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
