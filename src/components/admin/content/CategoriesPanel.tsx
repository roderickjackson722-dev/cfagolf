import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { useContentCategories, useSaveContentCategory, useDeleteContentCategory } from '@/hooks/useContentLibrary';
import { toast } from '@/hooks/use-toast';

export default function CategoriesPanel() {
  const { data: cats = [] } = useContentCategories();
  const save = useSaveContentCategory();
  const del = useDeleteContentCategory();
  const [newName, setNewName] = useState('');

  const addCat = async () => {
    if (!newName.trim()) return;
    await save.mutateAsync({ name: newName.trim(), sort_order: (cats.length + 1) * 10 });
    setNewName('');
    toast({ title: 'Category added' });
  };

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex gap-2">
        <Input placeholder="New category name" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <Button onClick={addCat}><Plus className="w-4 h-4 mr-1" />Add</Button>
      </div>
      <div className="border rounded-md divide-y">
        {cats.map((c) => (
          <div key={c.id} className="flex items-center gap-2 p-2">
            <Input
              value={c.name}
              onChange={(e) => save.mutate({ id: c.id, name: e.target.value })}
              className="flex-1"
            />
            <Input
              type="number"
              value={c.sort_order}
              onChange={(e) => save.mutate({ id: c.id, sort_order: parseInt(e.target.value) || 0 })}
              className="w-20"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (confirm(`Delete "${c.name}"?`)) del.mutate(c.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
