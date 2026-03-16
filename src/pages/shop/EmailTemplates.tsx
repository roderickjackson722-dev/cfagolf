import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useDigitalProducts } from '@/hooks/useDigitalProducts';
import { useToolkitFileUrl } from '@/hooks/useToolkitFileUrl';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mail, Copy, ArrowLeft, Check, Loader2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { EMAIL_TEMPLATES } from '@/data/emailTemplates';

const TEMPLATES = EMAIL_TEMPLATES;

const EmailTemplates = () => {
  const { hasToolkitAccess, loading } = useDigitalProducts();
  const fileUrl = useToolkitFileUrl('templates');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasToolkitAccess) return <Navigate to="/toolkit" replace />;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/toolkit" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Toolkit
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
              <Mail className="w-7 h-7 text-blue-700" />
            </div>
            <div>
              <Badge variant="outline" className="mb-1">Templates & Swipe Files</Badge>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                15 Email Templates for Golf Coaches
              </h1>
            </div>
          </div>

          <p className="text-muted-foreground mb-4">
            Copy, customize with your details, and send. Each template is designed for a specific stage of the recruiting outreach process.
          </p>

          {fileUrl && (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="inline-block mb-8">
              <Button className="cfa-gradient hover:opacity-90">
                <Download className="w-4 h-4 mr-2" /> Download All Templates
              </Button>
            </a>
          )}

          <div className="space-y-10">
            {TEMPLATES.map((category, catIdx) => (
              <div key={catIdx}>
                <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary">{category.templates.length}</Badge>
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.templates.map((template, tIdx) => {
                    const templateId = `${catIdx}-${tIdx}`;
                    return (
                      <Card key={templateId}>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{template.title}</CardTitle>
                              <CardDescription className="mt-1">
                                Subject: <span className="font-medium text-foreground">{template.subject}</span>
                              </CardDescription>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(`Subject: ${template.subject}\n\n${template.body}`, templateId)}
                            >
                              {copiedIndex === templateId ? (
                                <><Check className="w-3 h-3 mr-1" /> Copied</>
                              ) : (
                                <><Copy className="w-3 h-3 mr-1" /> Copy</>
                              )}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 font-sans leading-relaxed">
                            {template.body}
                          </pre>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {catIdx < TEMPLATES.length - 1 && <Separator className="mt-8" />}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmailTemplates;
