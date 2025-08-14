"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import styles from "./Header.module.css";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      className={`${styles.header} ${
        isScrolled ? styles.headerScrolled : styles.headerTransparent
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <h1
              className={`${styles.logoText} ${
                isScrolled
                  ? styles.logoTextScrolled
                  : styles.logoTextTransparent
              }`}>
              企業顧問
            </h1>
          </div>

          <nav className={styles.nav}>
            <button
              onClick={() => scrollToSection("hero")}
              className={`${styles.navButton} ${
                isScrolled
                  ? styles.navButtonScrolled
                  : styles.navButtonTransparent
              }`}>
              首頁
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className={`${styles.navButton} ${
                isScrolled
                  ? styles.navButtonScrolled
                  : styles.navButtonTransparent
              }`}>
              服務項目
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={`${styles.navButton} ${
                isScrolled
                  ? styles.navButtonScrolled
                  : styles.navButtonTransparent
              }`}>
              關於我們
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={`${styles.contactButton} ${
                isScrolled
                  ? styles.contactButtonScrolled
                  : styles.contactButtonTransparent
              } ${!isScrolled ? styles.contactButtonGlass : ""}`}
              onMouseEnter={(e) => {
                if (!isScrolled) {
                  e.currentTarget.style.backdropFilter = "blur(4px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backdropFilter = "none";
              }}>
              聯絡我們
            </button>
            <Button
              onClick={() => scrollToSection("contact")}
              variant="accent"
              size="sm">
              立即預約
            </Button>
          </nav>

          <button
            className={`${styles.mobileMenuButton} ${
              isScrolled
                ? styles.mobileMenuButtonScrolled
                : styles.mobileMenuButtonTransparent
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg
              className={styles.mobileIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
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
          className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <button
              onClick={() => scrollToSection("hero")}
              className={styles.mobileNavButton}>
              首頁
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className={styles.mobileNavButton}>
              服務項目
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={styles.mobileNavButton}>
              關於我們
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={styles.mobileNavButton}>
              聯絡我們
            </button>
            <div className={styles.mobileButtonContainer}>
              <Button
                onClick={() => scrollToSection("contact")}
                variant="accent"
                size="sm"
                className="w-full ">
                立即預約
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
