import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DeliverableWorksheet } from '@/components/worksheets/DeliverableWorksheet';
import { getDeliverablesForModule, type DeliverableSchema } from '@/data/deliverableSchemas';

interface DeliverablesListProps {
  moduleNumber: number;
  program: 'hs' | 'transfer';
  readOnly?: boolean;
  userId?: string;
}

export function DeliverablesList({ moduleNumber, program, readOnly = false, userId }: DeliverablesListProps) {
  const deliverables = getDeliverablesForModule(moduleNumber, program);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  if (deliverables.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium flex items-center gap-1">
        <FileText className="w-4 h-4" /> Deliverables
      </p>
      {deliverables.map((schema) => (
        <Collapsible
          key={schema.key}
          open={expandedKey === schema.key}
          onOpenChange={(open) => setExpandedKey(open ? schema.key : null)}
        >
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center gap-2 p-2 rounded border hover:bg-muted/50 transition-colors text-left text-sm">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <span className="flex-1 font-medium">{schema.title}</span>
              {expandedKey === schema.key ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3 border border-t-0 rounded-b-lg bg-muted/20">
            <DeliverableWorksheet schema={schema} readOnly={readOnly} userId={userId} />
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
