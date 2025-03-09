import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  Tooltip, ResponsiveContainer, XAxis, YAxis, Legend 
} from 'recharts';
import { 
  Building, 
  Building2, 
  Users, 
  CalendarCheck 
} from 'lucide-react';

// API'den gelecek veri tipi
interface DashboardStats {
  totalHotels: number;
  activeHotels: number;
  totalUsers: number;
  totalReservations: number;
  dailyReservations: number;
  monthlyReservations: number;
}

const Statistics = () => {
  // State tanımlamaları
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API'den veri çekme
  useEffect(() => {
    const fetchStats = async () => {
      console.log('İstatistikler sayfası: API isteği başlatılıyor...');
      
      try {
        const response = await axios.get('https://localhost:7174/api/Dashboard/stats');
        
        console.log('API yanıtı başarılı!');
        console.log('API verileri:', response.data);
        
        // Veri alanlarını tek tek konsola yazdır
        console.log('totalHotels:', response.data.totalHotels);
        console.log('activeHotels:', response.data.activeHotels);
        console.log('totalUsers:', response.data.totalUsers);
        console.log('totalReservations:', response.data.totalReservations);
        console.log('dailyReservations:', response.data.dailyReservations);
        console.log('monthlyReservations:', response.data.monthlyReservations);
        
        // State'i güncelle
        setStats(response.data);
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

    fetchStats();
  }, []);

  // Yükleme durumu
  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">İstatistikler</h2>
        <div className="text-center py-8">Veriler yükleniyor...</div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">İstatistikler</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Hata!</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Veri yoksa
  if (!stats) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">İstatistikler</h2>
        <div className="text-center py-8">Veri bulunamadı</div>
      </div>
    );
  }

  // Grafik verileri - sadece gerçek verilerden
  const hotelData = [
    { name: 'Aktif Oteller', value: stats.activeHotels },
    { name: 'Pasif Oteller', value: stats.totalHotels - stats.activeHotels }
  ];

  const reservationData = [
    { name: 'Günlük', value: stats.dailyReservations },
    { name: 'Aylık', value: stats.monthlyReservations },
    { name: 'Diğer', value: stats.totalReservations - stats.dailyReservations - stats.monthlyReservations }
  ];

  // Grafik renkleri
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">İstatistikler</h2>
      
      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Toplam Otel</CardTitle>
            <Building className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalHotels}</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aktif Otel</CardTitle>
            <Building2 className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeHotels}</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Toplam Rezervasyon</CardTitle>
            <CalendarCheck className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReservations}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Grafikler - Sadece 2 tane, gerçek verilerle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Otel Durumu Grafiği */}
        <Card>
          <CardHeader>
            <CardTitle>Otel Durumu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hotelData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {hotelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Rezervasyon Dağılımı Grafiği */}
        <Card>
          <CardHeader>
            <CardTitle>Rezervasyon Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reservationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
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
            {JSON.stringify(stats, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics; 