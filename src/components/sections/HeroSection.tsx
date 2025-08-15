"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import Image from "next/image";

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
      className="min-h-screen relative flex items-center justify-center overflow-hidden pt-14 sm:pt-16">
      {/* 建築背景圖片 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Images/banner.jpg"
          alt="現代企業辦公大樓 - 專業顧問服務象徵"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* 多層遮罩確保文字清晰可讀 */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a365d]/70 via-[#1a365d]/50 to-[#2d5a8a]/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
      </div>

      {/* 主要內容 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-relaxed md:leading-tight">
            <span className="block text-white drop-shadow-2xl mb-2 md:mb-0">
              專業企業顧問
            </span>
            <span className="block text-white drop-shadow-2xl text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium mt-6 md:mt-4">
              策略成就未來
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}>
          <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-gray-100 max-w-5xl mx-auto leading-relaxed drop-shadow-lg">
            我們協助企業建立競爭優勢，透過專業諮詢服務，
            <span className="block mt-3 text-white font-semibold drop-shadow-md">
              為您的事業發展提供最適合的策略方案
            </span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button
            onClick={scrollToContact}
            variant="accent"
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-[#d4a574] to-[#c5935e] hover:from-[#c5935e] hover:to-[#b8854c] shadow-2xl hover:shadow-3xl text-lg px-8 py-4 font-semibold">
            立即預約諮詢
          </Button>
          <Button
            onClick={scrollToServices}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-[#1a365d] backdrop-blur-sm bg-white/10 shadow-2xl hover:shadow-3xl text-lg px-8 py-4">
            了解服務
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center max-w-4xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 shadow-2xl border border-white/20">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#d4a574] mb-2 drop-shadow-lg">
              500+
            </div>
            <div className="text-sm md:text-base text-gray-200 font-medium">
              服務企業
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 shadow-2xl border border-white/20">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#d4a574] mb-2 drop-shadow-lg">
              15+
            </div>
            <div className="text-sm md:text-base text-gray-200 font-medium">
              年經驗
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 shadow-2xl border border-white/20">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#d4a574] mb-2 drop-shadow-lg">
              95%
            </div>
            <div className="text-sm md:text-base text-gray-200 font-medium">
              滿意度
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 shadow-2xl border border-white/20">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#d4a574] mb-2 drop-shadow-lg">
              24h
            </div>
            <div className="text-sm md:text-base text-gray-200 font-medium">
              快速回應
            </div>
          </div>
        </motion.div>
      </div>

      {/* 滾動提示 */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center bg-white/10 backdrop-blur-sm shadow-lg">
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}></motion.div>
        </div>
      </motion.div>
    </section>
  );
}
