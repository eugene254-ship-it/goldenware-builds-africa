import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeader from "@/components/layout/SectionHeader";

const faqs = [
  {
    question: "What areas of Kenya does Goldenware serve?",
    answer: "We operate across Kenya, with strong presence in Makueni, Kitui, Machakos, Nairobi, and the coastal regions. Our distributed model allows us to serve both urban and rural communities effectively."
  },
  {
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on scope. Small installations may take 2-4 weeks, while county-level infrastructure projects typically span 3-12 months. We provide detailed timelines during our initial consultation."
  },
  {
    question: "Do you offer maintenance and support after installation?",
    answer: "Yes, all our projects include a maintenance period. We offer ongoing support packages and train local technicians to ensure long-term sustainability of the infrastructure we build."
  },
  {
    question: "How do you ensure water quality in your systems?",
    answer: "We implement multi-stage filtration, regular testing protocols, and work with certified laboratories. Our systems meet WHO standards and Kenya Bureau of Standards requirements."
  },
  {
    question: "Can you work with existing infrastructure?",
    answer: "Absolutely. We often upgrade, repair, or integrate with existing systems. Our team conducts thorough assessments to determine the best approach for each unique situation."
  },
  {
    question: "What financing options are available for counties?",
    answer: "We offer flexible partnership models including phased implementation, revenue-sharing arrangements, and connections to development finance institutions. Contact us to discuss options that fit your budget."
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="section-padding px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Frequently Asked"
          titleAccent="Questions"
          description="Common questions about our services, process, and partnerships."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="bg-card border border-border rounded-lg px-6 data-[state=open]:border-gold/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-gold font-semibold py-5 font-sans">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 font-sans leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
