import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, Building2, CreditCard } from 'lucide-react';

const mockData = {
  bookings: [
    { month: 'Jan', value: 400 },
    { month: 'Feb', value: 300 },
    { month: 'Mar', value: 600 },
    { month: 'Apr', value: 800 },
  ],
  hotels: [
    { month: 'Jan', count: 10 },
    { month: 'Feb', count: 15 },
    { month: 'Mar', count: 12 },
    { month: 'Apr', count: 18 },
  ]
};

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ElementType;
  chart?: React.ReactElement;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon: Icon, chart: Chart }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
      {Chart && (
        <div className="h-24 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {Chart}
          </ResponsiveContainer>
        </div>
      )}
    </CardContent>
  </Card>
);

export const StatisticsOverview = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Bookings"
        value="1,234"
        trend={12}
        icon={CreditCard}
        chart={
          <LineChart data={mockData.bookings}>
            <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
            <Tooltip />
          </LineChart>
        }
      />
      <StatCard
        title="Total Revenue"
        value="$52,000"
        trend={8}
        icon={CreditCard}
      />
      <StatCard
        title="Active Hotels"
        value="45"
        trend={-3}
        icon={Building2}
        chart={
          <BarChart data={mockData.hotels}>
            <Bar dataKey="count" fill="#2563eb" />
            <Tooltip />
          </BarChart>
        }
      />
      <StatCard
        title="Active Users"
        value="892"
        trend={15}
        icon={Users}
      />
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Hotel management system overview</p>
      </div>
      <StatisticsOverview />
    </div>
  );
};

export default Dashboard;
