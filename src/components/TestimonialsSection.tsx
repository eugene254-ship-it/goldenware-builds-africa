import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Goldenware transformed our county's water infrastructure. Their attention to quality and local skills development has set a new standard for public works in Kenya.",
    author: "Dr. Peter Mutua",
    role: "County Executive, Makueni",
    organization: "Makueni County Government",
  },
  {
    quote: "As a developer, working with Goldenware gave us confidence that our buildings would stand the test of time. Their material expertise is unmatched.",
    author: "Faith Karanja",
    role: "Managing Director",
    organization: "Nairobi Urban Developers",
  },
  {
    quote: "The solar water pumping systems they installed for our community have been life-changing. Clean water, powered by the sun, maintained by local technicians.",
    author: "Joseph Ekai",
    role: "Community Elder",
    organization: "Turkana Community Initiative",
  },
  {
    quote: "Goldenware's approach to infrastructure is what Africa needs — sustainable, locally-driven, and built for the future. They're true partners.",
    author: "Sarah Oduya",
    role: "Regional Director",
    organization: "UN-Habitat Kenya",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by <span className="text-gradient-gold">Partners</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Hear from the counties, communities, and organizations we serve.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-card border border-border rounded-xl p-8 relative hover:border-gold/30 transition-colors duration-300"
            >
              <Quote className="absolute top-6 right-6 text-gold/20" size={48} />
              <p className="text-foreground/90 text-lg leading-relaxed mb-6 relative z-10">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="text-gold font-bold text-lg">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-gold">{testimonial.organization}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
