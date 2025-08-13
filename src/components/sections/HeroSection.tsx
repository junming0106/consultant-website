"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui";

export default function HeroSection() {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToServices = () => {
    const servicesSection = document.getElementById("services");
    servicesSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className=" flex items-center overscroll-none justify-center bg-gradient-to-br from-[#1a365d] to-[#3182ce] text-white overflow-hidden"
      style={{ minHeight: "100vh" }}>
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            專業企業顧問
            <span className="block">策略成就未來</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            我們協助企業建立競爭優勢，透過專業諮詢服務，
            <span className="block mt-2">
              為您的事業發展提供最適合的策略方案
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            onClick={scrollToContact}
            variant="accent"
            size="lg"
            className="w-full sm:w-auto">
            免費諮詢
          </Button>
          <Button
            onClick={scrollToServices}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto">
            了解服務
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-[#38a169] mb-2">
              500+
            </div>
            <div className="text-sm md:text-base text-gray-300">服務企業</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-[#38a169] mb-2">
              15+
            </div>
            <div className="text-sm md:text-base text-gray-300">年經驗</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-[#38a169] mb-2">
              95%
            </div>
            <div className="text-sm md:text-base text-gray-300">滿意度</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-[#38a169] mb-2">
              24h
            </div>
            <div className="text-sm md:text-base text-gray-300">快速回應</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
}
