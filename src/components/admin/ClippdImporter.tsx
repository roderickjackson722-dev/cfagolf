import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Download, CheckCircle, AlertCircle, ExternalLink, Trophy } from 'lucide-react';
import { clippdApi, Division, Gender, ImportResult, ClippdTeam } from '@/lib/api/clippd';
import { toast } from '@/hooks/use-toast';

export function ClippdImporter() {
  const [division, setDivision] = useState<Division>('D1');
  const [gender, setGender] = useState<Gender>('Men');
  const [dryRun, setDryRun] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const divisions = clippdApi.getDivisions();
  const genders = clippdApi.getGenders();

  const handleImport = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const data = await clippdApi.importTeams(division, gender, dryRun);
      setResult(data);

      if (data.success) {
        if (dryRun) {
          toast({
            title: 'Preview Complete',
            description: `Found ${data.teamsFound} teams. Toggle off "Preview Only" to import.`,
          });
        } else {
          toast({
            title: 'Import Complete',
            description: `Imported ${data.imported} new, updated ${data.updated} existing teams.`,
          });
        }
      } else {
        toast({
          title: 'Import Failed',
          description: data.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to import data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkImport = async () => {
    if (dryRun) {
      toast({
        title: 'Preview Only Mode',
        description: 'Turn off "Preview Only" to perform bulk import.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    const allDivisions = divisions.map(d => d.value);
    const allGenders: Gender[] = ['Men', 'Women'];
    
    let totalImported = 0;
    let totalUpdated = 0;
    const allErrors: string[] = [];

    for (const div of allDivisions) {
      for (const gen of allGenders) {
        try {
          const data = await clippdApi.importTeams(div, gen, false);
          if (data.success) {
            totalImported += data.imported || 0;
            totalUpdated += data.updated || 0;
            if (data.errors) {
              allErrors.push(...data.errors);
            }
          }
        } catch (error) {
          allErrors.push(`${div} ${gen}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    toast({
      title: 'Bulk Import Complete',
      description: `Imported ${totalImported} new, updated ${totalUpdated} teams across all divisions.`,
    });

    setResult({
      success: true,
      division: 'All',
      gender: 'Both',
      teamsFound: totalImported + totalUpdated,
      imported: totalImported,
      updated: totalUpdated,
      errors: allErrors.slice(0, 10),
    });

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Clippd Data Importer
        </CardTitle>
        <CardDescription>
          Import college golf rankings, logos, and team data from{' '}
          <a 
            href="https://scoreboard.clippd.com/rankings/leaderboard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Clippd Scoreboard <ExternalLink className="w-3 h-3" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Division</Label>
            <Select value={division} onValueChange={(v) => setDivision(v as Division)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {genders.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mode</Label>
            <div className="flex items-center gap-2 h-10">
              <Switch
                id="dry-run"
                checked={dryRun}
                onCheckedChange={setDryRun}
              />
              <Label htmlFor="dry-run" className="cursor-pointer">
                Preview Only (no changes)
              </Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleImport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                {dryRun ? 'Preview Import' : 'Import Selected'}
              </>
            )}
          </Button>

          <Button 
            variant="outline" 
            onClick={handleBulkImport} 
            disabled={isLoading || dryRun}
          >
            Import All Divisions
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-destructive" />
              )}
              <span className="font-medium">
                {result.dryRun ? 'Preview Results' : 'Import Results'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                Division: {result.division}
              </Badge>
              <Badge variant="outline">
                Gender: {result.gender}
              </Badge>
              <Badge variant="secondary">
                {result.teamsFound} teams found
              </Badge>
              {!result.dryRun && (
                <>
                  <Badge className="bg-primary text-primary-foreground">
                    {result.imported} imported
                  </Badge>
                  <Badge variant="secondary">
                    {result.updated} updated
                  </Badge>
                </>
              )}
            </div>

            {result.errors && result.errors.length > 0 && (
              <div className="p-3 bg-destructive/10 rounded-md">
                <p className="text-sm font-medium text-destructive mb-2">
                  Errors ({result.errors.length}):
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  {result.errors.slice(0, 5).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.teams && result.teams.length > 0 && (
              <div className="space-y-2">
                <Label>Teams Preview (first 20)</Label>
                <ScrollArea className="h-64 rounded-md border">
                  <div className="p-3 space-y-2">
                    {result.teams.map((team, i) => (
                      <TeamPreviewRow key={i} team={team} />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TeamPreviewRow({ team }: { team: ClippdTeam }) {
  return (
    <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded text-sm font-semibold text-primary">
        <Trophy className="w-3 h-3 mr-1" />
        {team.rank}
      </div>
      {team.logoUrl ? (
        <img 
          src={team.logoUrl} 
          alt="" 
          className="w-8 h-8 object-contain rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
          N/A
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{team.name}</p>
        <p className="text-xs text-muted-foreground">
          {team.division} • {team.gender}
        </p>
      </div>
    </div>
  );
}
