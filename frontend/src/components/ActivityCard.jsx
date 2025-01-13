import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

const ActivityCard = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const { type, user, amount, time, status } = activity;
          const statusConfig = getStatusConfig(status);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className={`p-2 rounded-full ${statusConfig.color} mr-4`}>
                {React.createElement(statusConfig.icon, {
                  className: `h-5 w-5 ${statusConfig.iconColor}`
                })}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {type} - {amount}
                </p>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {time}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const getStatusConfig = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return {
        color: 'bg-green-100 dark:bg-green-900',
        icon: CheckCircleIcon,
        iconColor: 'text-green-500 dark:text-green-400'
      };
    case 'pending':
      return {
        color: 'bg-yellow-100 dark:bg-yellow-900',
        icon: ClockIcon,
        iconColor: 'text-yellow-500 dark:text-yellow-400'
      };
    case 'failed':
      return {
        color: 'bg-red-100 dark:bg-red-900',
        icon: XCircleIcon,
        iconColor: 'text-red-500 dark:text-red-400'
      };
    default:
      return {
        color: 'bg-gray-100 dark:bg-gray-900',
        icon: DocumentCheckIcon,
        iconColor: 'text-gray-500 dark:text-gray-400'
      };
  }
};

export default ActivityCard;
