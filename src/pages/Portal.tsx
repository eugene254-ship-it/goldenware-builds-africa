import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import ContactModal from '@/components/ContactModal';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Briefcase, FileText, Receipt, MessageSquare } from 'lucide-react';
import PortalProjects from '@/components/portal/PortalProjects';
import PortalDocuments from '@/components/portal/PortalDocuments';
import PortalInvoices from '@/components/portal/PortalInvoices';
import PortalMessages from '@/components/portal/PortalMessages';

export default function Portal() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Client <span className="text-gradient-gold">Portal</span>
            </h1>
            <p className="text-muted-foreground font-sans">
              Track your projects, access documents, view invoices, and communicate with the team.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-24">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="projects" className="gap-1.5">
              <Briefcase size={14} />
              Projects
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-1.5">
              <FileText size={14} />
              Documents
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-1.5">
              <Receipt size={14} />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-1.5">
              <MessageSquare size={14} />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <PortalProjects userId={user.id} onSelectProject={setSelectedProjectId} />
          </TabsContent>

          <TabsContent value="documents">
            <PortalDocuments userId={user.id} selectedProjectId={selectedProjectId} />
          </TabsContent>

          <TabsContent value="invoices">
            <PortalInvoices userId={user.id} />
          </TabsContent>

          <TabsContent value="messages">
            <PortalMessages userId={user.id} selectedProjectId={selectedProjectId} />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
