import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Filter, Grid, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import OptimizedImage from "@/components/ui/optimized-image";
import ProjectsMap from "@/components/ProjectsMap";
import { projects, categories, CategoryType } from "@/data/projects";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

export default function Projects() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryType>("All");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onContactClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6 text-gold border-gold/30 bg-gold/5">
              Our Portfolio
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Projects That <span className="text-gradient-gold">Endure</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
              Explore our infrastructure projects across Kenya — each one built with foresight, 
              crafted for resilience, and designed to serve communities for generations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & View Toggle */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <Filter size={18} className="text-muted-foreground mr-2 mt-2" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className={activeCategory === category 
                    ? "bg-gold text-background hover:bg-gold/90" 
                    : "border-border hover:border-gold/50 hover:text-gold"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-gold text-background" : ""}
              >
                <Grid size={16} className="mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
                className={viewMode === "map" ? "bg-gold text-background" : ""}
              >
                <MapIcon size={16} className="mr-2" />
                Map
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Display */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={fadeInUp}
                      layout
                    >
                      <Link to={`/projects/${project.id}`}>
                        <div className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-gold/30 transition-all duration-300 card-shadow hover:card-shadow-hover h-full">
                          <div className="relative overflow-hidden">
                            <OptimizedImage
                              src={project.image}
                              alt={project.title}
                              aspectRatio="wide"
                              className="group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full">
                              <span className="text-xs font-medium text-gold font-sans">{project.category}</span>
                            </div>
                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                              <ArrowRight size={18} className="text-background" />
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex items-center gap-1.5 text-gold text-sm font-medium mb-2 font-sans">
                              <MapPin size={14} />
                              {project.location}
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-gold transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed font-sans">
                              {project.description}
                            </p>
                            <div className="mt-4 flex items-center gap-4 pt-4 border-t border-border">
                              <div className="text-sm">
                                <span className="text-gold font-semibold">{project.impact[0]?.value}</span>
                                <span className="text-muted-foreground ml-1">{project.impact[0]?.metric}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectsMap projects={filteredProjects} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/50 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Have a Project in Mind?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 font-sans">
              Let's discuss how we can bring resilient infrastructure to your community.
            </p>
            <Button size="lg" className="glow-gold" onClick={() => setIsContactOpen(true)}>
              Start a Conversation
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
