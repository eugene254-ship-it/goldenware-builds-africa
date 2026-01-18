import { Variants, Transition } from "framer-motion";

// Fade in from bottom
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

// Fade in from left
export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

// Fade in from right
export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

// Scale in
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

// Scale in with spring
export const scaleInSpring: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
};

// Blur fade in
export const blurFadeIn: Variants = {
  initial: { opacity: 0, filter: "blur(10px)" },
  animate: { 
    opacity: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

// Slide up with fade
export const slideUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  },
};

// Slide down with fade
export const slideDown: Variants = {
  initial: { opacity: 0, y: -40 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

// Rotate in
export const rotateIn: Variants = {
  initial: { opacity: 0, rotate: -10, scale: 0.95 },
  animate: { 
    opacity: 1, 
    rotate: 0, 
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

// Stagger container for children
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger with longer delay
export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Fast stagger
export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// Draw line animation for SVG paths
export const drawLine: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { 
    pathLength: 1, 
    opacity: 1,
    transition: { duration: 1.5, ease: "easeInOut" }
  },
};

// Counter animation (for numbers)
export const countUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

// Parallax effect
export const parallax = (offset: number = 50): Variants => ({
  initial: { y: offset },
  animate: { 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  },
});

// Hover animations for cards
export const cardHover: Variants = {
  initial: { y: 0 },
  hover: { 
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" }
  },
};

// Pulse animation
export const pulse: Variants = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  },
};

// Float animation
export const float: Variants = {
  initial: { y: 0 },
  animate: { 
    y: [-10, 10, -10],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  },
};

// Glow pulse
export const glowPulse: Variants = {
  initial: { opacity: 0.5 },
  animate: { 
    opacity: [0.5, 1, 0.5],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  },
};

// Text reveal character by character
export const textRevealContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.02,
    },
  },
};

export const textRevealChar: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
};

// Image reveal
export const imageReveal: Variants = {
  initial: { clipPath: "inset(0 100% 0 0)" },
  animate: { 
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  },
};

// Common transition presets
export const transitions = {
  default: { duration: 0.6, ease: "easeOut" } as Transition,
  fast: { duration: 0.3, ease: "easeOut" } as Transition,
  slow: { duration: 0.8, ease: "easeOut" } as Transition,
  spring: { type: "spring", stiffness: 300, damping: 30 } as Transition,
  springBouncy: { type: "spring", stiffness: 400, damping: 20 } as Transition,
  springSmooth: { type: "spring", stiffness: 200, damping: 25 } as Transition,
  anticipate: { duration: 0.6, ease: [0.38, 0, 0.24, 1] } as Transition,
};

// Viewport settings for animations
export const viewportOnce = { once: true, margin: "-100px" };
export const viewportAlways = { once: false, margin: "-100px" };
export const viewportEager = { once: true, margin: "-50px" };

// Scroll-triggered animations helper
export const scrollTrigger = {
  fadeInUp: {
    variants: fadeInUp,
    initial: "initial",
    whileInView: "animate",
    viewport: viewportOnce,
  },
  fadeInLeft: {
    variants: fadeInLeft,
    initial: "initial",
    whileInView: "animate",
    viewport: viewportOnce,
  },
  fadeInRight: {
    variants: fadeInRight,
    initial: "initial",
    whileInView: "animate",
    viewport: viewportOnce,
  },
  scaleIn: {
    variants: scaleIn,
    initial: "initial",
    whileInView: "animate",
    viewport: viewportOnce,
  },
  slideUp: {
    variants: slideUp,
    initial: "initial",
    whileInView: "animate",
    viewport: viewportOnce,
  },
};
