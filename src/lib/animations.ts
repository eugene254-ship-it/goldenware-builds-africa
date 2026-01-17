import { Variants } from "framer-motion";

// Fade in from bottom
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

// Fade in from left
export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
};

// Fade in from right
export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
};

// Scale in
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
};

// Stagger container for children
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Stagger with longer delay
export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Common transition presets
export const transitions = {
  default: { duration: 0.6, ease: "easeOut" },
  fast: { duration: 0.3, ease: "easeOut" },
  slow: { duration: 0.8, ease: "easeOut" },
  spring: { type: "spring", stiffness: 300, damping: 30 },
};

// Viewport settings for animations
export const viewportOnce = { once: true, margin: "-50px" };
export const viewportAlways = { once: false, margin: "-50px" };
