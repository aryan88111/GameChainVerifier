import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, className }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, translateY: -5 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden p-6 rounded-xl shadow-xl ${className || 'bg-blue-500'}`}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className="opacity-75">
          {icon}
        </div>
      </div>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 opacity-10 transform rotate-12">
        {icon}
      </div>
    </motion.div>
  );
};

export default StatsCard;
