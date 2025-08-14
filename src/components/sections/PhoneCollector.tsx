"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";

export default function PhoneCollector() {
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      setMessage("請輸入電話號碼");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/prospects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      if (response.ok) {
        setMessage("感謝您的聯絡資訊！我們會盡快與您聯繫。");
        setPhone("");
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          setMessage("此電話號碼已在我們的記錄中");
        } else {
          setMessage(errorData.error || "提交失敗，請稍後再試");
        }
      }
    } catch (error) {
      setMessage("網路錯誤，請稍後再試");
      console.error("提交潛在客戶錯誤:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white shadow-xl border rounded-2xl p-6 max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-[#1a202c] text-lg">
            🔥 免費諮詢機會
          </h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 text-xl">
            ×
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          留下電話，與專業顧問免費諮詢
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="請輸入電話號碼"
            disabled={isSubmitting}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "提交中..." : "立即獲得免費諮詢"}
          </Button>
        </form>

        {message && (
          <div
            className={`mt-3 p-2 rounded text-sm ${
              message.includes("感謝")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
