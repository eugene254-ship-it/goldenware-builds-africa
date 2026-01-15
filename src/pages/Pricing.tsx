import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Building, Users, Droplet, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const pricingTiers = [
  {
    name: "Community",
    description: "For small communities and local initiatives",
    icon: Users,
    price: "Custom",
    unit: "project-based",
    features: [
      "Water tank installation (up to 10,000L)",
      "Basic plumbing systems",
      "Local technician training",
      "1-year maintenance support",
      "Community consultation",
    ],
    cta: "Get a Quote",
    popular: false,
  },
  {
    name: "County",
    description: "For county governments and public works",
    icon: Building,
    price: "Partnership",
    unit: "multi-year contracts",
    features: [
      "Full infrastructure assessment",
      "Water distribution networks",
      "Material supply agreements",
      "Fabrication hub development",
      "Technician training programs",
      "Quarterly reporting",
      "Dedicated project manager",
    ],
    cta: "Schedule Consultation",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For developers and large-scale projects",
    icon: Wrench,
    price: "Volume",
    unit: "discounted rates",
    features: [
      "Bulk material procurement",
      "Custom fabrication services",
      "Multi-site project management",
      "Priority supply chain access",
      "Quality assurance team",
      "Extended warranties",
      "Dedicated account team",
    ],
    cta: "Contact Sales",
    popular: false,
  },
  {
    name: "Water Systems",
    description: "Specialized water infrastructure",
    icon: Droplet,
    price: "Modular",
    unit: "per installation",
    features: [
      "Rainwater harvesting systems",
      "Solar-powered pumping",
      "Sanitation infrastructure",
      "Water quality monitoring",
      "Maintenance training",
      "Spare parts inventory",
    ],
    cta: "Explore Solutions",
    popular: false,
  },
];

const faqItems = [
  {
    question: "How does pricing work for county projects?",
    answer: "County projects are priced based on scope, duration, and local conditions. We work with county governments to develop multi-year partnerships that align with budget cycles and development plans."
  },
  {
    question: "Do you offer financing options?",
    answer: "Yes, we work with development finance institutions and offer flexible payment terms for qualifying projects. We can also help counties access infrastructure grants and loans."
  },
  {
    question: "What's included in maintenance support?",
    answer: "All installations include training for local technicians, a spare parts inventory, and scheduled maintenance visits. Extended support plans are available for mission-critical infrastructure."
  },
  {
    question: "Can you work with existing contractors?",
    answer: "Absolutely. We often partner with local contractors to provide materials, technical expertise, and quality assurance while they handle labor and installation."
  },
];

export default function PricingPage() {
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Partnership <span className="text-gradient-gold">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Flexible engagement models designed for communities, counties, and enterprises. 
            No hidden costs — just transparent stewardship.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`h-full bg-card border-border hover:border-gold/30 transition-colors duration-300 relative ${tier.popular ? 'border-gold' : ''}`}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="text-gold mb-4">
                      <tier.icon size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold">{tier.name}</h3>
                    <p className="text-muted-foreground text-sm">{tier.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <span className="text-3xl font-bold text-gradient-gold">{tier.price}</span>
                      <span className="text-muted-foreground text-sm ml-2">{tier.unit}</span>
                    </div>
                    <ul className="space-y-3">
                      {tier.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm">
                          <Check className="text-gold flex-shrink-0 mt-0.5" size={16} />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${tier.popular ? 'glow-gold' : ''}`} 
                      variant={tier.popular ? 'default' : 'outline'}
                    >
                      {tier.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why <span className="text-gradient-gold">Partner</span> With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-5xl font-bold text-gold mb-2">12+</div>
                <p className="text-muted-foreground">Counties Served</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gold mb-2">500K+</div>
                <p className="text-muted-foreground">People with Clean Water</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gold mb-2">10+</div>
                <p className="text-muted-foreground">Years of Experience</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-6">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold mb-3">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-secondary/30 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Together?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
            Let's discuss your infrastructure needs and create a partnership that works for your community.
          </p>
          <Link to="/">
            <Button size="lg" className="glow-gold">
              Start a Conversation
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
