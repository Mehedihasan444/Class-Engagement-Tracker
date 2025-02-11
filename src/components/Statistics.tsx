import React from 'react';
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
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { format, startOfWeek, eachDayOfInterval, subDays } from 'date-fns';
import { getPointsHistory, getLeaderboard } from '../lib/storage';

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

export default function Statistics() {
  const history = getPointsHistory();
  const leaderboard = getLeaderboard();

  // Weekly Activity Chart Data
  const last7Days = eachDayOfInterval({
    start: startOfWeek(subDays(new Date(), 6)),
    end: new Date(),
  });

  const dailyPoints = last7Days.map(day => {
    const dayPoints = history.filter(entry => 
      format(new Date(entry.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    ).reduce((sum, entry) => sum + entry.points, 0);
    return {
      date: format(day, 'EEE'),
      points: dayPoints,
    };
  });

  const weeklyActivityData = {
    labels: dailyPoints.map(d => d.date),
    datasets: [
      {
        label: 'Daily Points',
        data: dailyPoints.map(d => d.points),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Class Section Distribution
  const sectionData = leaderboard.reduce((acc, student) => {
    acc[student.classSection] = (acc[student.classSection] || 0) + student.totalPoints;
    return acc;
  }, {} as Record<string, number>);

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

  // Top Contributors Bar Chart
  const topContributors = leaderboard
    .slice(0, 5)
    .map(student => ({
      name: student.name,
      points: student.totalPoints,
    }));

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

  // Calculate summary statistics
  const totalPoints = history.reduce((sum, entry) => sum + entry.points, 0);
  const totalStudents = leaderboard.length;
  const averagePoints = totalStudents ? Math.round(totalPoints / totalStudents) : 0;
  const mostActiveDay = dailyPoints.reduce((max, day) => 
    day.points > max.points ? day : max
  , dailyPoints[0]);

  return (
    <div className="space-y-6">
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
            <p className="text-3xl font-bold text-orange-600">{totalStudents}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-700">Average Points</h3>
            <p className="text-3xl font-bold text-green-600">{averagePoints}</p>
          </div>
          <div className="bg-pink-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-pink-700">Most Active Day</h3>
            <p className="text-3xl font-bold text-pink-600">{mostActiveDay.date}</p>
            <p className="text-sm text-pink-600">{mostActiveDay.points} points</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity Chart */}
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
            <Line
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