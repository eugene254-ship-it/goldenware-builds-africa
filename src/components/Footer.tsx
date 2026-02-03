import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const footerLinks = {
  company: [
    { label: "About Us", href: "/#about" },
    { label: "Our Charter", href: "/charter" },
    { label: "Team", href: "/#team" },
    { label: "Blog", href: "/blog" },
  ],
  services: [
    { label: "Water Infrastructure", href: "/services#water-infrastructure" },
    { label: "Material Stewardship", href: "/services#material-stewardship" },
    { label: "Off-Grid Solutions", href: "/services#off-grid-solutions" },
    { label: "All Services", href: "/services" },
  ],
  resources: [
    { label: "Projects", href: "/projects" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
];

const contactInfo = [
  { icon: Mail, text: "info@goldenware.co.ke", href: "mailto:info@goldenware.co.ke" },
  { icon: Phone, text: "+254 700 000 000", href: "tel:+254700000000" },
  { icon: MapPin, text: "Nairobi, Kenya", href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("subscribe", {
        body: { email: email.trim() },
      });

      if (error) throw error;

      setIsSubscribed(true);
      setEmail("");
      toast.success(data?.message || "Successfully subscribed!");
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast.error(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Stay <span className="text-gradient-gold">Updated</span>
              </h3>
              <p className="text-muted-foreground font-sans max-w-md">
                Subscribe to our newsletter for the latest project updates, industry insights, and infrastructure news from Kenya.
              </p>
            </div>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isSubscribed}
                  className="pl-10 h-12 bg-background border-border focus:border-gold"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || isSubscribed}
                className="h-12 px-6 glow-gold group"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : isSubscribed ? (
                  <>
                    <CheckCircle size={18} className="mr-2" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    Subscribe
                    <Send size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-bold text-gradient-gold tracking-tight">
              Goldenware
            </Link>
            <p className="text-muted-foreground mt-4 max-w-sm font-sans leading-relaxed">
              A steward of how Africa is built next. We treat materials as trust, 
              water as life, and infrastructure as destiny.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-gold hover:text-background transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 font-sans">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-gold transition-colors font-sans text-sm link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 font-sans">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-gold transition-colors font-sans text-sm link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 font-sans">Contact</h4>
            <ul className="space-y-3">
              {contactInfo.map((item) => (
                <li key={item.text}>
                  <a 
                    href={item.href}
                    className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors font-sans text-sm"
                  >
                    <item.icon size={14} className="text-gold" />
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm font-sans">
            © {new Date().getFullYear()} Goldenware Enterprises Ltd · Kenya
          </p>
          <div className="flex gap-6 text-sm font-sans">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
