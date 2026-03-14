import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ChevronDown, ChevronUp, CheckCircle, Mail, List } from 'lucide-react';

const PREVIEWS: Record<string, { label: string; content: React.ReactNode }> = {
  roadmap: {
    label: 'Preview Phase 1',
    content: (
      <div className="space-y-3">
        <h4 className="font-semibold text-foreground text-sm">Phase 1: Self-Assessment & Research</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {[
            'Evaluate your current skill level honestly (handicap, scoring average, tournament results)',
            'Research NCAA divisions and understand the differences (D1, D2, D3, NAIA, JUCO)',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
          <li className="flex items-start gap-2 opacity-40 blur-[2px] select-none">
            <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
            <span>Create a list of 20-30 potential schools based on academics, location, and golf program</span>
          </li>
          <li className="flex items-start gap-2 opacity-40 blur-[2px] select-none">
            <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
            <span>Understand NCAA eligibility requirements and the Eligibility Center registration</span>
          </li>
        </ul>
        <p className="text-xs text-muted-foreground italic">+ 4 more phases included...</p>
      </div>
    ),
  },
  templates: {
    label: 'Preview a Template',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Mail className="w-4 h-4 text-primary" />
          <h4 className="font-semibold text-foreground text-sm">First Contact — Introduction Email</h4>
        </div>
        <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 font-mono leading-relaxed">
          <p>Subject: Prospective Student-Athlete — [Your Name], Class of [Year]</p>
          <p className="mt-2">Dear Coach [Last Name],</p>
          <p className="mt-1">My name is [Your Name], and I am a [Grade] at [High School] in [City, State]. I am very interested in [University Name]'s golf program...</p>
          <div className="mt-2 opacity-40 blur-[2px] select-none">
            <p>Here are some of my recent accomplishments:</p>
            <p>• Current handicap: [X.X]</p>
            <p>• Scoring average: [XX.X]</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground italic">+ 14 more templates included...</p>
      </div>
    ),
  },
  resume: {
    label: 'Preview Template',
    content: (
      <div className="space-y-3">
        <div className="text-center border border-border/50 rounded-lg p-4 bg-card">
          <h4 className="font-bold text-foreground text-lg">[YOUR FULL NAME]</h4>
          <p className="text-xs text-muted-foreground">Class of [Graduation Year]</p>
          <p className="text-xs text-muted-foreground mt-1">[City, State] • [Phone] • [Email]</p>
        </div>
        <div className="space-y-1.5">
          {['PERSONAL INFORMATION', 'ACADEMIC PROFILE', 'GOLF STATISTICS'].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <List className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-medium text-foreground">{s}</span>
            </div>
          ))}
          {['TOURNAMENT RESULTS', 'AWARDS', 'REFERENCES'].map((s) => (
            <div key={s} className="flex items-center gap-2 opacity-40 blur-[1px] select-none">
              <List className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-medium text-foreground">{s}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground italic">Full fill-in template included...</p>
      </div>
    ),
  },
  course: {
    label: 'Preview Curriculum',
    content: (
      <div className="space-y-2">
        {[
          { mod: 'Module 1', title: 'Freshman Year — Laying the Foundation', lessons: 4 },
          { mod: 'Module 2', title: 'Sophomore Year — Building Visibility', lessons: 4 },
        ].map((m) => (
          <div key={m.mod} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40">
            <Badge variant="outline" className="text-[10px] flex-shrink-0">{m.mod}</Badge>
            <span className="text-sm text-foreground flex-1">{m.title}</span>
            <span className="text-xs text-muted-foreground">{m.lessons} lessons</span>
          </div>
        ))}
        {[
          { mod: 'Module 3', title: 'Junior Year — Active Recruiting', lessons: 4 },
          { mod: 'Module 4', title: 'Senior Year — Commitment & Transition', lessons: 4 },
        ].map((m) => (
          <div key={m.mod} className="flex items-center gap-3 p-2 rounded-lg bg-muted/40 opacity-40 blur-[1px] select-none">
            <Badge variant="outline" className="text-[10px] flex-shrink-0">{m.mod}</Badge>
            <span className="text-sm text-foreground flex-1">{m.title}</span>
            <span className="text-xs text-muted-foreground">{m.lessons} lessons</span>
          </div>
        ))}
        <p className="text-xs text-muted-foreground italic">16 lessons, ~3.5 hours total...</p>
      </div>
    ),
  },
};

interface ProductPreviewProps {
  productKey: string;
}

export const ProductPreview = ({ productKey }: ProductPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const preview = PREVIEWS[productKey];

  if (!preview) return null;

  return (
    <div className="mt-3">
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-xs text-primary hover:text-primary/80 gap-1.5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Eye className="w-3.5 h-3.5" />
        {preview.label}
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </Button>
      {isOpen && (
        <Card className="mt-2 border-dashed border-primary/20 bg-primary/[0.02]">
          <CardContent className="p-4">
            {preview.content}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
