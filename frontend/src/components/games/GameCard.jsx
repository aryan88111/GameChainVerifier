import React from 'react';
import { motion } from 'framer-motion';
import { PlayIcon, InformationCircleIcon, TrophyIcon } from '@heroicons/react/24/outline';

const GameCard = ({ id, name, description, icon, onSelect }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={icon}
          alt={name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = '/images/game-placeholder.png';
          }}
        />
        <div className="absolute top-0 right-0 m-4">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Active
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          {name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrophyIcon className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Global Ranking Available
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => onSelect(id)}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <PlayIcon className="h-5 w-5" />
            <span>Play Now</span>
          </button>
          <button
            className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 p-2 rounded-lg transition-colors duration-200"
          >
            <InformationCircleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;
