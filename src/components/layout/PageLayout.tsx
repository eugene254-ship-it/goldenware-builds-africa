import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

interface PageLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
}

export default function PageLayout({ 
  children, 
  showBackButton = true,
  backButtonText = "Back to Home",
  backButtonHref = "/"
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold text-gradient-gold tracking-tight hover:opacity-80 transition-opacity"
          >
            Goldenware
          </Link>
          {showBackButton && (
            <Link to={backButtonHref}>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft size={16} />
                {backButtonText}
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Page hero component for consistent styling
interface PageHeroProps {
  icon?: ReactNode;
  label?: string;
  title: string;
  titleAccent?: string;
  description: string;
}

export function PageHero({ icon, label, title, titleAccent, description }: PageHeroProps) {
  return (
    <section className="pt-12 pb-20 px-6">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {(icon || label) && (
          <div className="inline-flex items-center gap-2 text-gold mb-6">
            {icon}
            {label && <span className="uppercase tracking-widest text-sm font-medium font-sans">{label}</span>}
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {title} {titleAccent && <span className="text-gradient-gold">{titleAccent}</span>}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans">
          {description}
        </p>
      </motion.div>
    </section>
  );
}
