"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui";
import { Button } from "@/components/ui";

const achievements = [
  {
    icon: "🏆",
    title: "業界領導者",
    description: "15年豐富經驗，深耕企業顧問服務領域，累積超過500個成功案例。",
  },
  {
    icon: "🎯",
    title: "精準策略",
    description: "針對不同產業特性，量身打造最適合的策略方案與執行計畫。",
  },
  {
    icon: "🤝",
    title: "長期夥伴",
    description: "95%客戶滿意度，超過80%的客戶選擇持續合作，建立長期信任關係。",
  },
  {
    icon: "⚡",
    title: "快速回應",
    description: "24小時內回應諮詢需求，快速啟動專案，把握最佳時機。",
  },
];

const teamValues = [
  "專業 Professional",
  "誠信 Integrity",
  "創新 Innovation",
  "卓越 Excellence",
];

const scrollToContact = () => {
  const contactSection = document.getElementById("contact");
  contactSection?.scrollIntoView({ behavior: "smooth" });
};

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a202c] mb-6">
            關於我們
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            我們是一群熱忱的專業顧問，致力於協助企業實現成長目標。
            憑藉豐富的實務經驗與深度的產業洞察，為客戶提供最佳的解決方案。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}>
            <div className="bg-gradient-to-br from-[#1a365d] to-[#3182ce] text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6">我們的使命</h3>
              <p className="text-lg leading-relaxed mb-6">
                成為企業最值得信賴的策略夥伴，透過專業顧問服務，
                協助企業建立競爭優勢，實現永續成長。
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                {teamValues.map((value, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="text-3xl mb-4">{achievement.icon}</div>
                <h4 className="font-semibold text-[#1a202c] mb-2">
                  {achievement.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {achievement.description}
                </p>
              </Card>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-gray-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-[#1a202c] mb-6">
            準備開始您的轉型之旅？
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            無論您面臨什麼挑戰，我們都有能力協助您找到最佳解決方案。
            立即聯繫我們，開啟企業成功的新篇章。
          </p>
          <motion.div>
            <Button
              onClick={scrollToContact}
              variant="accent"
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-[#d4a574] to-[#c5935e] hover:from-[#c5935e] hover:to-[#b8854c] shadow-2xl hover:shadow-3xl text-lg px-8 py-4 font-semibold">
              立即預約諮詢
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
