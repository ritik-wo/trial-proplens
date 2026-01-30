"use client";
import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartCardProps {
  title: string;
  subtitle?: string;
  data: Array<{ date: string; value: number }>;
  dataKey?: string;
  className?: string;
}

export function LineChartCard({ title, subtitle, data, dataKey = 'value', className }: LineChartCardProps) {
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="b-font text-base font-semibold text-[--color-neutral-900]">{title}</h3>
        {subtitle && <p className="b-font text-sm text-[--color-neutral-600] mt-0.5">{subtitle}</p>}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
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
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke="#5BA8E0" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
