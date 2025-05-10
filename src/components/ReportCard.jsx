import React from 'react';
import { motion } from 'framer-motion';

function ReportCard({ title, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`card ${className}`}
    >
      {title && (
        <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-700">
          <h3 className="text-lg font-medium text-surface-900 dark:text-white">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </motion.div>
  );
}

export default ReportCard;