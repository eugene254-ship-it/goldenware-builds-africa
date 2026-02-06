import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import ContactModal from '@/components/ContactModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import DashboardProfile from '@/components/dashboard/DashboardProfile';
import DashboardActivity from '@/components/dashboard/DashboardActivity';
import DashboardSavedProjects from '@/components/dashboard/DashboardSavedProjects';

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onContactClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      <section className="pt-32 pb-8 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Welcome back, <span className="text-gradient-gold">{user.user_metadata?.full_name || 'User'}</span>
          </motion.h1>
          <p className="text-muted-foreground">Manage your profile, track activity, and view saved projects.</p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 pb-24">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="saved">Saved Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <DashboardProfile user={user} />
          </TabsContent>

          <TabsContent value="activity">
            <DashboardActivity userId={user.id} />
          </TabsContent>

          <TabsContent value="saved">
            <DashboardSavedProjects userId={user.id} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="py-12 text-center border-t border-border">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Goldenware Enterprises Ltd · Kenya
        </p>
      </footer>
    </div>
  );
}
