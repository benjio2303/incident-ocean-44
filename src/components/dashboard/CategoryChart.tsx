
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Incident, IncidentCategory } from "@/models/incident";

interface CategoryChartProps {
  incidents: Incident[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#FF00FF", "#00FFFF", "#FFFF00"];

const CategoryChart: React.FC<CategoryChartProps> = ({ incidents }) => {
  // Dynamically count incidents by category
  const categoryCounts: Record<string, number> = {};
  
  incidents.forEach(incident => {
    const category = incident.category || "Other";
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  // Convert to data for the chart, filter out categories with 0 incidents
  const data = Object.entries(categoryCounts)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value
    }));
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Incidents by Category</CardTitle>
        <CardDescription>Distribution of incidents across different categories</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} incidents`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
