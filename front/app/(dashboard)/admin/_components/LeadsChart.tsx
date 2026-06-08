'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// TODO: API — replace with GET /api/admin/leads/by-source
const leadsData = {
  labels: ['Web', 'Referral', 'Cold Call', 'Social', 'Other'],
  datasets: [
    {
      label: 'Leads',
      data: [42, 28, 15, 31, 9],
      backgroundColor: '#EBEBEB',
      hoverBackgroundColor: '#F5C518',
      borderRadius: 6,
      borderSkipped: false as const,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1A1A1A',
      bodyColor: '#ffffff',
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        font: { size: 11 },
        color: '#9B9B9B',
      },
    },
    y: {
      grid: { color: '#F0F0F0', lineWidth: 1 },
      border: { display: false },
      ticks: {
        font: { size: 11 },
        color: '#9B9B9B',
        stepSize: 10,
      },
    },
  },
} as const;

export default function LeadsChart() {
  return (
    <div style={{ height: '190px' }}>
      <Bar data={leadsData} options={options as Parameters<typeof Bar>[0]['options']} />
    </div>
  );
}