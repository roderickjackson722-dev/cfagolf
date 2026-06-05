import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContentCategories, useSaveContentItem, ContentItem } from '@/hooks/useContentLibrary';
import { toast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  item?: ContentItem | null;
}

export default function ContentItemDialog({ open, onOpenChange, item }: Props) {
  const { data: cats = [] } = useContentCategories();
  const save = useSaveContentItem();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isTemplate, setIsTemplate] = useState(true);
  const [isGlobal, setIsGlobal] = useState(true);
  const [tagsText, setTagsText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [changelog, setChangelog] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(item?.title ?? '');
      setDescription(item?.description ?? '');
      setCategoryId(item?.category_id ?? null);
      setIsTemplate(item?.is_template ?? true);
      setIsGlobal(item?.is_global ?? true);
      setTagsText((item?.tags ?? []).join(', '));
      setFile(null);
      setChangelog('');
    }
  }, [open, item]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: 'Title required', variant: 'destructive' });
      return;
    }
    try {
      await save.mutateAsync({
        id: item?.id,
        title: title.trim(),
        description: description.trim() || null,
        category_id: categoryId,
        is_template: isTemplate,
        is_global: isGlobal,
        tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
        file,
        ...(item?.id ? { changelog } : {}),
      } as any);
      toast({ title: item ? 'Updated' : 'Created' });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Content' : 'Upload Content'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={categoryId ?? ''} onValueChange={(v) => setCategoryId(v || null)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {cats.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tags (comma separated)</Label>
              <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="recruiting, email, ncaa" />
            </div>
          </div>

          <div>
            <Label>File {item?.file_name && <span className="text-muted-foreground text-xs">(current: {item.file_name})</span>}</Label>
            <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            {item && file && (
              <div className="mt-2">
                <Label>Changelog (new version)</Label>
                <Input value={changelog} onChange={(e) => setChangelog(e.target.value)} placeholder="What changed?" />
              </div>
            )}
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <Switch checked={isTemplate} onCheckedChange={setIsTemplate} />
              <span className="text-sm">Template (copyable to students)</span>
            </label>
            <label className="flex items-center gap-2">
              <Switch checked={isGlobal} onCheckedChange={setIsGlobal} />
              <span className="text-sm">Global (available to all)</span>
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
