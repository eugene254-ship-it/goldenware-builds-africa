import { motion } from "framer-motion";
import { Linkedin, Twitter } from "lucide-react";
import SectionHeader from "@/components/layout/SectionHeader";
import OptimizedImage from "@/components/ui/optimized-image";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

import teamCeo from "@/assets/team-ceo.jpg";
import teamCoo from "@/assets/team-coo.jpg";
import teamEngineer from "@/assets/team-engineer.jpg";
import teamWater from "@/assets/team-water.jpg";

const teamMembers = [
  {
    image: teamCeo,
    name: "James Mwangi",
    role: "Founder & CEO",
    bio: "20+ years in infrastructure development across East Africa. Former World Bank consultant.",
    social: { linkedin: "#", twitter: "#" }
  },
  {
    image: teamCoo,
    name: "Grace Wanjiku",
    role: "Chief Operations Officer",
    bio: "Supply chain expert with deep expertise in sustainable material sourcing.",
    social: { linkedin: "#", twitter: "#" }
  },
  {
    image: teamEngineer,
    name: "Peter Ochieng",
    role: "Lead Engineer",
    bio: "Civil engineer specializing in climate-resilient infrastructure design.",
    social: { linkedin: "#", twitter: "#" }
  },
  {
    image: teamWater,
    name: "Mary Akinyi",
    role: "Water Systems Director",
    bio: "Hydrology specialist focused on community water access and conservation.",
    social: { linkedin: "#", twitter: "#" }
  },
];

export default function TeamSection() {
  return (
    <section className="section-padding px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Our"
          titleAccent="Leadership"
          description="Experienced professionals committed to building Africa's infrastructure future."
        />

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
        >
          {teamMembers.map((member, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="group text-center"
            >
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <OptimizedImage
                  src={member.image}
                  alt={member.name}
                  aspectRatio="square"
                  className="group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay with social links */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <div className="flex gap-3">
                    <a 
                      href={member.social.linkedin}
                      className="w-9 h-9 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-gold hover:text-background transition-colors"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin size={16} />
                    </a>
                    <a 
                      href={member.social.twitter}
                      className="w-9 h-9 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-gold hover:text-background transition-colors"
                      aria-label={`${member.name}'s Twitter`}
                    >
                      <Twitter size={16} />
                    </a>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
              <p className="text-gold font-medium text-sm mb-3 font-sans">{member.role}</p>
              <p className="text-muted-foreground text-sm leading-relaxed font-sans">{member.bio}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
