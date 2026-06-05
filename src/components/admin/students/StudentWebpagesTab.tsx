import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  FolderOpen,
  StickyNote,
  CalendarCheck,
  Activity,
  Pencil,
  ClipboardList,
} from 'lucide-react';

interface Props {
  studentId: string;
}

const items = (id: string) => [
  {
    label: 'Profile Info',
    description: 'Name, contact, school, GPA, handicap, status.',
    icon: Pencil,
    to: `/admin/students/${id}?tab=info`,
  },
  {
    label: 'Files & Content',
    description: 'Upload documents, photos, and template files.',
    icon: FolderOpen,
    to: `/admin/students/${id}?tab=content`,
  },
  {
    label: 'Golf Resume',
    description: 'Edit the full resume template and download PDF.',
    icon: FileText,
    to: `/admin/students/${id}/resume`,
  },
  {
    label: 'Meeting Agendas',
    description: 'Build agendas from templates, take notes, track tasks.',
    icon: CalendarCheck,
    to: `/admin/students/${id}?tab=agendas`,
  },
  {
    label: 'Coach Notes',
    description: 'Private notes about the student.',
    icon: StickyNote,
    to: `/admin/students/${id}?tab=notes`,
  },
  {
    label: 'Activity Log',
    description: 'See recent updates and events.',
    icon: Activity,
    to: `/admin/students/${id}?tab=activity`,
  },
  {
    label: 'Player Recruiting Site',
    description: 'If this student has a linked player site, edit it here.',
    icon: ClipboardList,
    to: `/admin/players`,
  },
];

export default function StudentWebpagesTab({ studentId }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Everything you can edit for this student in one place.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {items(studentId).map(({ label, description, icon: Icon, to }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-start gap-3">
              <div className="p-2 rounded bg-muted">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{label}</div>
                <div className="text-xs text-muted-foreground mb-2">{description}</div>
                <Button size="sm" variant="outline" asChild>
                  <Link to={to}>Open</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
