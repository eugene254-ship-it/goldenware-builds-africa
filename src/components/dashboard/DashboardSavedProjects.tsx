import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface SavedProject {
  id: string;
  project_id: string;
  created_at: string;
}

interface Props {
  userId: string;
}

export default function DashboardSavedProjects({ userId }: Props) {
  const [saved, setSaved] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, [userId]);

  const fetchSaved = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSaved(data || []);
    } catch (err) {
      console.error('Error fetching saved projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = async (id: string) => {
    try {
      const { error } = await supabase.from('saved_projects').delete().eq('id', id);
      if (error) throw error;
      setSaved(prev => prev.filter(s => s.id !== id));
      toast.success('Project removed from saved');
    } catch (err) {
      toast.error('Failed to remove project');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Saved Projects</CardTitle>
      </CardHeader>
      <CardContent>
        {saved.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No saved projects yet</p>
            <p className="text-sm mt-1">Browse projects and save the ones you're interested in.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/projects">Browse Projects</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {saved.map((item) => {
              const project = projects.find(p => p.id === item.project_id);
              if (!project) return null;

              return (
                <div key={item.id} className="border border-border rounded-lg overflow-hidden hover:border-gold/30 transition-all group">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-gold transition-colors">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{project.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Saved {format(new Date(item.created_at), 'MMM d, yyyy')}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link to={`/projects/${project.id}`}>
                          View <ArrowRight size={14} className="ml-1" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleUnsave(item.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
