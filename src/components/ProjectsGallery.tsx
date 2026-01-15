import { motion } from "framer-motion";
import projectHousing from "@/assets/project-housing.jpg";
import projectWater from "@/assets/project-water.jpg";
import projectOffgrid from "@/assets/project-offgrid.jpg";
import projectMaterials from "@/assets/project-materials.jpg";
import projectSchool from "@/assets/project-school.jpg";

const projects = [
  {
    image: projectHousing,
    title: "Nairobi Urban Housing",
    location: "Nairobi County",
    description: "Multi-story residential with integrated rainwater harvesting systems.",
  },
  {
    image: projectWater,
    title: "Makueni Water Project",
    location: "Makueni County",
    description: "County-wide water storage and distribution infrastructure.",
  },
  {
    image: projectOffgrid,
    title: "Turkana Solar Water",
    location: "Turkana County",
    description: "Off-grid solar-powered water pumping for remote communities.",
  },
  {
    image: projectMaterials,
    title: "Materials Hub",
    location: "Mombasa",
    description: "Regional distribution center for climate-fit building materials.",
  },
  {
    image: projectSchool,
    title: "Kisumu School Complex",
    location: "Kisumu County",
    description: "Educational facility with complete water and sanitation systems.",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function ProjectsGallery() {
  return (
    <section id="projects" className="py-24 md:py-32 px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our <span className="text-gradient-gold">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Infrastructure that endures across Kenya's diverse landscapes and communities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-lg bg-card border border-border hover:border-gold/30 transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <p className="text-gold text-sm font-medium mb-2">{project.location}</p>
                <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm">{project.description}</p>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
