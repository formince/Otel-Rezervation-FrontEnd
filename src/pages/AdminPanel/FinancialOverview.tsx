import React, { useEffect, useState } from 'react';
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
  AlertCircle,
  Building
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import axios from 'axios';

// API'den gelecek veri tipi
interface FinancialData {
  totalRevenue: number;
  monthlyRevenue: number;
  previousMonthRevenue: number;
  revenueGrowthRate: number;
  topRevenueHotels: {
    hotelId: number;
    hotelName: string;
    revenue: number;
  }[];
}

// Aylık gelir verisi oluşturma fonksiyonu
const generateMonthlyData = (currentRevenue: number, previousRevenue: number) => {
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'];
  
  // Son 6 ayın verilerini oluştur
  return months.map((month, index) => {
    // Son ay için gerçek veri, önceki ay için gerçek veri, diğerleri için tahmin
    if (index === months.length - 1) {
      return { name: month, gelir: currentRevenue };
    } else if (index === months.length - 2) {
      return { name: month, gelir: previousRevenue };
    } else {
      // Diğer aylar için rastgele değerler (gerçek veri olmadığı için)
      const randomFactor = 0.7 + (Math.random() * 0.6); // 0.7 ile 1.3 arası
      return { name: month, gelir: Math.round(previousRevenue * randomFactor) };
    }
  });
};

const FinancialOverview: React.FC = () => {
  // State tanımlamaları
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API'den veri çekme
  useEffect(() => {
    const fetchFinancialData = async () => {
      console.log('Finansal veriler için API isteği başlatılıyor...');
      
      try {
        const response = await axios.get('https://localhost:7174/api/Dashboard/financial');
        
        console.log('API yanıtı başarılı!');
        console.log('Finansal veriler:', response.data);
        
        // State'i güncelle
        setFinancialData(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error('API isteği başarısız oldu:', error);
        
        if (error.response) {
          console.error('Hata yanıtı:', error.response.status, error.response.data);
          setError(`API hatası: ${error.response.status}`);
        } else if (error.request) {
          console.error('Yanıt alınamadı!');
          setError('Sunucudan yanıt alınamadı');
        } else {
          console.error('Hata mesajı:', error.message);
          setError(`Hata: ${error.message}`);
        }
        
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  // Yükleme durumu
  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">Finansal Genel Bakış</h2>
        <div className="text-center py-8">Veriler yükleniyor...</div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">Finansal Genel Bakış</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Hata!</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Veri yoksa
  if (!financialData) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">Finansal Genel Bakış</h2>
        <div className="text-center py-8">Veri bulunamadı</div>
      </div>
    );
  }

  // Aylık gelir trendi için veri
  const monthlyRevenueData = generateMonthlyData(
    financialData.monthlyRevenue, 
    financialData.previousMonthRevenue
  );

  // En çok gelir getiren oteller için veri
  const topHotelsData = financialData.topRevenueHotels.map(hotel => ({
    name: hotel.hotelName,
    gelir: hotel.revenue
  }));

  // Büyüme oranı pozitif mi?
  const isGrowthPositive = financialData.revenueGrowthRate >= 0;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Finansal Genel Bakış</h2>
      
      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${financialData.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aylık Gelir</CardTitle>
            <CreditCard className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${financialData.monthlyRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Önceki Ay Geliri</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${financialData.previousMonthRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Büyüme Oranı</CardTitle>
            {isGrowthPositive ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${isGrowthPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isGrowthPositive ? '+' : ''}{financialData.revenueGrowthRate}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Grafikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Aylık Gelir Trendi */}
        <Card>
          <CardHeader>
            <CardTitle>Aylık Gelir Trendi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyRevenueData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Gelir']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="gelir" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* En Çok Gelir Getiren Oteller */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>En Çok Gelir Getiren Oteller</CardTitle>
            <Building className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topHotelsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Gelir']} />
                  <Legend />
                  <Bar dataKey="gelir" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* JSON Verisi */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Ham API Verisi</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(financialData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialOverview;
