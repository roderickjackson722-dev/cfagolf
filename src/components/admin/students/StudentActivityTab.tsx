import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStudentActivity } from '@/hooks/useStudents';

export default function StudentActivityTab({ studentId }: { studentId: string }) {
  const { data: log = [] } = useStudentActivity(studentId);

  return (
    <Card>
      <CardContent className="p-4">
        {log.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <div className="divide-y">
            {log.map((a) => (
              <div key={a.id} className="py-2 flex justify-between gap-3 text-sm">
                <div>
                  <Badge variant="outline" className="mr-2">{a.action}</Badge>
                  {a.details && <span className="text-muted-foreground">{JSON.stringify(a.details)}</span>}
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
