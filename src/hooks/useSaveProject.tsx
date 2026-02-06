import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function useSaveProject(projectId: string) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('saved_projects')
      .select('id')
      .eq('user_id', user.id)
      .eq('project_id', projectId)
      .maybeSingle()
      .then(({ data }) => setIsSaved(!!data));
  }, [user, projectId]);

  const toggle = useCallback(async () => {
    if (!user) {
      toast.error('Please sign in to save projects');
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_projects')
          .delete()
          .eq('user_id', user.id)
          .eq('project_id', projectId);
        if (error) throw error;
        setIsSaved(false);
        toast.success('Project removed from saved');
      } else {
        const { error } = await supabase
          .from('saved_projects')
          .insert({ user_id: user.id, project_id: projectId });
        if (error) throw error;
        setIsSaved(true);

        // Log activity
        await supabase.from('user_activity').insert({
          user_id: user.id,
          action: 'save',
          resource_type: 'project',
          resource_id: projectId,
          metadata: { title: projectId },
        });

        toast.success('Project saved');
      }
    } catch (err) {
      toast.error('Failed to update saved projects');
    } finally {
      setIsLoading(false);
    }
  }, [user, projectId, isSaved]);

  return { isSaved, isLoading, toggle };
}
