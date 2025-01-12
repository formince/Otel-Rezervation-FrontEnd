import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  AlertCircle 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data for financial metrics
const revenueData = [
  { name: 'Ocak', revenue: 4000, commission: 1200 },
  { name: 'Şubat', revenue: 3000, commission: 900 },
  { name: 'Mart', revenue: 5000, commission: 1500 },
  { name: 'Nisan', revenue: 4500, commission: 1350 },
  { name: 'Mayıs', revenue: 6000, commission: 1800 },
  { name: 'Haziran', revenue: 5500, commission: 1650 },
];

const pendingPayments = [
  { 
    id: 1, 
    hotelName: 'Seaside Resort', 
    amountDue: 2500, 
    dueDate: '2024-02-15' 
  },
  { 
    id: 2, 
    hotelName: 'Mountain View Hotel', 
    amountDue: 3200, 
    dueDate: '2024-02-20' 
  },
  { 
    id: 3, 
    hotelName: 'City Center Inn', 
    amountDue: 1800, 
    dueDate: '2024-02-10' 
  },
];

const FinancialOverview: React.FC = () => {
  const totalRevenue = 250000;
  const revenueGrowth = 15.5;
  const totalCommission = 75000;
  const commissionRate = 10;
  const totalPendingPayments = pendingPayments.reduce((sum, payment) => sum + payment.amountDue, 0);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Finansal Genel Bakış</h2>
      
      {/* Top Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Revenue Card */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₺{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {revenueGrowth > 0 ? (
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
              )}
              {revenueGrowth}% son aydan bu yana
            </p>
          </CardContent>
        </Card>

        {/* Total Commission Card */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Komisyon</CardTitle>
            <CreditCard className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₺{totalCommission.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Komisyon Oranı: %{commissionRate}
            </p>
          </CardContent>
        </Card>

        {/* Pending Payments Card */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Ödemeler</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₺{totalPendingPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {pendingPayments.length} Otel için Bekliyor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Revenue Line Chart */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Aylık Gelir ve Komisyon</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `₺${value.toLocaleString()}`, 
                    name === 'revenue' ? 'Gelir' : 'Komisyon'
                  ]}
                />
                <Legend 
                  formatter={(value) => 
                    value === 'revenue' ? 'Gelir' : 'Komisyon'
                  }
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="commission" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pending Payments List */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Bekleyen Ödemeler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <div 
                  key={payment.id} 
                  className="flex justify-between items-center border-b pb-3 last:border-b-0"
                >
                  <div>
                    <p className="font-medium">{payment.hotelName}</p>
                    <p className="text-xs text-muted-foreground">
                      Vadesi: {payment.dueDate}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-orange-600">
                      ₺{payment.amountDue.toLocaleString()}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Ödeme Al
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialOverview;
