import { useWorksheetData } from '@/hooks/useWorksheetData';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import type { DeliverableSchema, DeliverableField } from '@/data/deliverableSchemas';

interface DeliverableWorksheetProps {
  schema: DeliverableSchema;
  readOnly?: boolean;
  /** For admin view — override user_id in useWorksheetData */
  userId?: string;
}

export function DeliverableWorksheet({ schema, readOnly = false, userId }: DeliverableWorksheetProps) {
  const worksheetKey = `deliverable-${schema.key}`;
  const defaultData: Record<string, string | boolean | number> = {};
  schema.fields.forEach(f => {
    defaultData[f.key] = f.type === 'checkbox' ? false : '';
  });

  const { data, updateData, isLoading } = useWorksheetData(worksheetKey, defaultData, userId);

  if (isLoading) {
    return <div className="py-4 text-center text-sm text-muted-foreground">Loading...</div>;
  }

  const filledCount = schema.fields.filter(f => {
    const val = data[f.key];
    if (f.type === 'checkbox') return val === true;
    return val !== '' && val !== undefined && val !== null;
  }).length;

  const totalCount = schema.fields.length;
  const isComplete = filledCount === totalCount;

  const updateField = (key: string, value: string | boolean | number) => {
    updateData((prev: Record<string, string | boolean | number>) => ({ ...prev, [key]: value }));
  };

  const renderField = (field: DeliverableField) => {
    const value = data[field.key];

    if (field.type === 'checkbox') {
      return (
        <div key={field.key} className="flex items-center gap-3 py-1">
          <Checkbox
            id={field.key}
            checked={!!value}
            onCheckedChange={(checked) => !readOnly && updateField(field.key, !!checked)}
            disabled={readOnly}
          />
          <Label htmlFor={field.key} className="text-sm cursor-pointer">
            {field.label}
          </Label>
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <div key={field.key} className="space-y-1">
          <Label className="text-sm">{field.label}</Label>
          {readOnly ? (
            <p className="text-sm p-2 bg-muted rounded">{(value as string) || '—'}</p>
          ) : (
            <Select
              value={(value as string) || ''}
              onValueChange={(v) => updateField(field.key, v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.key} className="space-y-1">
          <Label className="text-sm">{field.label}</Label>
          {readOnly ? (
            <p className="text-sm p-2 bg-muted rounded whitespace-pre-wrap min-h-[40px]">{(value as string) || '—'}</p>
          ) : (
            <Textarea
              value={(value as string) || ''}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="min-h-[80px]"
            />
          )}
        </div>
      );
    }

    // text, number, date
    return (
      <div key={field.key} className="space-y-1">
        <Label className="text-sm">{field.label}</Label>
        {readOnly ? (
          <p className="text-sm p-2 bg-muted rounded">{(value as string) || '—'}</p>
        ) : (
          <Input
            type={field.type}
            value={(value as string) ?? ''}
            onChange={(e) => updateField(field.key, field.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
            placeholder={field.placeholder}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-sm">{schema.title}</h4>
          <p className="text-xs text-muted-foreground">{schema.description}</p>
        </div>
        <Badge variant={isComplete ? 'default' : 'outline'} className="text-xs gap-1">
          {isComplete && <CheckCircle2 className="w-3 h-3" />}
          {filledCount}/{totalCount}
        </Badge>
      </div>
      <div className="space-y-3">
        {schema.fields.map(renderField)}
      </div>
      {!readOnly && (
        <p className="text-xs text-muted-foreground italic">Progress saves automatically.</p>
      )}
    </div>
  );
}
