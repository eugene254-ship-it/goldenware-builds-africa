import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import ContactModal from '@/components/ContactModal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  created_at: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_image, published_at, created_at')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onContactClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            News & <span className="text-gradient-gold">Insights</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Updates on our projects, industry insights, and stories from the field
          </motion.p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No posts published yet</p>
              <p className="text-muted-foreground">Check back soon for updates!</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {posts.map((post) => (
                <motion.div key={post.id} variants={fadeInUp}>
                  <Link to={`/blog/${post.slug}`}>
                    <Card className="bg-card border-border h-full hover:border-gold/30 transition-all duration-300 group overflow-hidden">
                      {post.cover_image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Calendar size={14} />
                          <time>
                            {format(
                              new Date(post.published_at || post.created_at),
                              'MMMM d, yyyy'
                            )}
                          </time>
                        </div>
                        <h2 className="text-xl font-semibold mb-3 group-hover:text-gold transition-colors">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-muted-foreground line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1 text-gold text-sm font-medium group-hover:gap-2 transition-all">
                          Read more <ArrowRight size={14} />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-border">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Goldenware Enterprises Ltd · Kenya
        </p>
      </footer>
    </div>
  );
}
