import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Activity, MessageSquare, Bookmark, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityItem {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: any;
  created_at: string;
}

const actionIcons: Record<string, React.ElementType> = {
  comment: MessageSquare,
  save: Bookmark,
  view: Eye,
};

interface Props {
  userId: string;
}

export default function DashboardActivity({ userId }: Props) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, [userId]);

  const fetchActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      console.error('Error fetching activity:', err);
    } finally {
      setIsLoading(false);
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
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activity yet</p>
            <p className="text-sm mt-1">Your actions like saving projects and commenting on posts will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((item) => {
              const Icon = actionIcons[item.action] || Activity;
              return (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="p-2 bg-gold/10 rounded-lg mt-0.5">
                    <Icon className="h-4 w-4 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {item.action === 'comment' && 'Commented on '}
                      {item.action === 'save' && 'Saved '}
                      {item.action === 'view' && 'Viewed '}
                      <span className="text-gold">{(item.metadata as any)?.title || item.resource_type}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(item.created_at), 'MMM d, yyyy · h:mm a')}
                    </p>
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
