import { useState, useEffect } from 'react';
import { Loader2, Award, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  downloadCompletionCertificate,
  getCompletionCertificateBlobUrl,
} from '@/lib/selfPacedCertificate';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fullName: string;
}

export const CertificateDialog = ({ open, onOpenChange, fullName }: Props) => {
  const [blobUrl, setBlobUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!open) return;
    setBlobUrl(undefined);
    const t = setTimeout(() => {
      setBlobUrl(getCompletionCertificateBlobUrl({ fullName }));
    }, 30);
    return () => clearTimeout(t);
  }, [open, fullName]);

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Award className="w-4 h-4 text-primary" />
            Your Completion Certificate
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 bg-muted/30 overflow-hidden">
          {!blobUrl ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating certificate...
            </div>
          ) : (
            <iframe
              src={`${blobUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full"
              title="Completion Certificate"
            />
          )}
        </div>

        <DialogFooter className="p-3 border-t flex-row sm:justify-between gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => downloadCompletionCertificate({ fullName })}>
            <Download className="w-4 h-4 mr-1" /> Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
