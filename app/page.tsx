import Hero from "../components/home/Hero";
import StatsBar from "../components/home/StatsBar";
import Services from "../components/home/Services";
import Benefits from "../components/home/Benefits";
import HowItWorks from "../components/home/HowItWorks";
import Partners from "../components/home/Partners";
import Testimonials from "../components/home/Testimonials";
import QuoteWizard from "../components/quote/QuoteWizard";
import CTA from "../components/home/CTA";
import Footer from "../components/layout/Footer";
import FloatingWhatsApp from "../components/layout/FloatingWhatsApp";


export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <Services />
      <Benefits />
      <HowItWorks />
      <Partners />
      <Testimonials />
      <QuoteWizard />
      <CTA />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}