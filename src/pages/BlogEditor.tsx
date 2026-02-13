import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Save, Trash2, Upload, Bell, X, Plus } from 'lucide-react';

export default function BlogEditor() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);
  const [wasPublished, setWasPublished] = useState(false);
  const [categoryId, setCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [allTags, setAllTags] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchCategoriesAndTags();
    if (!isNew && user && isAdmin) {
      fetchPost();
    }
  }, [id, user, isAdmin, isNew]);

  const fetchCategoriesAndTags = async () => {
    const [catRes, tagRes] = await Promise.all([
      supabase.from('blog_categories').select('id, name').order('name'),
      supabase.from('blog_tags').select('id, name, slug').order('name'),
    ]);
    if (catRes.data) setCategories(catRes.data);
    if (tagRes.data) setAllTags(tagRes.data);
  };

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt || '');
      setContent(data.content);
      setCoverImage(data.cover_image || '');
      setPublished(data.published);
      setWasPublished(data.published);
      setCategoryId(data.category_id || '');

      // Fetch post tags
      const { data: postTags } = await supabase
        .from('blog_post_tags')
        .select('tag_id')
        .eq('post_id', data.id);
      if (postTags) {
        setSelectedTagIds(postTags.map(t => t.tag_id));
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
      navigate('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (isNew) {
      setSlug(generateSlug(value));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setCoverImage(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    const slug = newTagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    try {
      const { data, error } = await supabase
        .from('blog_tags')
        .insert({ name: newTagName.trim(), slug })
        .select('id, name, slug')
        .single();
      if (error) throw error;
      setAllTags(prev => [...prev, data]);
      setSelectedTagIds(prev => [...prev, data.id]);
      setNewTagName('');
      toast.success(`Tag "${data.name}" created`);
    } catch (error: any) {
      if (error.code === '23505') toast.error('Tag already exists');
      else toast.error('Failed to create tag');
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !slug.trim()) {
      toast.error('Title, slug, and content are required');
      return;
    }

    setIsSaving(true);

    try {
      const postData = {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        cover_image: coverImage || null,
        published,
        published_at: published ? new Date().toISOString() : null,
        author_id: user?.id,
        category_id: categoryId || null,
      };

      let postId = id;

      if (isNew) {
        const { data, error } = await supabase.from('blog_posts').insert(postData).select('id').single();
        if (error) throw error;
        postId = data.id;
        toast.success('Post created successfully');
      } else {
        const { error } = await supabase.from('blog_posts').update(postData).eq('id', id);
        if (error) throw error;
        toast.success('Post updated successfully');
      }

      // Sync tags
      if (postId) {
        await supabase.from('blog_post_tags').delete().eq('post_id', postId);
        if (selectedTagIds.length > 0) {
          await supabase.from('blog_post_tags').insert(
            selectedTagIds.map(tag_id => ({ post_id: postId!, tag_id }))
          );
        }
      }

      navigate('/admin');
    } catch (error: any) {
      console.error('Error saving post:', error);
      if (error.code === '23505') {
        toast.error('A post with this slug already exists');
      } else {
        toast.error('Failed to save post');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotifySubscribers = async () => {
    if (!id || isNew) return;

    setIsNotifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('notify-subscribers', {
        body: {
          post_id: id,
          title,
          excerpt: excerpt || '',
          slug
        }
      });

      if (error) throw error;

      toast.success(data.message || 'Subscribers notified!');
    } catch (error: any) {
      console.error('Error notifying subscribers:', error);
      toast.error('Failed to notify subscribers');
    } finally {
      setIsNotifying(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      toast.success('Post deleted');
      navigate('/admin');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="max-w-md w-full bg-card border-border">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to edit blog posts.
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            <h1 className="text-xl font-bold">
              {isNew ? 'New Post' : 'Edit Post'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {!isNew && published && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNotifySubscribers}
                disabled={isNotifying}
                className="border-gold/30 hover:border-gold"
              >
                {isNotifying ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Bell size={16} className="mr-2" />
                )}
                Notify Subscribers
              </Button>
            )}
            {!isNew && (
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            )}
            <Button onClick={handleSave} disabled={isSaving} className="glow-gold">
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save size={16} className="mr-2" />
              )}
              {isNew ? 'Create' : 'Save'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter post title"
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="post-url-slug"
                    className="bg-secondary border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://example.com/image.jpg or upload"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="border-border"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload size={16} />
                    )}
                  </Button>
                </div>
                {coverImage && (
                  <div className="mt-3 relative aspect-video max-w-sm rounded-lg overflow-hidden border border-border">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of the post..."
                  rows={2}
                  className="bg-secondary border-border resize-none"
                />
              </div>

              {/* Category & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="New tag name..."
                      className="bg-secondary border-border"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleAddTag} className="border-border shrink-0">
                      <Plus size={14} className="mr-1" /> Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {allTags.map(tag => {
                      const isSelected = selectedTagIds.includes(tag.id);
                      return (
                        <Badge
                          key={tag.id}
                          variant={isSelected ? 'default' : 'outline'}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-gold text-background hover:bg-gold/80' : 'hover:border-gold/50'
                          }`}
                          onClick={() => {
                            setSelectedTagIds(prev =>
                              isSelected ? prev.filter(id => id !== tag.id) : [...prev, tag.id]
                            );
                          }}
                        >
                          {tag.name}
                          {isSelected && <X size={12} className="ml-1" />}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content (Markdown supported)</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here..."
                  rows={15}
                  className="bg-secondary border-border resize-none font-mono text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label htmlFor="published">Published</Label>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
