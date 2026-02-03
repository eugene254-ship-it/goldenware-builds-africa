import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Droplet, Hammer, Shield, Globe, ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ContactModal from "@/components/ContactModal";
import ProjectsGallery from "@/components/ProjectsGallery";
import TeamSection from "@/components/TeamSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import StatsSection from "@/components/StatsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/layout/SectionHeader";
import heroImage from "@/assets/hero-infrastructure.jpg";
import { 
  fadeInUp, 
  fadeInLeft, 
  fadeInRight, 
  staggerContainer, 
  staggerContainerSlow,
  scaleIn,
  slideUp,
  viewportOnce 
} from "@/lib/animations";

const pillars = [
  {
    icon: Hammer,
    title: "Material Stewardship",
    text: "Climate-fit materials, fabrication, and resilient construction systems."
  },
  {
    icon: Droplet,
    title: "Water Infrastructure",
    text: "Plumbing, sanitation, harvesting, and life-support systems."
  },
  {
    icon: Shield,
    title: "Long-Term Resilience",
    text: "Built for stress, longevity, and future climate realities."
  },
  {
    icon: Globe,
    title: "Local Sovereignty",
    text: "Local manufacturing, skills, and distributed production."
  }
];

const useCases = [
  {
    title: "Urban Housing & Water",
    description: "Modern plumbing, water harvesting, and sustainable materials for urban developments.",
    features: ["Smart water metering", "Rainwater harvesting", "Greywater recycling"]
  },
  {
    title: "County Infrastructure", 
    description: "Large-scale water and sanitation systems for county governments and institutions.",
    features: ["Public water systems", "School sanitation", "Healthcare facilities"]
  },
  {
    title: "Off-Grid & Climate Zones",
    description: "Resilient solutions for remote communities and challenging environments.",
    features: ["Solar-powered pumps", "Drought-resistant storage", "Mobile solutions"]
  }
];

export default function GoldenwareWebsite() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const track = (event: string, props: Record<string, string> = {}) => {
    if (typeof window !== "undefined") {
      const w = window as typeof window & { plausible?: (event: string, options: { props: Record<string, string> }) => void; gtag?: (command: string, event: string, props: Record<string, string>) => void };
      if (w.plausible) {
        w.plausible(event, { props });
      }
      if (w.gtag) {
        w.gtag("event", event, props);
      }
    }
  };

  const handleContactClick = () => {
    setIsContactOpen(true);
    track("contact_modal_open");
  };

  // Parallax scroll effect for hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header onContactClick={handleContactClick} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* HERO */}
      <section className="relative flex items-center justify-center text-center px-6 pt-32 pb-32 md:pt-44 md:pb-44 overflow-hidden min-h-screen">
        {/* Parallax Hero background image */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            y: heroY,
          }}
        />
        {/* Dark overlay with gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" 
          style={{ opacity: heroOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        {/* Radial gold accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--gold)/0.05)_0%,_transparent_70%)]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }} 
          className="max-w-4xl relative z-10"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-gold/10 border border-gold/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-gold text-sm font-medium font-sans tracking-wide">Since 2013 · Nairobi, Kenya</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-gradient-gold"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Goldenware
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-foreground/80 mb-10 max-w-2xl mx-auto font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            A steward of how Africa is built next.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button 
              size="lg" 
              className="glow-gold text-base px-8 group"
              onClick={() => {
                handleContactClick();
                track("cta_partner_click", { location: "hero" });
              }}
            >
              Partner With Us
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-border hover:border-gold/50 hover:bg-gold/5 bg-background/50 backdrop-blur-sm text-base group"
              onClick={() => {
                window.location.href = '/charter';
                track("view_charter_click", { location: "hero" });
              }}
            >
              <Play size={16} className="mr-2" />
              View Our Charter
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div 
            className="w-6 h-10 rounded-full border-2 border-foreground/20 flex justify-center pt-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <StatsSection />

      {/* ABOUT / VALUE PILLARS */}
      <section id="about" className="section-padding px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="What We"
            titleAccent="Steward"
            description="Four pillars guide everything we build — from material selection to community impact."
          />
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainerSlow}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
          >
            {pillars.map((item, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="bg-card border-border h-full hover:border-gold/30 transition-all duration-300 group card-shadow hover:card-shadow-hover hover:-translate-y-2">
                  <CardContent className="p-6 md:p-8">
                    <motion.div 
                      className="mb-5 text-gold inline-block"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <item.icon size={36} strokeWidth={1.5} />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-sans">{item.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="section-padding px-6 bg-gradient-to-b from-background via-secondary/30 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--gold)/0.03)_0%,_transparent_50%)]" />
        <motion.div 
          className="max-w-3xl mx-auto text-center relative z-10"
          variants={slideUp}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-8"
            variants={scaleIn}
          >
            Our Mandate
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg md:text-xl leading-relaxed font-sans"
            variants={fadeInUp}
          >
            We treat materials as <span className="text-gold font-medium">trust</span>, water as{" "}
            <span className="text-gold font-medium">life</span>, and infrastructure as{" "}
            <span className="text-gold font-medium">destiny</span>.
            Goldenware exists to steward matter, skills, and systems so African communities
            can build resilient futures that endure.
          </motion.p>
          <motion.div 
            className="mt-10 flex justify-center gap-4 flex-wrap"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
          >
            {["ISO 9001 Certified", "NCA Class 4", "KEBS Approved"].map((badge, i) => (
              <motion.div
                key={badge}
                variants={scaleIn}
                className="px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium font-sans"
                whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--gold) / 0.2)" }}
              >
                {badge}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* SERVICES / USE CASES */}
      <section id="services" className="section-padding px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Where We"
            titleAccent="Build"
            description="Integrated hardware, water systems, and fabrication tailored to local realities."
          />
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainerSlow}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
          >
            {useCases.map((useCase, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Link to="/services">
                  <Card className="bg-card border-border h-full hover:border-gold/30 transition-all duration-300 group hover:-translate-y-2 card-shadow hover:card-shadow-hover cursor-pointer">
                    <CardContent className="p-8 md:p-10">
                      <motion.div 
                        className="w-12 h-1 bg-gold mb-6"
                        whileHover={{ width: 80 }}
                        transition={{ duration: 0.3 }}
                      />
                      <h3 className="text-xl md:text-2xl font-semibold mb-4 text-foreground group-hover:text-gold transition-colors">{useCase.title}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6 font-sans">
                        {useCase.description}
                      </p>
                      <ul className="space-y-2">
                        {useCase.features.map((feature, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 flex items-center text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Learn more <ArrowRight size={14} className="ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROJECTS GALLERY */}
      <ProjectsGallery />

      {/* TEAM SECTION */}
      <div id="team">
        <TeamSection />
      </div>

      {/* TESTIMONIALS CAROUSEL */}
      <div id="testimonials">
        <TestimonialsCarousel />
      </div>

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <section id="contact" className="py-32 md:py-40 bg-secondary text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(var(--gold)/0.08)_0%,_transparent_60%)]" />
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            variants={slideUp}
          >
            Build With Foresight
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mb-10 text-lg md:text-xl leading-relaxed font-sans"
            variants={fadeInUp}
          >
            Whether you are a county, builder, investor, or community — partner with a steward,
            not just a supplier.
          </motion.p>
          <motion.div variants={scaleIn}>
            <Button 
              size="lg" 
              className="glow-gold text-lg px-10 py-6 group"
              onClick={() => {
                handleContactClick();
                track("cta_start_conversation", { location: "footer_cta" });
              }}
            >
              Start a Conversation
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
