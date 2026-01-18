import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import OptimizedImage from "@/components/ui/optimized-image";
import type { Project } from "@/data/projects";

interface ProjectsMapProps {
  projects: Project[];
}

// Kenya county coordinates for SVG map positioning
const countyPositions: Record<string, { x: number; y: number }> = {
  Nairobi: { x: 52, y: 62 },
  Makueni: { x: 55, y: 68 },
  Kitui: { x: 62, y: 58 },
  Turkana: { x: 45, y: 15 },
  Machakos: { x: 55, y: 62 },
  Mombasa: { x: 70, y: 78 },
  Kisumu: { x: 25, y: 52 },
  Nakuru: { x: 42, y: 52 },
};

export default function ProjectsMap({ projects }: ProjectsMapProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="relative rounded-2xl border border-border bg-card overflow-hidden min-h-[600px]">
      {/* Map Container */}
      <div className="relative w-full h-[600px] bg-gradient-to-br from-secondary/50 to-background">
        {/* Kenya SVG Outline */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full opacity-20"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M35 5 L65 5 L80 25 L85 50 L75 80 L60 95 L35 90 L20 70 L15 45 L25 20 Z"
            fill="none"
            stroke="hsl(var(--gold))"
            strokeWidth="0.5"
          />
          {/* Lake Victoria */}
          <ellipse
            cx="22"
            cy="55"
            rx="8"
            ry="10"
            fill="hsl(var(--gold) / 0.1)"
            stroke="hsl(var(--gold) / 0.3)"
            strokeWidth="0.3"
          />
        </svg>

        {/* Project Markers */}
        {projects.map((project) => {
          const position = countyPositions[project.county];
          if (!position) return null;

          return (
            <motion.button
              key={project.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group ${
                selectedProject?.id === project.id ? "z-20" : ""
              }`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              onClick={() => setSelectedProject(project)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  selectedProject?.id === project.id
                    ? "bg-gold scale-125"
                    : "bg-gold/80 hover:bg-gold"
                }`}
              >
                <MapPin size={18} className="text-background" />
                {/* Pulse effect */}
                <div className="absolute inset-0 rounded-full bg-gold animate-ping opacity-30" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                  <span className="text-sm font-medium">{project.title}</span>
                </div>
              </div>
            </motion.button>
          );
        })}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2">Project Locations</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-gold" />
            <span className="font-sans">{projects.length} Projects</span>
          </div>
        </div>
      </div>

      {/* Selected Project Panel */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 w-80 z-30"
          >
            <Card className="bg-background border-border shadow-xl overflow-hidden">
              <div className="relative">
                <OptimizedImage
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  aspectRatio="wide"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-1.5 text-gold text-sm font-medium mb-2 font-sans">
                  <MapPin size={14} />
                  {selectedProject.location}
                </div>
                <h3 className="text-lg font-semibold mb-2">{selectedProject.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 font-sans">
                  {selectedProject.description}
                </p>
                <Link to={`/projects/${selectedProject.id}`}>
                  <Button size="sm" className="w-full bg-gold text-background hover:bg-gold/90">
                    View Case Study
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
