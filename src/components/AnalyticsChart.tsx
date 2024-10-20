import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { School, LicenseClass, DifferenceClass, CLASS_NAMES } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AnalyticsChartProps {
  school: School;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ school }) => {
  const classTypes: (LicenseClass | DifferenceClass)[] = ['B', 'A1', 'A2', 'C', 'D', 'FARK_A1', 'FARK_A2', 'BAKANLIK_A1'];

  const data = {
    labels: classTypes.map(type => CLASS_NAMES[type]),
    datasets: [
      {
        label: 'Kursiyer Sayısı',
        data: classTypes.map(type => school.candidates[type] || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sınıflara Göre Kursiyer Dağılımı',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-6">Analitik Grafik</h2>
        <div className="h-64 sm:h-96">
          <Bar options={options} data={data} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;