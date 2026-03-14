import { useState } from 'react';
import { Edit, Trash2, Plus, Search, GraduationCap, ImageDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { College } from '@/types/college';
import { CollegeFormDialog, CollegeFormData } from './CollegeFormDialog';
import { useCreateCollege, useUpdateCollege, useDeleteCollege } from '@/hooks/useAdminColleges';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
interface AdminCollegeTableProps {
  colleges: College[];
  isLoading: boolean;
}

export function AdminCollegeTable({ colleges, isLoading }: AdminCollegeTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingCollege, setDeletingCollege] = useState<College | null>(null);
  const [isFetchingLogos, setIsFetchingLogos] = useState(false);
  const [logoFetchStatus, setLogoFetchStatus] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createCollege = useCreateCollege();
  const updateCollege = useUpdateCollege();
  const deleteCollege = useDeleteCollege();

  const missingLogoCount = colleges.filter(c => !c.logo_url && c.website_url).length;

  const handleFetchLogos = async () => {
    setIsFetchingLogos(true);
    setLogoFetchStatus('Starting...');
    let totalSucceeded = 0;
    let offset = 0;

    try {
      while (true) {
        setLogoFetchStatus(`Processing batch (offset ${offset})...`);
        const { data, error } = await supabase.functions.invoke('fetch-college-logos', {
          body: { batchSize: 30, offset: 0 }, // always 0 since processed ones get logos
        });

        if (error) throw error;
        if (!data.success) throw new Error(data.error);

        totalSucceeded += data.succeeded;
        setLogoFetchStatus(`Fetched ${totalSucceeded} logos so far... (${data.remaining} remaining)`);

        if (data.processed === 0 || data.remaining === 0) break;
        offset += 30;

        // Refresh data between batches
        queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
        queryClient.invalidateQueries({ queryKey: ['colleges'] });
      }

      toast({
        title: 'Logo Fetch Complete',
        description: `Successfully fetched ${totalSucceeded} logos.`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to fetch logos',
        variant: 'destructive',
      });
    } finally {
      setIsFetchingLogos(false);
      setLogoFetchStatus('');
      queryClient.invalidateQueries({ queryKey: ['admin-colleges'] });
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    }
  };

  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOrUpdate = (data: CollegeFormData) => {
    if (editingCollege) {
      updateCollege.mutate(
        { id: editingCollege.id, data },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingCollege(null);
          },
        }
      );
    } else {
      createCollege.mutate(data, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  const handleDelete = () => {
    if (deletingCollege) {
      deleteCollege.mutate(deletingCollege.id, {
        onSuccess: () => setDeletingCollege(null),
      });
    }
  };

  const handleEdit = (college: College) => {
    setEditingCollege(college);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingCollege(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search colleges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add College
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{filteredColleges.length} colleges</span>
        <span>•</span>
        <span>{filteredColleges.filter(c => c.logo_url).length} with logos</span>
        <span>•</span>
        <span>{filteredColleges.filter(c => c.is_hbcu).length} HBCUs</span>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Division</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>HBCU</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredColleges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No colleges found
                </TableCell>
              </TableRow>
            ) : (
              filteredColleges.map((college) => (
                <TableRow key={college.id}>
                  <TableCell>
                    {college.logo_url ? (
                      <img
                        src={college.logo_url}
                        alt={`${college.name} logo`}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{college.name}</TableCell>
                  <TableCell>{college.state}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{college.division}</Badge>
                  </TableCell>
                  <TableCell>{college.team_gender}</TableCell>
                  <TableCell>
                    {college.is_hbcu && (
                      <Badge variant="outline" className="bg-accent text-accent-foreground">
                        HBCU
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(college)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingCollege(college)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog */}
      <CollegeFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingCollege(null);
        }}
        college={editingCollege}
        onSubmit={handleCreateOrUpdate}
        isSubmitting={createCollege.isPending || updateCollege.isPending}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingCollege} onOpenChange={() => setDeletingCollege(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete College</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCollege?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCollege.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
