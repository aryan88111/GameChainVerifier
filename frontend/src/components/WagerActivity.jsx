import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import wagerService from '../services/wagerService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WagerActivity = () => {
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWagerActivity();
  }, []);

  const fetchWagerActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await wagerService.getWagerActivity();
      setActivityData(data);
    } catch (err) {
      setError(err.message || 'Error fetching wager activity');
      console.error('Error fetching wager activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!activityData) return null;

    const labels = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }).reverse();

    return {
      labels,
      datasets: [
        {
          label: 'Daily Wager Volume (ETH)',
          data: [...activityData.daily].reverse(),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          tension: 0.4,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Wager Volume',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value + ' ETH',
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchWagerActivity}
          className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Total Volume
          </h3>
          <p className="text-2xl font-bold text-indigo-600">
            {activityData?.volume.toFixed(2)} ETH
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Total Wagers
          </h3>
          <p className="text-2xl font-bold text-indigo-600">
            {activityData?.totalWagers}
          </p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Active Wagers
          </h3>
          <p className="text-2xl font-bold text-indigo-600">
            {activityData?.activeWagers}
          </p>
        </div>
      </div>

      <div className="h-[300px]">
        {activityData && <Line data={getChartData()} options={chartOptions} />}
      </div>
    </motion.div>
  );
};

export default WagerActivity;
