import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  titleAccent?: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export default function SectionHeader({ 
  title, 
  titleAccent, 
  description, 
  className = "",
  children 
}: SectionHeaderProps) {
  return (
    <motion.div
      className={`text-center mb-16 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        {title} {titleAccent && <span className="text-gradient-gold">{titleAccent}</span>}
      </h2>
      {description && (
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-sans">
          {description}
        </p>
      )}
      {children}
    </motion.div>
  );
}
