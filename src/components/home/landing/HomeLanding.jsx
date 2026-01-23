import React from "react";
import { motion } from "framer-motion";
import Hero from "../hero/Hero";
import SearchBox from "../../search/SearchBox";
import Features from "../features/Features";
import { useLanguage } from "../../../context/LanguageContext";

export default function HomeLanding({ onSearchSuccess }) {
  const { t } = useLanguage();

  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* 1. Hero Bereich mit integrierter Suche */}
      <Hero>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full"
        >
          <SearchBox onSearchSuccess={onSearchSuccess} />
        </motion.div>
      </Hero>

      {/* 4. Features Grid */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto px-4 sm:px-6 pb-20 sm:pb-28 md:pb-36 lg:pb-44 max-w-[1440px] pt-24"
      >
        <Features />
      </motion.section>
    </motion.div>
  );
}
