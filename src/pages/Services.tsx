import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Droplet, 
  Hammer, 
  Building2, 
  Sun, 
  Wrench, 
  Users,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import SectionHeader from "@/components/layout/SectionHeader";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/animations";

const services = [
  {
    id: "water-infrastructure",
    icon: Droplet,
    title: "Water Infrastructure",
    shortDesc: "Complete water systems from source to tap",
    description: "End-to-end water solutions including borehole drilling, water harvesting, treatment systems, and distribution networks designed for Kenya's diverse environments.",
    features: [
      "Borehole drilling & rehabilitation",
      "Rainwater harvesting systems",
      "Water treatment & purification",
      "Distribution network design",
      "Solar-powered pumping",
      "Smart metering solutions"
    ],
    benefits: [
      { icon: Zap, text: "40% energy cost reduction" },
      { icon: Shield, text: "20-year system lifespan" },
      { icon: Clock, text: "24/7 monitoring capability" }
    ],
    idealFor: ["Counties", "Institutions", "Communities", "Developers"]
  },
  {
    id: "material-stewardship",
    icon: Hammer,
    title: "Material Stewardship",
    shortDesc: "Climate-fit construction materials",
    description: "Sourcing, fabrication, and installation of durable, climate-appropriate building materials that reduce costs and environmental impact while maximizing longevity.",
    features: [
      "Climate-resilient materials",
      "Local material sourcing",
      "Custom fabrication",
      "Quality certification",
      "Sustainable alternatives",
      "Material lifecycle planning"
    ],
    benefits: [
      { icon: Award, text: "KEBS certified materials" },
      { icon: Shield, text: "60% carbon reduction" },
      { icon: Clock, text: "Extended warranties" }
    ],
    idealFor: ["Contractors", "Developers", "NGOs", "Government"]
  },
  {
    id: "urban-housing",
    icon: Building2,
    title: "Urban Housing Solutions",
    shortDesc: "Modern plumbing & water systems for developments",
    description: "Comprehensive plumbing and water management solutions for residential and commercial developments, from affordable housing to premium properties.",
    features: [
      "Complete plumbing systems",
      "Greywater recycling",
      "Hot water solutions",
      "Waste management",
      "Fire suppression systems",
      "Green building integration"
    ],
    benefits: [
      { icon: Zap, text: "40% water savings" },
      { icon: Shield, text: "Code compliant" },
      { icon: Clock, text: "Rapid installation" }
    ],
    idealFor: ["Property developers", "Housing cooperatives", "Real estate"]
  },
  {
    id: "off-grid-solutions",
    icon: Sun,
    title: "Off-Grid & Climate Zones",
    shortDesc: "Resilient solutions for remote areas",
    description: "Specialized infrastructure solutions for remote communities and challenging environments where conventional systems aren't feasible.",
    features: [
      "Solar-powered systems",
      "Mobile water units",
      "Drought-resistant storage",
      "Pastoralist solutions",
      "Emergency response kits",
      "Satellite monitoring"
    ],
    benefits: [
      { icon: Zap, text: "100% renewable energy" },
      { icon: Shield, text: "Extreme climate rated" },
      { icon: Clock, text: "Remote diagnostics" }
    ],
    idealFor: ["NGOs", "County governments", "Humanitarian orgs"]
  },
  {
    id: "maintenance",
    icon: Wrench,
    title: "Maintenance & Support",
    shortDesc: "Ongoing care for lasting performance",
    description: "Comprehensive maintenance programs and technical support to ensure your infrastructure continues performing optimally throughout its lifecycle.",
    features: [
      "Preventive maintenance",
      "Emergency repairs",
      "System upgrades",
      "Performance audits",
      "Training programs",
      "Spare parts supply"
    ],
    benefits: [
      { icon: Zap, text: "99.5% uptime guarantee" },
      { icon: Shield, text: "Certified technicians" },
      { icon: Clock, text: "4-hour response time" }
    ],
    idealFor: ["All existing clients", "Institutions", "Counties"]
  },
  {
    id: "consulting",
    icon: Users,
    title: "Consulting & Training",
    shortDesc: "Knowledge transfer & capacity building",
    description: "Expert consulting services and comprehensive training programs to build local capacity and ensure sustainable management of water and infrastructure systems.",
    features: [
      "Feasibility studies",
      "Technical design",
      "Operator training",
      "Community engagement",
      "Regulatory compliance",
      "Grant writing support"
    ],
    benefits: [
      { icon: Award, text: "50+ projects consulted" },
      { icon: Shield, text: "ISO certified processes" },
      { icon: Clock, text: "Flexible engagement" }
    ],
    idealFor: ["Counties", "NGOs", "Donors", "Communities"]
  }
];

