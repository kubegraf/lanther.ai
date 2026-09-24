import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./sections/Hero";
import { Problem } from "./sections/Problem";
import { Capabilities } from "./sections/Capabilities";
import { HowItWorks } from "./sections/HowItWorks";
import { AIOperator } from "./sections/AIOperator";
import { Kubernetes } from "./sections/Kubernetes";
import { Architecture } from "./sections/Architecture";
import { Developers } from "./sections/Developers";
import { UseCases } from "./sections/UseCases";
import { Ecosystem } from "./sections/Ecosystem";
import { FinalCTA, PricingCTA } from "./sections/CallToAction";

export default function App() {
  return (
    // `strict` makes any stray `motion.*` import throw, so the lighter `m.*`
    // plus domAnimation stays the only way animation code gets bundled.
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-ink px-3 py-2 text-sm font-medium text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">
          <Hero />
          <Problem />
          <Capabilities />
          <HowItWorks />
          <AIOperator />
          <Kubernetes />
          <Architecture />
          <Developers />
          <UseCases />
          <Ecosystem />
          <PricingCTA />
          <FinalCTA />
        </main>
        <Footer />
      </MotionConfig>
    </LazyMotion>
  );
}
