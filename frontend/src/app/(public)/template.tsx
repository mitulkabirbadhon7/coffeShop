"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className="flex-1 flex flex-col w-full">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1], // Smooth luxury ease
      }}
      className="flex-1 flex flex-col w-full"
    >
      {children}
    </motion.div>
  );
}
