import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Mail,
  Download,
  Search,
  FileText,
  Users,
  Loader2,
  LogOut,
  Calendar,
  Building,
  Plus,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  message: string;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  verified: boolean;
  created_at: string;
}

export default function Admin() {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [isSettingUpAdmin, setIsSettingUpAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch contact submissions
      const { data: contactData, error: contactError } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (contactError) throw contactError;
      setSubmissions(contactData || []);

      // Fetch blog posts
      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .select('id, title, slug, published, created_at')
        .order('created_at', { ascending: false });

      if (blogError) throw blogError;
      setBlogPosts(blogData || []);

      // Fetch subscribers
      const { data: subData, error: subError } = await supabase
        .from('subscribers')
        .select('id, email, name, verified, created_at')
        .is('unsubscribed_at', null)
        .order('created_at', { ascending: false });

      if (subError) throw subError;
      setSubscribers(subData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupFirstAdmin = async () => {
    setIsSettingUpAdmin(true);
    try {
      const { data, error } = await supabase.functions.invoke('setup-first-admin');
      
      if (error) throw error;

      if (data.isAdmin) {
        toast.success(data.message);
        // Reload the page to refresh auth context
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error('Error setting up admin:', error);
      toast.error('Failed to set up admin');
    } finally {
      setIsSettingUpAdmin(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !dateFilter || sub.created_at.startsWith(dateFilter);

    return matchesSearch && matchesDate;
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Organization', 'Message', 'Date'];
    const rows = filteredSubmissions.map((sub) => [
      sub.name,
      sub.email,
      sub.organization || '',
      sub.message.replace(/"/g, '""'),
      format(new Date(sub.created_at), 'yyyy-MM-dd HH:mm'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
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
            <Shield className="h-12 w-12 text-gold mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground mb-6">
              You need admin privileges to access this page.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleSetupFirstAdmin} 
                disabled={isSettingUpAdmin}
                className="w-full glow-gold"
              >
                {isSettingUpAdmin ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Become First Admin'
                )}
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                Return Home
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Only works if no admin exists yet
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            <h1 className="text-xl font-bold text-gradient-gold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Contact Submissions
                </CardTitle>
                <Mail className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{submissions.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Blog Posts
                </CardTitle>
                <FileText className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{blogPosts.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Published Posts
                </CardTitle>
                <FileText className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {blogPosts.filter((p) => p.published).length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Subscribers
                </CardTitle>
                <Users className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{subscribers.length}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="submissions" className="space-y-6">
            <TabsList className="bg-secondary">
              <TabsTrigger value="submissions">Contact Submissions</TabsTrigger>
              <TabsTrigger value="blog">Blog Posts</TabsTrigger>
              <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            </TabsList>

            <TabsContent value="submissions" className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, organization, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-secondary border-border"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="pl-10 bg-secondary border-border w-44"
                    />
                  </div>
                  <Button onClick={exportToCSV} variant="outline" className="border-border">
                    <Download size={16} className="mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>

              {/* Submissions Table */}
              <Card className="bg-card border-border">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-gold" />
                    </div>
                  ) : filteredSubmissions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No submissions found</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-secondary/50">
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Organization</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSubmissions.map((sub) => (
                          <TableRow key={sub.id} className="border-border hover:bg-secondary/50">
                            <TableCell className="font-medium">{sub.name}</TableCell>
                            <TableCell>
                              <a
                                href={`mailto:${sub.email}`}
                                className="text-gold hover:underline"
                              >
                                {sub.email}
                              </a>
                            </TableCell>
                            <TableCell>
                              {sub.organization ? (
                                <span className="flex items-center gap-1">
                                  <Building size={14} className="text-muted-foreground" />
                                  {sub.organization}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{sub.message}</TableCell>
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                              {format(new Date(sub.created_at), 'MMM d, yyyy')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Manage Blog Posts</h2>
                <Button asChild className="glow-gold">
                  <Link to="/admin/blog/new">
                    <Plus size={16} className="mr-2" />
                    New Post
                  </Link>
                </Button>
              </div>

              <Card className="bg-card border-border">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-gold" />
                    </div>
                  ) : blogPosts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No blog posts yet</p>
                      <Button asChild variant="outline" className="mt-4">
                        <Link to="/admin/blog/new">Create your first post</Link>
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-secondary/50">
                          <TableHead>Title</TableHead>
                          <TableHead>Slug</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blogPosts.map((post) => (
                          <TableRow key={post.id} className="border-border hover:bg-secondary/50">
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell className="text-muted-foreground">{post.slug}</TableCell>
                            <TableCell>
                              <Badge
                                variant={post.published ? 'default' : 'secondary'}
                                className={post.published ? 'bg-green-600' : ''}
                              >
                                {post.published ? 'Published' : 'Draft'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {format(new Date(post.created_at), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell>
                              <Button asChild variant="ghost" size="sm">
                                <Link to={`/admin/blog/${post.id}`}>Edit</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscribers" className="space-y-4">
              <h2 className="text-lg font-semibold">Email Subscribers</h2>

              <Card className="bg-card border-border">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-gold" />
                    </div>
                  ) : subscribers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No subscribers yet</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-secondary/50">
                          <TableHead>Email</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Subscribed</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscribers.map((sub) => (
                          <TableRow key={sub.id} className="border-border hover:bg-secondary/50">
                            <TableCell className="font-medium">{sub.email}</TableCell>
                            <TableCell>{sub.name || <span className="text-muted-foreground">—</span>}</TableCell>
                            <TableCell>
                              <Badge variant={sub.verified ? 'default' : 'secondary'} className={sub.verified ? 'bg-green-600' : ''}>
                                {sub.verified ? 'Verified' : 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {format(new Date(sub.created_at), 'MMM d, yyyy')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
