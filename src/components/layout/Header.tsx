'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    section?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className={`text-2xl font-bold ${
              isScrolled ? 'text-[#1a365d]' : 'text-white'
            }`}>
              企業顧問
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('hero')}
              className={`hover:text-[#3182ce] transition-colors ${
                isScrolled ? 'text-[#1a202c]' : 'text-white'
              }`}
            >
              首頁
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className={`hover:text-[#3182ce] transition-colors ${
                isScrolled ? 'text-[#1a202c]' : 'text-white'
              }`}
            >
              服務項目
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`hover:text-[#3182ce] transition-colors ${
                isScrolled ? 'text-[#1a202c]' : 'text-white'
              }`}
            >
              關於我們
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`hover:text-[#3182ce] transition-colors ${
                isScrolled ? 'text-[#1a202c]' : 'text-white'
              }`}
            >
              聯絡我們
            </button>
            <Button
              onClick={() => scrollToSection('contact')}
              variant="accent"
              size="sm"
            >
              免費諮詢
            </Button>
          </nav>

          <button
            className={`md:hidden p-2 ${
              isScrolled ? 'text-[#1a202c]' : 'text-white'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => scrollToSection('hero')}
              className="block px-3 py-2 text-base font-medium text-[#1a202c] hover:text-[#3182ce] hover:bg-gray-50 rounded-md w-full text-left"
            >
              首頁
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="block px-3 py-2 text-base font-medium text-[#1a202c] hover:text-[#3182ce] hover:bg-gray-50 rounded-md w-full text-left"
            >
              服務項目
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block px-3 py-2 text-base font-medium text-[#1a202c] hover:text-[#3182ce] hover:bg-gray-50 rounded-md w-full text-left"
            >
              關於我們
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block px-3 py-2 text-base font-medium text-[#1a202c] hover:text-[#3182ce] hover:bg-gray-50 rounded-md w-full text-left"
            >
              聯絡我們
            </button>
            <div className="px-3 py-2">
              <Button
                onClick={() => scrollToSection('contact')}
                variant="accent"
                size="sm"
                className="w-full"
              >
                免費諮詢
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}