import { useState, useEffect } from 'react';
import { useFlyerContent, useUpdateFlyerContent } from '@/hooks/useFlyerContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, Save, Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ServiceItem { title: string; desc: string; }
interface PillarItem { title: string; desc: string; }

const AdminFlyerEditor = () => {
  const { data: content, isLoading } = useFlyerContent();
  const updateMutation = useUpdateFlyerContent();

  const [fields, setFields] = useState<Record<string, string>>({});
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [pillars, setPillars] = useState<PillarItem[]>([]);

  useEffect(() => {
    if (content) {
      setFields({ ...content });
      try { setServices(JSON.parse(content.services || '[]')); } catch { setServices([]); }
      try { setPillars(JSON.parse(content.pillars || '[]')); } catch { setPillars([]); }
    }
  }, [content]);

  const updateField = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const updates = Object.entries(fields)
      .filter(([key]) => key !== 'services' && key !== 'pillars')
      .map(([key, value]) => ({ key, value }));
    updates.push({ key: 'services', value: JSON.stringify(services) });
    updates.push({ key: 'pillars', value: JSON.stringify(pillars) });
    updateMutation.mutate(updates);
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <CardTitle>Marketing Flyer Editor</CardTitle>
            </div>
            <CardDescription>Edit the content displayed on the /flyer marketing page and PDF download.</CardDescription>
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            <Save className="w-4 h-4 mr-1" /> {updateMutation.isPending ? 'Saving…' : 'Save All Changes'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header Section */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Header</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Headline</Label>
              <Input value={fields.headline || ''} onChange={e => updateField('headline', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Subheadline</Label>
              <Input value={fields.subheadline || ''} onChange={e => updateField('subheadline', e.target.value)} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Intro */}
        <div className="space-y-1">
          <Label>Introduction Text</Label>
          <Textarea value={fields.intro || ''} onChange={e => updateField('intro', e.target.value)} rows={3} />
        </div>

        <Separator />

        {/* Services */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Services</h3>
            <Button variant="outline" size="sm" onClick={() => setServices([...services, { title: '', desc: '' }])}>
              <Plus className="w-3 h-3 mr-1" /> Add Service
            </Button>
          </div>
          <div className="space-y-3">
            {services.map((s, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input placeholder="Title" value={s.title} onChange={e => {
                    const updated = [...services]; updated[i] = { ...updated[i], title: e.target.value }; setServices(updated);
                  }} />
                  <Input placeholder="Description" value={s.desc} onChange={e => {
                    const updated = [...services]; updated[i] = { ...updated[i], desc: e.target.value }; setServices(updated);
                  }} />
                </div>
                <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => setServices(services.filter((_, j) => j !== i))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Pricing */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Price Display</Label>
              <Input value={fields.price || ''} onChange={e => updateField('price', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Price Subtitle</Label>
              <Input value={fields.price_subtitle || ''} onChange={e => updateField('price_subtitle', e.target.value)} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Pillars */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Why Us — Pillars</h3>
            <Button variant="outline" size="sm" onClick={() => setPillars([...pillars, { title: '', desc: '' }])}>
              <Plus className="w-3 h-3 mr-1" /> Add Pillar
            </Button>
          </div>
          <div className="space-y-3">
            {pillars.map((p, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input placeholder="Title" value={p.title} onChange={e => {
                    const updated = [...pillars]; updated[i] = { ...updated[i], title: e.target.value }; setPillars(updated);
                  }} />
                  <Input placeholder="Description" value={p.desc} onChange={e => {
                    const updated = [...pillars]; updated[i] = { ...updated[i], desc: e.target.value }; setPillars(updated);
                  }} />
                </div>
                <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => setPillars(pillars.filter((_, j) => j !== i))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Stats */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="space-y-2">
                <div className="space-y-1">
                  <Label>Stat {n} Value</Label>
                  <Input value={fields[`stat_${n}_value`] || ''} onChange={e => updateField(`stat_${n}_value`, e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Stat {n} Label</Label>
                  <Input value={fields[`stat_${n}_label`] || ''} onChange={e => updateField(`stat_${n}_label`, e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Contact Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Website</Label>
              <Input value={fields.website || ''} onChange={e => updateField('website', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input value={fields.email || ''} onChange={e => updateField('email', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Social Handle</Label>
              <Input value={fields.social || ''} onChange={e => updateField('social', e.target.value)} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminFlyerEditor;
