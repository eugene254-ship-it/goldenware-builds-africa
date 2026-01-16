import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  onContactClick: () => void;
}

const navLinks = [
  { label: "About", href: "#about", isSection: true },
  { label: "Services", href: "#services", isSection: true },
  { label: "Projects", href: "#projects", isSection: true },
  { label: "Charter", href: "/charter", isSection: false },
  { label: "Pricing", href: "/pricing", isSection: false },
  { label: "Blog", href: "/blog", isSection: false },
];

export default function Header({ onContactClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string, isSection: boolean) => {
    if (isSection) {
      if (!isHomePage) {
        // Navigate to home first, then scroll
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
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.isSection ? (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href, link.isSection)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            )
          ))}
          <Button size="sm" onClick={onContactClick} className="glow-gold">
            Partner With Us
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-foreground p-2"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-card border-t border-border"
        >
          <nav className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              link.isSection ? (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href, link.isSection)}
                  className="text-foreground hover:text-gold transition-colors text-left py-2 text-lg font-medium"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground hover:text-gold transition-colors text-left py-2 text-lg font-medium"
                >
                  {link.label}
                </Link>
              )
            ))}
            <Button onClick={onContactClick} className="glow-gold mt-2">
              Partner With Us
            </Button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
