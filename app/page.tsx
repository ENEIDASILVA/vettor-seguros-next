import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import StatsBar from "../components/home/StatsBar";
import Services from "../components/home/Services";
import Partners from "../components/home/Partners";
import QuoteWizard from "../components/quote/QuoteWizard";
import Footer from "../components/layout/Footer";
import FloatingWhatsApp from "../components/layout/FloatingWhatsApp";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <StatsBar />
      <Services />
      <Partners />
      <QuoteWizard />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}