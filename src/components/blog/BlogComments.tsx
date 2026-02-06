import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Loader2, MessageSquare, Reply, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  profile?: { full_name: string | null; email: string | null };
  replies?: Comment[];
}

interface Props {
  postId: string;
}

export default function BlogComments({ postId }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch profiles for comment authors
      const userIds = [...new Set((data || []).map(c => c.user_id))];
      let profileMap: Record<string, { full_name: string | null; email: string | null }> = {};
      
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', userIds);
        
        if (profiles) {
          profiles.forEach(p => {
            profileMap[p.user_id] = { full_name: p.full_name, email: p.email };
          });
        }
      }

      // Build thread structure
      const allComments = (data || []).map(c => ({
        ...c,
        profile: profileMap[c.user_id] || { full_name: null, email: null },
        replies: [] as Comment[],
      }));

      const topLevel: Comment[] = [];
      const byId: Record<string, Comment> = {};
      allComments.forEach(c => { byId[c.id] = c; });
      allComments.forEach(c => {
        if (c.parent_id && byId[c.parent_id]) {
          byId[c.parent_id].replies!.push(c);
        } else {
          topLevel.push(c);
        }
      });

      setComments(topLevel);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (parentId: string | null = null) => {
    const content = parentId ? replyContent : newComment;
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('blog_comments').insert({
        post_id: postId,
        user_id: user.id,
        parent_id: parentId,
        content: content.trim(),
      });

      if (error) throw error;

      // Log activity
      await supabase.from('user_activity').insert({
        user_id: user.id,
        action: 'comment',
        resource_type: 'blog_post',
        resource_id: postId,
        metadata: { title: 'a blog post' },
      });

      if (parentId) {
        setReplyContent('');
        setReplyingTo(null);
      } else {
        setNewComment('');
      }
      
      toast.success('Comment posted');
      fetchComments();
    } catch (err) {
      console.error('Error posting comment:', err);
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const { error } = await supabase.from('blog_comments').delete().eq('id', commentId);
      if (error) throw error;
      toast.success('Comment deleted');
      fetchComments();
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const name = comment.profile?.full_name || comment.profile?.email || 'User';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''}`}>
        <div className="flex items-start gap-3 py-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gold/10 text-gold text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{name}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(comment.created_at), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="text-sm text-foreground/80 mt-1 whitespace-pre-wrap">{comment.content}</p>
            <div className="flex items-center gap-2 mt-2">
              {user && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="text-xs text-muted-foreground hover:text-gold flex items-center gap-1 transition-colors"
                >
                  <Reply size={12} /> Reply
                </button>
              )}
              {user && user.id === comment.user_id && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={12} /> Delete
                </button>
              )}
            </div>

            {replyingTo === comment.id && (
              <div className="mt-3 space-y-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  rows={2}
                  className="bg-secondary border-border text-sm resize-none"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSubmit(comment.id)} disabled={isSubmitting} className="glow-gold">
                    {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Reply'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {comment.replies?.map(reply => renderComment(reply, depth + 1))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare size={20} className="text-gold" />
        Comments ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
      </h3>

      {user ? (
        <div className="mb-8 space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Join the discussion..."
            rows={3}
            className="bg-secondary border-border resize-none"
          />
          <Button onClick={() => handleSubmit(null)} disabled={isSubmitting || !newComment.trim()} className="glow-gold">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Post Comment
          </Button>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-secondary rounded-lg text-center">
          <p className="text-muted-foreground text-sm">
            <Link to="/login" className="text-gold hover:underline">Sign in</Link> to join the discussion.
          </p>
        </div>
      )}

      <div className="space-y-1">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No comments yet. Be the first!</p>
        ) : (
          comments.map(c => renderComment(c))
        )}
      </div>
    </div>
  );
}
