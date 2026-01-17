import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Droplet, Home, Users, Calendar } from "lucide-react";

const stats = [
  { 
    icon: Calendar, 
    value: 10, 
    suffix: "+", 
    label: "Years of Experience",
    description: "Serving Kenya since 2013"
  },
  { 
    icon: Home, 
    value: 500, 
    suffix: "+", 
    label: "Projects Completed",
    description: "Across 15+ counties"
  },
  { 
    icon: Users, 
    value: 50000, 
    suffix: "+", 
    label: "Lives Impacted",
    description: "Communities transformed"
  },
  { 
    icon: Droplet, 
    value: 1, 
    suffix: "M+", 
    label: "Liters of Water",
    description: "Delivered annually"
  },
];

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = value / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [value, inView]);
  
  return (
    <span className="text-gradient-gold">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <section ref={ref} className="section-padding px-6 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 text-gold mb-4 group-hover:bg-gold/20 transition-colors">
                <stat.icon size={28} strokeWidth={1.5} />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <h3 className="text-foreground font-semibold mb-1 font-sans">{stat.label}</h3>
              <p className="text-muted-foreground text-sm font-sans">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