const pricingTiers = [
  {
    name: "Community",
    description: "For small communities and institutions",
    priceRange: "KES 500K - 2M",
    features: [
      "Up to 500 beneficiaries",
      "Basic water system",
      "1-year maintenance",
      "Community training",
      "Standard materials"
    ],
    popular: false
  },
  {
    name: "County",
    description: "For county governments and large institutions",
    priceRange: "KES 5M - 50M",
    features: [
      "5,000+ beneficiaries",
      "Multi-point systems",
      "3-year maintenance",
      "Comprehensive training",
      "Premium materials",
      "Smart monitoring",
      "Dedicated support"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    description: "For large-scale developments and partnerships",
    priceRange: "Custom",
    features: [
      "Unlimited scale",
      "Full-service delivery",
      "5-year partnership",
      "Technology transfer",
      "Co-branded solutions",
      "Priority response",
      "Strategic consulting"
    ],
    popular: false
  }
];

export default function Services() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onContactClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6 text-gold border-gold/30 bg-gold/5">
              Our Services
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Infrastructure That <span className="text-gradient-gold">Endures</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
              From water systems to construction materials, we deliver integrated solutions 
              designed for Kenya's unique challenges and opportunities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
          >
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                variants={fadeInUp}
                className="group"
              >
                <Card className="h-full bg-card border-border hover:border-gold/30 transition-all duration-300 card-shadow hover:card-shadow-hover overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                      <service.icon size={28} className="text-gold" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <p className="text-muted-foreground font-sans text-sm">
                      {service.shortDesc}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2">
                      {service.features.slice(0, 4).map((feature, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 size={14} className="text-gold flex-shrink-0" />
                          <span className="text-muted-foreground font-sans">{feature}</span>
                        </div>
                      ))}
                      {service.features.length > 4 && (
                        <p className="text-sm text-gold font-sans">
                          +{service.features.length - 4} more features
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground font-sans mb-2">Ideal for:</p>
                      <div className="flex flex-wrap gap-1">
                        {service.idealFor.map((item, j) => (
                          <Badge key={j} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="px-6 py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Partnership"
            titleAccent="Tiers"
            description="Flexible engagement models designed to match your scale and needs."
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
          >
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                variants={fadeInUp}
                className={tier.popular ? "md:-mt-4 md:mb-4" : ""}
              >
                <Card className={`h-full bg-card border-border relative overflow-hidden ${
                  tier.popular ? "border-gold/50 shadow-lg shadow-gold/10" : ""
                }`}>
                  {tier.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gold text-background text-center py-2 text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className={tier.popular ? "pt-12" : ""}>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <p className="text-muted-foreground font-sans text-sm">{tier.description}</p>
                    <div className="pt-4">
                      <span className="text-3xl font-bold text-gold">{tier.priceRange}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {tier.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-gold flex-shrink-0" />
                          <span className="text-foreground font-sans text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full mt-6 ${tier.popular ? "bg-gold text-background hover:bg-gold/90" : ""}`}
                      variant={tier.popular ? "default" : "outline"}
                      onClick={() => setIsContactOpen(true)}
                    >
                      Get Started
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            title="Our"
            titleAccent="Process"
            description="A proven methodology refined over a decade of delivering infrastructure across Kenya."
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
          >
            {[
              { step: "01", title: "Discovery", desc: "Site assessment, community consultation, and feasibility analysis" },
              { step: "02", title: "Design", desc: "Technical design, material selection, and cost planning" },
              { step: "03", title: "Delivery", desc: "Construction, installation, and quality assurance" },
              { step: "04", title: "Sustain", desc: "Training, maintenance, and long-term support" }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center md:text-left">
                <div className="text-5xl font-bold text-gold/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground font-sans text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Build Something That Lasts?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 font-sans">
              Let's discuss your infrastructure needs and find the right solution for your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="glow-gold" onClick={() => setIsContactOpen(true)}>
                Start a Conversation
                <ArrowRight className="ml-2" size={18} />
              </Button>
              <Link to="/projects">
                <Button size="lg" variant="outline">
                  View Our Projects
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
