import { motion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/layout/SectionHeader";
import OptimizedImage from "@/components/ui/optimized-image";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

import projectWater from "@/assets/project-water.jpg";
import projectHousing from "@/assets/project-housing.jpg";
import projectSchool from "@/assets/project-school.jpg";
import projectOffgrid from "@/assets/project-offgrid.jpg";
import projectMaterials from "@/assets/project-materials.jpg";

const projects = [
  {
    image: projectWater,
    title: "Makueni Water Project",
    location: "Makueni County",
    description: "Community water harvesting and distribution system serving 5,000+ residents.",
    category: "Water Infrastructure"
  },
  {
    image: projectHousing,
    title: "Affordable Housing Initiative",
    location: "Nairobi",
    description: "Sustainable plumbing and water systems for 200 residential units.",
    category: "Urban Development"
  },
  {
    image: projectSchool,
    title: "Rural School Sanitation",
    location: "Kitui County",
    description: "Complete sanitation facilities for 15 rural schools, impacting 3,000 students.",
    category: "Education"
  },
  {
    image: projectOffgrid,
    title: "Off-Grid Water Solutions",
    location: "Turkana County",
    description: "Solar-powered borehole systems for pastoralist communities.",
    category: "Off-Grid"
  },
  {
    image: projectMaterials,
    title: "Material Innovation Lab",
    location: "Machakos",
    description: "Research and fabrication of climate-resilient building materials.",
    category: "R&D"
  },
];

export default function ProjectsGallery() {
  return (
    <section id="projects" className="section-padding px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Our"
          titleAccent="Projects"
          description="Infrastructure that endures across Kenya's diverse landscapes and communities."
        />

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
        >
          {projects.map((project, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-gold/30 transition-all duration-300 card-shadow hover:card-shadow-hover"
            >
              <div className="relative overflow-hidden">
                <OptimizedImage
                  src={project.image}
                  alt={project.title}
                  aspectRatio="wide"
                  className="group-hover:scale-105 transition-transform duration-700"
                />
                {/* Category badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full">
                  <span className="text-xs font-medium text-gold font-sans">{project.category}</span>
                </div>
                {/* Hover arrow */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <ArrowUpRight size={18} className="text-background" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-1.5 text-gold text-sm font-medium mb-2 font-sans">
                  <MapPin size={14} />
                  {project.location}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-sans">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
