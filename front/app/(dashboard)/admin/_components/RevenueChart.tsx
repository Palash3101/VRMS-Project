'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

// TODO: API — replace with GET /api/admin/revenue?period=6m
const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [280000, 342000, 295000, 418000, 376000, 482000],
      borderColor: '#F5C518',
      backgroundColor: 'rgba(245, 197, 24, 0.07)',
      borderWidth: 2,
      fill: true,
      tension: 0.42,
      pointRadius: 3,
      pointBackgroundColor: '#F5C518',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: { raw: unknown }) =>
          `₹${((ctx.raw as number) / 1000).toFixed(0)}K`,
      },
      backgroundColor: '#1A1A1A',
      titleColor: '#9B9B9B',
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
        callback: (val: string | number) => `₹${(Number(val) / 1000).toFixed(0)}K`,
      },
    },
  },
} as const;

export default function RevenueChart() {
  return (
    <div style={{ height: '220px' }}>
      <Line data={revenueData} options={options as Parameters<typeof Line>[0]['options']} />
    </div>
  );
}