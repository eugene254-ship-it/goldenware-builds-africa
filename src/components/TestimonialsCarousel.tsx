import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote: "Goldenware transformed our county's approach to water infrastructure. Their systems are still running flawlessly after 5 years.",
    author: "Governor James Muturi",
    role: "County Executive",
    organization: "Makueni County",
  },
  {
    quote: "The quality of materials and craftsmanship exceeded our expectations. They truly understand what it means to build for the long term.",
    author: "Dr. Sarah Kimani",
    role: "Program Director",
    organization: "UN-Habitat Kenya",
  },
  {
    quote: "Working with Goldenware was a partnership, not just a contract. They trained our local teams and ensured knowledge transfer.",
    author: "Peter Ndegwa",
    role: "Community Leader",
    organization: "Kitui Rural Development",
  },
  {
    quote: "Their innovative approach to off-grid water solutions has changed lives in our remote communities.",
    author: "Mary Wambui",
    role: "Regional Coordinator",
    organization: "World Vision Kenya",
  },
  {
    quote: "Exceptional attention to detail and commitment to sustainability. A true partner in building Kenya's future.",
    author: "Engineer Joseph Ochieng",
    role: "Technical Director",
    organization: "Kenya Water Authority",
  },
];

// Partner logos - using text as placeholder since we don't have actual logos
const partners = [
  { name: "UN-Habitat", abbr: "UN" },
  { name: "World Vision", abbr: "WV" },
  { name: "Kenya Water Authority", abbr: "KWA" },
  { name: "Makueni County", abbr: "MC" },
  { name: "UNICEF Kenya", abbr: "UNI" },
  { name: "AfDB", abbr: "AfDB" },
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handleManualNavigation = (direction: 'prev' | 'next') => {
    setIsAutoPlaying(false);
    direction === 'prev' ? prevSlide() : nextSlide();
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="section-padding px-6 bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--gold)/0.03)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(var(--gold)/0.03)_0%,_transparent_50%)]" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader
          title="Trusted by"
          titleAccent="Partners"
          description="Hear from the counties, communities, and organizations we serve."
        />

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-10 hover:bg-gold/10 hover:text-gold"
            onClick={() => handleManualNavigation('prev')}
          >
            <ChevronLeft size={24} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-10 hover:bg-gold/10 hover:text-gold"
            onClick={() => handleManualNavigation('next')}
          >
            <ChevronRight size={24} />
          </Button>

          {/* Testimonial card */}
          <div className="relative min-h-[320px] md:min-h-[280px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="bg-card border border-border rounded-2xl p-8 md:p-12 relative card-shadow">
                  {/* Quote icon */}
                  <Quote className="absolute top-6 right-6 md:top-8 md:right-8 text-gold/10" size={64} />
                  
                  <p className="text-foreground/90 text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 relative z-10 font-sans italic">
                    "{testimonials[currentIndex].quote}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                      <span className="text-background font-bold text-lg font-sans">
                        {testimonials[currentIndex].author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-lg font-sans">{testimonials[currentIndex].author}</p>
                      <p className="text-sm text-muted-foreground font-sans">{testimonials[currentIndex].role}</p>
                      <p className="text-sm text-gold font-sans">{testimonials[currentIndex].organization}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                  setTimeout(() => setIsAutoPlaying(true), 10000);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-gold w-8' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Partner Logos */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-center text-muted-foreground text-sm font-sans mb-8 uppercase tracking-widest">
            Trusted by leading organizations
          </p>
          
          {/* Infinite scroll wrapper */}
          <div className="relative overflow-hidden">
            <motion.div 
              className="flex gap-8 md:gap-12"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear",
              }}
            >
              {/* Duplicate the logos for seamless infinite scroll */}
              {[...partners, ...partners].map((partner, i) => (
                <div
                  key={`${partner.name}-${i}`}
                  className="flex-shrink-0 flex items-center justify-center w-32 md:w-40 h-16 rounded-lg bg-card border border-border/50 hover:border-gold/30 transition-colors"
                >
                  <div className="text-center">
                    <span className="text-lg md:text-xl font-bold text-muted-foreground/60">
                      {partner.abbr}
                    </span>
                    <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">
                      {partner.name}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
