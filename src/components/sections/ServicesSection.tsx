"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui";

const services = [
  {
    icon: "💼",
    title: "企業策略規劃",
    description:
      "協助企業制定長期發展戰略，分析市場趨勢與競爭態勢，為企業發展指引明確方向。",
  },
  {
    icon: "📊",
    title: "營運效率優化",
    description:
      "深入分析企業營運流程，識別瓶頸與改善機會，提升整體營運效率與成本控制。",
  },
  {
    icon: "🎯",
    title: "市場拓展諮詢",
    description: "提供市場研究分析，制定進入策略，協助企業開拓新市場與客戶群。",
  },
  {
    icon: "🏗️",
    title: "組織架構重組",
    description:
      "評估現有組織架構，設計最適合的組織模式，提升團隊效能與溝通效率。",
  },
  {
    icon: "💡",
    title: "創新轉型輔導",
    description:
      "引導企業數位轉型，建立創新機制，協助傳統企業適應現代商業環境。",
  },
  {
    icon: "📈",
    title: "財務規劃顧問",
    description:
      "提供財務健診與規劃建議，優化資金配置，建立穩健的財務管理制度。",
  },
];

export default function ServicesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a202c] mb-6">
            專業顧問服務
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我們提供全方位的企業顧問服務，從策略規劃到實務執行，
            陪伴您的企業邁向成功之路
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-8 h-full transform-gpu">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-[#1a202c] mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
