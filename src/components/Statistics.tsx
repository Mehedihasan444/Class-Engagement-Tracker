import { useState, useEffect } from 'react';
import { GanttChartSquare as ChartSquare } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { Bar, Line as ChartJSLine, Doughnut } from 'react-chartjs-2';
import { format,  } from 'date-fns';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip as ToolTip } from 'recharts';
import api from '../api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);



interface Stats {
  weekly: Array<{ day: string; points: number }>;
  monthly: Array<{ day: string; points: number }>;
  averages: { daily: number; weekly: number };
}

export default function Statistics() {
  const [stats, setStats] = useState<Stats>({
    weekly: [],
    monthly: [],
    averages: { daily: 0, weekly: 0 }
  });

  // Replace local storage data with server data
  const totalPoints = stats.monthly.reduce((sum, day) => sum + day.points, 0);
  const averagePoints = Math.round(stats.averages.daily);
  const mostActiveDay = stats.weekly.reduce((max, day) =>
    day.points > max.points ? day : max,
    { day: '', points: 0 }
  );

  // Updated weekly chart data using server response
  const weeklyActivityData = {
    labels: stats.weekly.map(d => format(new Date(d.day), 'EEE')),
    datasets: [
      {
        label: 'Daily Points',
        data: stats.weekly.map(d => d.points),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Fetch additional data for sections and contributors
  const [sectionData, setSectionData] = useState<Record<string, number>>({});
  const [topContributors, setTopContributors] = useState<Array<{ name: string, points: number }>>([]);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Load main statistics
        const { data } = await api.get('/points/statistics');
        setStats(data);

        // Load section distribution
        const sections = await api.get('/points/sections');
        setSectionData(sections.data);

        // Load top contributors
        const contributors = await api.get('/points/top-contributors');
        setTopContributors(contributors.data);
      } catch (error) {
        console.error('Failed to load statistics:', error);
      }
    };
    loadAllData();
  }, []);

  // Updated section chart data
  const sectionChartData = {
    labels: Object.keys(sectionData),
    datasets: [
      {
        data: Object.values(sectionData),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(52, 211, 153, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(251, 146, 60)',
          'rgb(52, 211, 153)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Updated contributors data
  const contributorsData = {
    labels: topContributors.map(c => c.name),
    datasets: [
      {
        label: 'Total Points',
        data: topContributors.map(c => c.points),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  return (

    <div className="space-y-8 h-full overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Weekly Points Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.weekly}>
              <XAxis dataKey="day" />
              <YAxis />
              <ToolTip />
              <Line type="monotone" dataKey="points" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="font-semibold mb-2">Monthly Total</h3>
          <div className="text-3xl font-bold text-indigo-600">
            {stats.monthly.reduce((sum, day) => sum + day.points, 0)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="font-semibold mb-2">Daily Average</h3>
          <div className="text-3xl font-bold text-green-600">
            {Number(stats.averages.daily || 0).toFixed(2)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="font-semibold mb-2">Weekly Average</h3>
          <div className="text-3xl font-bold text-blue-600">
            {stats.averages.weekly || 0}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <ChartSquare className="h-6 w-6 mr-2 text-indigo-500" />
          Engagement Statistics
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-indigo-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-indigo-700">Total Points</h3>
            <p className="text-3xl font-bold text-indigo-600">{totalPoints}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-orange-700">Total Students</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.weekly.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-700">Average Points</h3>
            <p className="text-3xl font-bold text-green-600">{averagePoints}</p>
          </div>
          <div className="bg-pink-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-pink-700">Most Active Day</h3>
            <p className="text-3xl font-bold text-pink-600">{mostActiveDay.day}</p>
            <p className="text-sm text-pink-600">{mostActiveDay.points} points</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity Chart */}
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
            <ChartJSLine
              data={weeklyActivityData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>

          {/* Class Section Distribution */}
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="text-lg font-semibold mb-4">Points by Section</h3>
            <Doughnut
              data={sectionChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>

          {/* Top Contributors */}
          <div className="bg-white rounded-lg p-4 border lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
            <Bar
              data={contributorsData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}