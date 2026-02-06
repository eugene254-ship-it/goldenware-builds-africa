import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import ContactModal from '@/components/ContactModal';
import BlogComments from '@/components/blog/BlogComments';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  cover_image: string | null;
  published_at: string | null;
  created_at: string;
  author_id: string | null;
  category_id: string | null;
}

interface TagData {
  id: string;
  name: string;
  slug: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [tags, setTags] = useState<TagData[]>([]);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, content, cover_image, published_at, created_at, author_id, category_id')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        navigate('/blog');
        return;
      }

      setPost(data);

      // Fetch category
      if (data.category_id) {
        const { data: cat } = await supabase
          .from('blog_categories')
          .select('name')
          .eq('id', data.category_id)
          .maybeSingle();
        if (cat) setCategoryName(cat.name);
      }

      // Fetch tags
      const { data: postTags } = await supabase
        .from('blog_post_tags')
        .select('tag_id')
        .eq('post_id', data.id);

      if (postTags && postTags.length > 0) {
        const tagIds = postTags.map(t => t.tag_id);
        const { data: tagData } = await supabase
          .from('blog_tags')
          .select('id, name, slug')
          .in('id', tagIds);
        setTags(tagData || []);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/blog');
    } finally {
      setIsLoading(false);
    }
  };

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-bold mt-6 mb-3">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} className="mb-4 leading-relaxed">{line}</p>;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onContactClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>

            {post.cover_image && (
              <div className="aspect-video rounded-lg overflow-hidden mb-8">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                <time>
                  {format(
                    new Date(post.published_at || post.created_at),
                    'MMMM d, yyyy'
                  )}
                </time>
              </span>
              {categoryName && (
                <Badge variant="outline" className="text-gold border-gold/30">{categoryName}</Badge>
              )}
              {tags.map(tag => (
                <Badge key={tag.id} variant="secondary" className="text-xs">{tag.name}</Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-8">{post.title}</h1>

            <div className="prose prose-invert prose-gold max-w-none text-foreground/90">
              {renderContent(post.content)}
            </div>

            {/* Comments */}
            <BlogComments postId={post.id} />
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-16 p-8 bg-secondary rounded-lg text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-3">Interested in our work?</h3>
            <p className="text-muted-foreground mb-4">
              Let's discuss how we can collaborate on your next project.
            </p>
            <Button
              className="glow-gold"
              onClick={() => setIsContactOpen(true)}
            >
              Get in Touch
            </Button>
          </motion.div>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-border">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Goldenware Enterprises Ltd · Kenya
        </p>
      </footer>
    </div>
  );
}
