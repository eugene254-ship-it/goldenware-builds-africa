import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, MapPin, Calendar, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

interface ClientProject {
  id: string;
  title: string;
  description: string | null;
  status: string;
  service_type: string | null;
  location: string | null;
  progress: number | null;
  start_date: string | null;
  end_date: string | null;
  budget_estimate: number | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  planning: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_progress: 'bg-gold/10 text-gold border-gold/20',
  review: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  on_hold: 'bg-muted text-muted-foreground border-border',
};

const statusLabels: Record<string, string> = {
  planning: 'Planning',
  in_progress: 'In Progress',
  review: 'Under Review',
  completed: 'Completed',
  on_hold: 'On Hold',
};

interface Props {
  userId: string;
  onSelectProject: (id: string | null) => void;
}

export default function PortalProjects({ userId, onSelectProject }: Props) {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('client_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (id: string) => {
    const newId = selectedId === id ? null : id;
    setSelectedId(newId);
    onSelectProject(newId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-16 text-center">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
          <p className="text-muted-foreground font-sans">
            When your projects are set up, they'll appear here with full tracking.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <Card
          key={project.id}
          className={`bg-card border-border cursor-pointer transition-all duration-200 hover:border-gold/30 ${
            selectedId === project.id ? 'border-gold ring-1 ring-gold/20' : ''
          }`}
          onClick={() => handleSelect(project.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <Badge variant="outline" className={statusColors[project.status] || ''}>
                {statusLabels[project.status] || project.status}
              </Badge>
            </div>
            {project.description && (
              <p className="text-sm text-muted-foreground font-sans line-clamp-2">
                {project.description}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-sans">
              {project.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-gold" />
                  {project.location}
                </span>
              )}
              {project.service_type && (
                <span className="flex items-center gap-1">
                  <Briefcase size={14} className="text-gold" />
                  {project.service_type}
                </span>
              )}
              {project.start_date && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-gold" />
                  {format(new Date(project.start_date), 'MMM yyyy')}
                  {project.end_date && ` — ${format(new Date(project.end_date), 'MMM yyyy')}`}
                </span>
              )}
            </div>

            {project.progress != null && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-sans">Progress</span>
                  <span className="font-medium text-gold">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            )}

            {project.budget_estimate && (
              <div className="text-sm">
                <span className="text-muted-foreground font-sans">Budget: </span>
                <span className="font-medium">
                  KES {Number(project.budget_estimate).toLocaleString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
