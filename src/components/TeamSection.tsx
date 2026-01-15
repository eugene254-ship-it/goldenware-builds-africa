import { motion } from "framer-motion";
import teamCeo from "@/assets/team-ceo.jpg";
import teamCoo from "@/assets/team-coo.jpg";
import teamEngineer from "@/assets/team-engineer.jpg";
import teamWater from "@/assets/team-water.jpg";

const teamMembers = [
  {
    name: "James Mwangi",
    role: "Founder & CEO",
    image: teamCeo,
    bio: "25+ years in East African infrastructure. Former director at Kenya National Water Services. Drives Goldenware's vision for sustainable construction.",
  },
  {
    name: "Grace Wanjiru",
    role: "Chief Operations Officer",
    image: teamCoo,
    bio: "Expert in supply chain and county partnerships. Led the rollout of water projects across 12 Kenyan counties.",
  },
  {
    name: "David Ochieng",
    role: "Head of Engineering",
    image: teamEngineer,
    bio: "Civil engineer specializing in climate-resilient construction. Oversees all material fabrication and quality control.",
  },
  {
    name: "Amina Juma",
    role: "Water Systems Director",
    image: teamWater,
    bio: "Hydrologist with expertise in rainwater harvesting and sanitation infrastructure for rural and urban communities.",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function TeamSection() {
  return (
    <section className="py-24 md:py-32 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our <span className="text-gradient-gold">Leadership</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Experienced professionals committed to building Africa's infrastructure future.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group text-center"
            >
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
              <p className="text-gold font-medium text-sm mb-3">{member.role}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
