import { useState } from 'react';
import { Upload, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ImportResult {
  success: boolean;
  results?: {
    inserted: number;
    updated: number;
    skipped: number;
    errors: string[];
  };
  message?: string;
  error?: string;
}

interface CollegeRow {
  name: string;
  state: string;
  division: string;
  teams5: string;
  teams6: string;
}

export function CollegeBulkImporter() {
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [customData, setCustomData] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);

  const parseMarkdownTable = (text: string): CollegeRow[] => {
    const lines = text.split('\n').filter(line => line.trim().startsWith('|'));
    return lines.map(line => {
      const parts = line.split('|').filter(Boolean).map(p => p.trim());
      return {
        name: parts[0] || '',
        state: parts[2] || '',
        division: parts[3] || '',
        teams5: parts[4] || '',
        teams6: parts[5] || '',
      };
    }).filter(c => 
      c.name && 
      c.name !== 'College/University' && 
      !c.name.startsWith('-') &&
      c.state !== 'State' &&
      c.state !== 'City / Campus'
    );
  };

  const handleImport = async (colleges: CollegeRow[]) => {
    setIsImporting(true);
    setResult(null);
    setProgress(0);

    const batchSize = 100;
    const batches = Math.ceil(colleges.length / batchSize);
    setTotalBatches(batches);

    const aggregatedResults = {
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: [] as string[],
    };

    try {
      for (let i = 0; i < batches; i++) {
        setCurrentBatch(i + 1);
        const batch = colleges.slice(i * batchSize, (i + 1) * batchSize);
        
        const { data: response, error } = await supabase.functions.invoke('import-colleges-bulk', {
          body: { colleges: batch },
        });

        if (error) {
          aggregatedResults.errors.push(`Batch ${i + 1} error: ${error.message}`);
          continue;
        }

        if (response?.results) {
          aggregatedResults.inserted += response.results.inserted || 0;
          aggregatedResults.updated += response.results.updated || 0;
          aggregatedResults.skipped += response.results.skipped || 0;
          if (response.results.errors) {
            aggregatedResults.errors.push(...response.results.errors);
          }
        }

        setProgress(Math.round(((i + 1) / batches) * 100));
      }

      const finalResult: ImportResult = {
        success: true,
        results: aggregatedResults,
        message: `Processed ${colleges.length} colleges. Inserted: ${aggregatedResults.inserted}, Updated: ${aggregatedResults.updated}, Skipped: ${aggregatedResults.skipped}`,
      };

      setResult(finalResult);
      toast({
        title: 'Import Complete',
        description: finalResult.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setResult({ success: false, error: message });
      toast({
        title: 'Import Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportFromPaste = () => {
    const colleges = parseMarkdownTable(customData);

    if (colleges.length === 0) {
      toast({
        title: 'No Data Found',
        description: 'Could not parse any college data from the pasted text.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Starting Import',
      description: `Found ${colleges.length} colleges. Starting import...`,
    });

    handleImport(colleges);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          <CardTitle>Bulk College Import</CardTitle>
        </div>
        <CardDescription>
          Import colleges from the parsed Excel data. Paste the markdown table data below (all rows starting with |).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Paste the markdown table data here...&#10;&#10;Example format:&#10;|[College Name](http://url)|City|State|NCAA I|M|W|"
            value={customData}
            onChange={(e) => setCustomData(e.target.value)}
            rows={12}
            className="font-mono text-xs"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Each row: |[College Name](URL)|City|State|Division|M|W|
          </p>
        </div>

        {isImporting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing batch {currentBatch} of {totalBatches}...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex gap-4">
          <Button
            onClick={handleImportFromPaste}
            disabled={isImporting || !customData.trim()}
          >
            {isImporting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Import Pasted Data
              </>
            )}
          </Button>
        </div>

        {result && (
          <Alert variant={result.success ? 'default' : 'destructive'}>
            {result.success ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{result.success ? 'Import Complete' : 'Import Failed'}</AlertTitle>
            <AlertDescription>
              {result.success && result.results ? (
                <div className="mt-2 space-y-1 text-sm">
                  <p>✅ Inserted: {result.results.inserted}</p>
                  <p>🔄 Updated: {result.results.updated}</p>
                  <p>⏭️ Skipped: {result.results.skipped}</p>
                  {result.results.errors.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-destructive">
                        ⚠️ {result.results.errors.length} errors
                      </summary>
                      <ul className="mt-1 list-disc list-inside text-xs max-h-40 overflow-auto">
                        {result.results.errors.slice(0, 20).map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                        {result.results.errors.length > 20 && (
                          <li>...and {result.results.errors.length - 20} more</li>
                        )}
                      </ul>
                    </details>
                  )}
                </div>
              ) : (
                result.error
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
