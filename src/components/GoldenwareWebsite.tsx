import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Droplet, Hammer, Shield, Globe } from "lucide-react";

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
  "Urban Housing & Water",
  "County Infrastructure", 
  "Off-Grid & Climate Zones"
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function GoldenwareWebsite() {
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative flex items-center justify-center text-center px-6 py-32 md:py-44 overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }} 
          className="max-w-4xl relative z-10"
        >
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-gradient-gold"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Goldenware
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
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
              className="glow-gold"
              onClick={() => track("cta_partner_click", { location: "hero" })}
            >
              Partner With Us
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-border hover:border-gold/50 hover:bg-gold/5"
              onClick={() => track("view_charter_click", { location: "hero" })}
            >
              View Our Charter
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* TRUST SIGNAL */}
      <section className="py-12 md:py-16 bg-secondary text-center border-y border-border">
        <motion.p 
          className="uppercase tracking-[0.2em] text-sm text-muted-foreground font-medium"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Since 2013 · Kenya · Infrastructure Stewardship
        </motion.p>
      </section>

      {/* VALUE PILLARS */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What We <span className="text-gradient-gold">Steward</span>
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {pillars.map((item, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="bg-card border-border h-full hover:border-gold/30 transition-colors duration-300 group">
                  <CardContent className="p-6 md:p-8">
                    <div className="mb-5 text-gold group-hover:scale-110 transition-transform duration-300 inline-block">
                      <item.icon size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-24 md:py-32 px-6 bg-gradient-to-b from-background via-secondary/30 to-background">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Our Mandate</h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            We treat materials as <span className="text-gold font-medium">trust</span>, water as{" "}
            <span className="text-gold font-medium">life</span>, and infrastructure as{" "}
            <span className="text-gold font-medium">destiny</span>.
            Goldenware exists to steward matter, skills, and systems so African communities
            can build resilient futures that endure.
          </p>
        </motion.div>
      </section>

      {/* USE CASES */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Where We Build
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {useCases.map((title, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="bg-card border-border h-full hover:border-gold/30 transition-all duration-300 group hover:-translate-y-1">
                  <CardContent className="p-8 md:p-10">
                    <div className="w-12 h-1 bg-gold mb-6 group-hover:w-20 transition-all duration-300" />
                    <h3 className="text-xl md:text-2xl font-semibold mb-4 text-foreground">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Integrated hardware, water systems, and fabrication tailored to local realities.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 md:py-40 bg-secondary text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Build With Foresight</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg md:text-xl">
            Whether you are a county, builder, investor, or community — partner with a steward,
            not just a supplier.
          </p>
          <Button 
            size="lg" 
            className="glow-gold text-lg px-8 py-6"
            onClick={() => track("cta_start_conversation", { location: "footer_cta" })}
          >
            Start a Conversation
          </Button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center border-t border-border">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Goldenware Enterprises Ltd · Kenya
        </p>
      </footer>
    </div>
  );
}
