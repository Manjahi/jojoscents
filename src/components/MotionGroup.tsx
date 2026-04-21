"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function MotionGroup({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: {
          transition: reduce ? {} : { staggerChildren: 0.12 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
