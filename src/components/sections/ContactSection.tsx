'use client'

import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Button, Card, Input, Textarea } from '@/components/ui'
import styles from './ContactSection.module.css'

interface FormData {
  name: string
  email: string
  phone: string
  service: string
  company?: string
  budget?: string
  message: string
}

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('表單提交成功:', result)
        setSubmitStatus('success')
        reset()
      } else {
        const error = await response.json()
        console.error('提交失敗:', error)
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('網路錯誤:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }

    // 3秒後重置狀態
    setTimeout(() => setSubmitStatus('idle'), 3000)
  }

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={styles.header}
        >
          <h2 className={styles.title}>
            聯絡我們
          </h2>
          <p className={styles.subtitle}>
            準備開始您的企業轉型之旅？立即與我們聯繫，
            獲得專業的顧問建議與客製化解決方案
          </p>
        </motion.div>

        <div className={styles.grid}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className={styles.formCard}>
              <h3 className={styles.formTitle}>
                取得專業諮詢
              </h3>
              
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.successMessage}
                >
                  感謝您的聯絡！我們將在 24 小時內回覆您。
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.errorMessage}
                >
                  提交失敗，請稍後再試或直接聯絡我們。
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.formRow}>
                  <Input
                    label="姓名"
                    required
                    {...register('name', {
                      required: '請輸入姓名',
                      minLength: { value: 2, message: '姓名至少需要 2 個字元' }
                    })}
                    error={errors.name?.message}
                  />
                  
                  <Input
                    label="電子郵件"
                    type="email"
                    required
                    {...register('email', {
                      required: '請輸入電子郵件',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: '請輸入有效的電子郵件格式'
                      }
                    })}
                    error={errors.email?.message}
                  />
                </div>

                <div className={styles.formRow}>
                  <Input
                    label="聯絡電話"
                    type="tel"
                    required
                    {...register('phone', {
                      required: '請輸入聯絡電話'
                    })}
                    error={errors.phone?.message}
                  />
                  
                  <div className={styles.selectContainer}>
                    <label className={styles.selectLabel}>
                      服務類型 <span className={styles.selectRequired}>*</span>
                    </label>
                    <select
                      {...register('service', { required: '請選擇服務類型' })}
                      className={styles.select}
                    >
                      <option value="">請選擇服務類型</option>
                      <option value="strategy">企業策略規劃</option>
                      <option value="operations">營運效率優化</option>
                      <option value="market">市場拓展諮詢</option>
                      <option value="organization">組織架構重組</option>
                      <option value="innovation">創新轉型輔導</option>
                      <option value="finance">財務規劃顧問</option>
                    </select>
                    {errors.service && (
                      <p className={styles.selectError}>{errors.service.message}</p>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <Input
                    label="公司名稱"
                    {...register('company')}
                  />
                  
                  <div className={styles.selectContainer}>
                    <label className={styles.selectLabel}>
                      預算範圍
                    </label>
                    <select
                      {...register('budget')}
                      className={styles.select}
                    >
                      <option value="">請選擇預算範圍</option>
                      <option value="under-50k">50萬以下</option>
                      <option value="50k-100k">50萬 - 100萬</option>
                      <option value="100k-200k">100萬 - 200萬</option>
                      <option value="over-200k">200萬以上</option>
                    </select>
                  </div>
                </div>

                <Textarea
                  label="詳細需求"
                  required
                  placeholder="請描述您的具體需求與期望..."
                  {...register('message', {
                    required: '請輸入詳細需求',
                    minLength: { value: 10, message: '請至少輸入 10 個字元' }
                  })}
                  error={errors.message?.message}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '提交中...' : '提交諮詢需求'}
                </Button>
              </form>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={styles.contactInfo}
          >
            <Card className={styles.infoCard}>
              <h3 className={styles.infoTitle}>
                聯絡資訊
              </h3>
              
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>📞</div>
                  <div className={styles.infoContent}>
                    <h4 className={styles.infoLabel}>電話</h4>
                    <p className={styles.infoText}>+886 2 1234 5678</p>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>✉️</div>
                  <div className={styles.infoContent}>
                    <h4 className={styles.infoLabel}>電子郵件</h4>
                    <p className={styles.infoText}>contact@consultant.com</p>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>📍</div>
                  <div className={styles.infoContent}>
                    <h4 className={styles.infoLabel}>地址</h4>
                    <p className={styles.infoText}>台北市信義區信義路五段7號</p>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>⏰</div>
                  <div className={styles.infoContent}>
                    <h4 className={styles.infoLabel}>服務時間</h4>
                    <p className={styles.infoText}>週一至週五 9:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className={styles.whyCard}>
              <h3 className={styles.whyTitle}>
                為什麼選擇我們？
              </h3>
              <ul className={styles.whyList}>
                <li className={styles.whyItem}>
                  <span>✓</span>
                  <span>15+ 年豐富經驗</span>
                </li>
                <li className={styles.whyItem}>
                  <span>✓</span>
                  <span>500+ 成功案例</span>
                </li>
                <li className={styles.whyItem}>
                  <span>✓</span>
                  <span>95% 客戶滿意度</span>
                </li>
                <li className={styles.whyItem}>
                  <span>✓</span>
                  <span>24小時快速回應</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}