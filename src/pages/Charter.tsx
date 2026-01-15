import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Target, Heart, Leaf, Users, Building, Droplet, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Heart,
    title: "Stewardship Over Ownership",
    description: "We don't just sell materials — we steward them. Every pipe, every tank, every brick carries the weight of a community's future."
  },
  {
    icon: Leaf,
    title: "Climate-First Design",
    description: "Every decision we make considers the climate realities of the next 50 years. Heat, water scarcity, extreme weather — we build for what's coming."
  },
  {
    icon: Users,
    title: "Local Skills, Global Standards",
    description: "We invest in Kenyan technicians, engineers, and craftspeople. World-class infrastructure built by the hands of those who will maintain it."
  },
  {
    icon: Building,
    title: "Distributed Manufacturing",
    description: "Rather than centralized production, we believe in county-level fabrication hubs that create jobs and reduce transport costs."
  },
  {
    icon: Droplet,
    title: "Water as Life",
    description: "Access to clean water is a human right. Every project we undertake considers water harvesting, sanitation, and long-term availability."
  },
  {
    icon: Shield,
    title: "Generational Resilience",
    description: "We build infrastructure that our grandchildren can rely on. Quality over speed, durability over cost-cutting."
  },
];

const commitments = [
  "100% of our steel and cement sourced from verified sustainable suppliers",
  "Training 1,000 local technicians by 2030",
  "Zero-waste fabrication processes across all county hubs",
  "Carbon-neutral operations by 2035",
  "50% of leadership positions held by women",
  "Transparent pricing with no hidden costs for county governments",
];

export default function CharterPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gradient-gold tracking-tight hover:opacity-80 transition-opacity">
            Goldenware
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft size={16} />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 text-gold mb-6">
            <Target size={24} />
            <span className="uppercase tracking-widest text-sm font-medium">Our Charter</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The Principles That <span className="text-gradient-gold">Guide Us</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Goldenware exists to steward Africa's infrastructure future. These are the non-negotiable 
            commitments that shape every decision we make.
          </p>
        </motion.div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-6 bg-secondary/30">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed">
            To transform how Africa builds — shifting from extractive supply chains to 
            <span className="text-gold font-semibold"> regenerative stewardship</span>, where materials serve communities, 
            water sustains life, and infrastructure endures for generations.
          </p>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Core Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-8 hover:border-gold/30 transition-colors duration-300"
              >
                <div className="text-gold mb-4">
                  <value.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Commitments */}
      <section className="py-24 px-6 bg-gradient-to-b from-background via-secondary/30 to-background">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sustainability <span className="text-gradient-gold">Commitments</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Measurable goals we hold ourselves accountable to.
            </p>
          </motion.div>
          <div className="space-y-4">
            {commitments.map((commitment, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 bg-card border border-border rounded-lg p-6 hover:border-gold/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold font-bold text-sm">{i + 1}</span>
                </div>
                <p className="text-foreground text-lg">{commitment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
            Partner with us to build infrastructure that serves communities for generations.
          </p>
          <Link to="/">
            <Button size="lg" className="glow-gold">
              Partner With Us
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-border">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Goldenware Enterprises Ltd · Kenya
        </p>
      </footer>
    </div>
  );
}
