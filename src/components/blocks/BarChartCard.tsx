"use client";
import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartCardProps {
  title: string;
  subtitle?: string;
  data: Array<{ name?: string; date?: string; value: number }>;
  dataKey?: string;
  xAxisKey?: string;
  className?: string;
}

export function BarChartCard({ title, subtitle, data, dataKey = 'value', xAxisKey, className }: BarChartCardProps) {
  const xKey = xAxisKey || (data[0]?.name ? 'name' : 'date');
  
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="b-font text-base font-semibold text-[--color-neutral-900]">{title}</h3>
        {subtitle && <p className="b-font text-sm text-[--color-neutral-600] mt-0.5">{subtitle}</p>}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey={xKey} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Bar 
            dataKey={dataKey} 
            fill="#5BA8E0" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
