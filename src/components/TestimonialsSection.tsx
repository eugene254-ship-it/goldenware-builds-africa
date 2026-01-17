import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import SectionHeader from "@/components/layout/SectionHeader";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

const testimonials = [
  {
    quote: "Goldenware transformed our county's approach to water infrastructure. Their systems are still running flawlessly after 5 years.",
    author: "Governor James Muturi",
    role: "County Executive",
    organization: "Makueni County",
    rating: 5
  },
  {
    quote: "The quality of materials and craftsmanship exceeded our expectations. They truly understand what it means to build for the long term.",
    author: "Dr. Sarah Kimani",
    role: "Program Director",
    organization: "UN-Habitat Kenya",
    rating: 5
  },
  {
    quote: "Working with Goldenware was a partnership, not just a contract. They trained our local teams and ensured knowledge transfer.",
    author: "Peter Ndegwa",
    role: "Community Leader",
    organization: "Kitui Rural Development",
    rating: 5
  },
  {
    quote: "Their innovative approach to off-grid water solutions has changed lives in our remote communities.",
    author: "Mary Wambui",
    role: "Regional Coordinator",
    organization: "World Vision Kenya",
    rating: 5
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Trusted by"
          titleAccent="Partners"
          description="Hear from the counties, communities, and organizations we serve."
        />

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-card border border-border rounded-xl p-8 relative hover:border-gold/30 transition-all duration-300 card-shadow hover:card-shadow-hover group"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 text-gold/10 group-hover:text-gold/20 transition-colors" size={56} />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} size={16} className="text-gold fill-gold" />
                ))}
              </div>
              
              <p className="text-foreground/90 text-lg leading-relaxed mb-6 relative z-10 font-sans">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                  <span className="text-background font-bold text-lg font-sans">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground font-sans">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground font-sans">{testimonial.role}</p>
                  <p className="text-sm text-gold font-sans">{testimonial.organization}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
