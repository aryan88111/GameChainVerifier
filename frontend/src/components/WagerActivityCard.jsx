import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';
import wagerService from '../services/wagerService';
import { format } from 'date-fns';

const WagerActivityCard = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWagerActivity();
  }, []);

  const fetchWagerActivity = async () => {
    try {
      const data = await wagerService.getWagerActivity();
      const formattedActivities = data.map(activity => ({
        type: getActivityType(activity.action),
        user: activity.user?.username || activity.opponent || 'Unknown User',
        amount: `${activity.amount} ETH`,
        time: format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a'),
        status: activity.status,
        id: activity.id
      }));
      setActivities(formattedActivities);
    } catch (err) {
      console.error('Error fetching wager activity:', err);
      setError('Failed to load activity');
    } finally {
      setLoading(false);
    }
  };

  const getActivityType = (action) => {
    switch (action?.toLowerCase()) {
      case 'create':
        return 'Created Wager';
      case 'accept':
        return 'Accepted Wager';
      case 'resolve':
        return 'Resolved Wager';
      case 'cancel':
        return 'Cancelled Wager';
      default:
        return 'Wager Action';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500 dark:text-gray-400">No recent wager activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Wager Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const { type, user, amount, time, status, id } = activity;
          const statusConfig = getStatusConfig(status);

          return (
            <motion.div
              key={id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
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
              <div className="text-right">
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {status}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {time}
                </p>
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
    case 'cancelled':
      return {
        color: 'bg-red-100 dark:bg-red-900',
        icon: XCircleIcon,
        iconColor: 'text-red-500 dark:text-red-400'
      };
    case 'active':
      return {
        color: 'bg-blue-100 dark:bg-blue-900',
        icon: CurrencyDollarIcon,
        iconColor: 'text-blue-500 dark:text-blue-400'
      };
    case 'won':
      return {
        color: 'bg-purple-100 dark:bg-purple-900',
        icon: TrophyIcon,
        iconColor: 'text-purple-500 dark:text-purple-400'
      };
    default:
      return {
        color: 'bg-gray-100 dark:bg-gray-900',
        icon: DocumentCheckIcon,
        iconColor: 'text-gray-500 dark:text-gray-400'
      };
  }
};

export default WagerActivityCard;
