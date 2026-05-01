// Per-module checklist persistence + auto-mark module complete when all
// items are checked. Stores per-item booleans in the existing
// worksheet_data table under key `self-paced-checklist-{slug}`, and
// upserts the meeting_progress row for the module to drive the course
// page completion UI and certificate eligibility.

import { useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWorksheetData } from '@/hooks/useWorksheetData';
import { supabase } from '@/integrations/supabase/client';
import type { SelfPacedModule } from '@/data/selfPacedCourse';

type ChecklistState = Record<string, boolean>;

export function useSelfPacedChecklist(mod: SelfPacedModule) {
  const queryClient = useQueryClient();
  const key = `self-paced-checklist-${mod.slug}`;
  const { data, updateData, isLoading } = useWorksheetData<ChecklistState>(key, {});

  const completedCount = useMemo(
    () => mod.checklist.filter((_, i) => data[String(i)]).length,
    [data, mod.checklist],
  );
  const allComplete = completedCount === mod.checklist.length && mod.checklist.length > 0;

  // When all items checked, ensure meeting_progress row is marked complete.
  // When unchecked back to incomplete, flip it back so the course page reflects it.
  useEffect(() => {
    if (isLoading) return;
    let cancelled = false;

    const sync = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const { data: existing } = await supabase
        .from('meeting_progress')
        .select('id, is_completed')
        .eq('user_id', user.id)
        .eq('module_number', mod.moduleNumber)
        .maybeSingle();

      if (allComplete) {
        if (existing?.is_completed) return;
        if (existing) {
          await supabase
            .from('meeting_progress')
            .update({
              is_completed: true,
              completed_date: new Date().toISOString(),
            })
            .eq('id', existing.id);
        } else {
          await supabase.from('meeting_progress').insert({
            user_id: user.id,
            module_number: mod.moduleNumber,
            module_title: mod.title,
            is_completed: true,
            completed_date: new Date().toISOString(),
          });
        }
      } else if (existing?.is_completed) {
        await supabase
          .from('meeting_progress')
          .update({ is_completed: false, completed_date: null })
          .eq('id', existing.id);
      } else {
        return;
      }

      if (!cancelled) {
        queryClient.invalidateQueries({ queryKey: ['my-meeting-progress'] });
      }
    };

    sync();
    return () => {
      cancelled = true;
    };
  }, [allComplete, isLoading, mod.moduleNumber, mod.title, queryClient]);

  const toggle = (index: number) => {
    updateData((prev) => ({ ...prev, [String(index)]: !prev[String(index)] }));
  };

  return {
    checked: data,
    toggle,
    completedCount,
    total: mod.checklist.length,
    allComplete,
    isLoading,
  };
}
