"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Apr", reported: 45, cleaned: 22 },
  { month: "May", reported: 68, cleaned: 38 },
  { month: "Jun", reported: 92, cleaned: 58 },
  { month: "Jul", reported: 110, cleaned: 76 },
  { month: "Aug", reported: 88, cleaned: 92 },
  { month: "Sep", reported: 74, cleaned: 112 },
];

export const ImpactChart: React.FC = () => {
  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: "#64748B" }} 
            axisLine={{ stroke: "#CBD5E1" }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "#64748B" }} 
            axisLine={{ stroke: "#CBD5E1" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "16px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              border: "1px solid #E2E8F0",
              fontSize: "12px",
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} 
          />
          <Bar
            dataKey="reported"
            name="Reported"
            fill="#EF5350"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="cleaned"
            name="Cleaned"
            fill="#43A047"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImpactChart;
