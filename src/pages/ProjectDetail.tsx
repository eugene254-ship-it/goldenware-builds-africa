import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, ArrowRight, CheckCircle2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import OptimizedImage from "@/components/ui/optimized-image";
import { getProjectById, projects } from "@/data/projects";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { useSaveProject } from "@/hooks/useSaveProject";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  const project = id ? getProjectById(id) : undefined;
  const { isSaved, isLoading: saveLoading, toggle: toggleSave } = useSaveProject(id || '');
  useEffect(() => {
    if (!project && id) {
      navigate("/projects");
    }
  }, [project, id, navigate]);

  if (!project) {
    return null;
  }

  // Get related projects (same category, excluding current)
  const relatedProjects = projects
    .filter(p => p.category === project.category && p.id !== project.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onContactClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* Hero Image */}
      <section className="pt-20">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <OptimizedImage
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-24 left-6 z-10"
          >
            <Link to="/projects">
              <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
                <ArrowLeft size={16} className="mr-2" />
                All Projects
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Project Header */}
      <section className="px-6 -mt-32 relative z-10 pb-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4 text-gold border-gold/30 bg-gold/10">
              {project.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-sans">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-gold" />
                {project.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gold" />
                {project.year}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSave}
                disabled={saveLoading}
                className={isSaved ? 'border-gold text-gold' : ''}
              >
                <Bookmark size={16} className={`mr-1.5 ${isSaved ? 'fill-gold' : ''}`} />
                {isSaved ? 'Saved' : 'Save Project'}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
          >
            {project.impact.map((item, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="bg-card border-border text-center p-6 hover:border-gold/30 transition-colors">
                  <CardContent className="p-0">
                    <div className="text-3xl md:text-4xl font-bold text-gold mb-2">
                      {item.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">
                      {item.metric}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Project Description */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6">About This Project</h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-sans">
                {project.fullDescription}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4">Key Features</h3>
              <ul className="space-y-3">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-gold mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground font-sans">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="px-6 py-16 bg-secondary/30">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-8">Related Projects</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedProjects.map((related) => (
                  <Link key={related.id} to={`/projects/${related.id}`}>
                    <Card className="bg-card border-border overflow-hidden hover:border-gold/30 transition-all duration-300 group">
                      <div className="relative h-48 overflow-hidden">
                        <OptimizedImage
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-1.5 text-gold text-sm font-medium mb-2 font-sans">
                          <MapPin size={14} />
                          {related.location}
                        </div>
                        <h3 className="text-xl font-semibold group-hover:text-gold transition-colors">
                          {related.title}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Inspired by This Project?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 font-sans">
              Let's discuss how we can bring similar solutions to your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="glow-gold" onClick={() => setIsContactOpen(true)}>
                Start a Conversation
                <ArrowRight className="ml-2" size={18} />
              </Button>
              <Link to="/projects">
                <Button size="lg" variant="outline">
                  View More Projects
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
