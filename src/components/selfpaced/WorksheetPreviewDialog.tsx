import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { previewModuleWorksheet, downloadModuleWorksheet } from '@/lib/selfPacedWorksheets';
import type { ModuleWorksheet, SelfPacedModule } from '@/data/selfPacedCourse';

interface Props {
  module: SelfPacedModule | null;
  worksheet: ModuleWorksheet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WorksheetPreviewDialog = ({ module, worksheet, open, onOpenChange }: Props) => {
  const [blobUrl, setBlobUrl] = useState<string | undefined>();
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!open || !module || !worksheet) return;
    setGenerating(true);
    setBlobUrl(undefined);
    // Defer to next tick so dialog opens quickly while jsPDF runs.
    const t = setTimeout(() => {
      const url = previewModuleWorksheet(module, worksheet);
      setBlobUrl(url);
      setGenerating(false);
    }, 30);
    return () => clearTimeout(t);
  }, [open, module, worksheet]);

  // Revoke blob URL on close to avoid leaks.
  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="text-base">{worksheet?.title ?? 'Worksheet preview'}</DialogTitle>
          {worksheet?.description && (
            <DialogDescription className="text-xs">{worksheet.description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="flex-1 bg-muted/30 overflow-hidden">
          {generating || !blobUrl ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Building preview...
            </div>
          ) : (
            <iframe
              src={`${blobUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full"
              title={worksheet?.title ?? 'Worksheet preview'}
            />
          )}
        </div>

        <DialogFooter className="p-3 border-t flex-row sm:justify-between gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            disabled={!module || !worksheet || generating}
            onClick={() => {
              if (module && worksheet) downloadModuleWorksheet(module, worksheet);
            }}
          >
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
