import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onContactClick: () => void;
}

const navLinks = [
  { label: "About", href: "#about", isSection: true },
  { label: "Services", href: "/services", isSection: false },
  { label: "Projects", href: "/projects", isSection: false },
  { label: "Charter", href: "/charter", isSection: false },
  { label: "Pricing", href: "/pricing", isSection: false },
  { label: "Blog", href: "/blog", isSection: false },
];

export default function Header({ onContactClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Track active section for highlighting
      if (isHomePage) {
        const sections = ["about", "services", "projects", "team", "testimonials", "faq", "contact"];
        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
              setActiveSection(`#${section}`);
              break;
            }
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const handleNavClick = (href: string, isSection: boolean) => {
    if (isSection) {
      if (!isHomePage) {
        window.location.href = `/${href}`;
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-gradient-gold tracking-tight hover:opacity-80 transition-opacity"
        >
          Goldenware
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = isHomePage && activeSection === link.href;
            
            return link.isSection ? (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href, link.isSection)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-sans ${
                  isActive 
                    ? "text-gold bg-gold/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-sans ${
                  location.pathname === link.href
                    ? "text-gold bg-gold/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {user && (
            <Link
              to="/dashboard"
              className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 font-sans flex items-center gap-1.5"
            >
              <User size={14} />
              Dashboard
            </Link>
          )}
          <ThemeToggle />
          <Button size="sm" onClick={onContactClick} className="glow-gold ml-2">
            Partner With Us
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-foreground p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-card border-t border-border overflow-hidden"
          >
            <nav className="flex flex-col p-6 gap-2">
              {navLinks.map((link) => (
                link.isSection ? (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href, link.isSection)}
                    className="text-foreground hover:text-gold hover:bg-muted/50 transition-colors text-left py-3 px-4 rounded-lg text-lg font-medium font-sans"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-foreground hover:text-gold hover:bg-muted/50 transition-colors text-left py-3 px-4 rounded-lg text-lg font-medium font-sans"
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <Button onClick={onContactClick} className="glow-gold mt-4">
                Partner With Us
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
