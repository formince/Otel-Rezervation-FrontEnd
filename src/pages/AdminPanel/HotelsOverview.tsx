import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Badge 
} from "@/components/ui/badge";
import { 
  Eye, 
  Check, 
  X, 
  AlertTriangle, 
  ShieldOff, 
  Shield 
} from 'lucide-react';
import { Button } from "@/components/ui/button";

// Mock data structure for hotels
interface Hotel {
  id: number;
  name: string;
  location: string;
  status: 'pending' | 'active' | 'suspended';
  document: string;
  applicationDate: string;
  complaints: number;
}

// Mock data for demonstration
const mockHotels: Hotel[] = [
  {
    id: 1,
    name: "Seaside Resort",
    location: "Antalya, Turkey",
    status: 'pending',
    document: "https://example.com/hotel-docs/1",
    applicationDate: "2024-01-10",
    complaints: 0
  },
  {
    id: 2,
    name: "Mountain Lodge",
    location: "Bolu, Turkey",
    status: 'active',
    document: "https://example.com/hotel-docs/2",
    applicationDate: "2023-12-15",
    complaints: 2
  },
  {
    id: 3,
    name: "City Center Hotel",
    location: "Istanbul, Turkey",
    status: 'suspended',
    document: "https://example.com/hotel-docs/3",
    applicationDate: "2023-11-20",
    complaints: 5
  }
];

const HotelsOverview: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>(mockHotels);

  const getStatusBadgeVariant = (status: Hotel['status']) => {
    switch(status) {
      case 'pending': return 'secondary';
      case 'active': return 'default';
      case 'suspended': return 'destructive';
    }
  };

  const handleApprove = (hotelId: number) => {
    setHotels(hotels.map(hotel => 
      hotel.id === hotelId 
        ? { ...hotel, status: 'active' } 
        : hotel
    ));
  };

  const handleReject = (hotelId: number) => {
    setHotels(hotels.filter(hotel => hotel.id !== hotelId));
  };

  const handleSuspend = (hotelId: number) => {
    setHotels(hotels.map(hotel => 
      hotel.id === hotelId 
        ? { ...hotel, status: 'suspended' } 
        : hotel
    ));
  };

  const handleRepublish = (hotelId: number) => {
    setHotels(hotels.map(hotel => 
      hotel.id === hotelId 
        ? { ...hotel, status: 'active' } 
        : hotel
    ));
  };

  const renderHotelCard = (hotel: Hotel, isApprovalTab: boolean = false) => (
    <Card key={hotel.id} className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{hotel.name}</CardTitle>
        <Badge 
          variant={getStatusBadgeVariant(hotel.status)}
          className="flex items-center gap-1"
        >
          {hotel.status.charAt(0).toUpperCase() + hotel.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            <strong>Location:</strong> {hotel.location}
          </p>
          {isApprovalTab ? (
            <div className="text-xs text-muted-foreground">
              <p><strong>Application Date:</strong> {hotel.applicationDate}</p>
              <a 
                href={hotel.document} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline"
              >
                View Documentss
              </a>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              <p><strong>Complaints:</strong> {hotel.complaints}</p>
            </div>
          )}
          
          <div className="flex gap-2 mt-2">
            {isApprovalTab ? (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleApprove(hotel.id)}
                  className="hover:bg-green-50 text-black"
                >
                  <Check className="mr-2 h-4 w-4" /> Onayla
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleReject(hotel.id)}
                  className="hover:bg-red-50 text-black"
                >
                  <X className="mr-2 h-4 w-4" /> Reddet
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="hover:bg-blue-50 text-black"
                >
                  <Eye className="mr-2 h-4 w-4" /> İncele
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleSuspend(hotel.id)}
                  className="hover:bg-yellow-50 text-black"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" /> Uyar
                </Button>
                {hotel.status === 'active' && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    className="hover:bg-red-50 text-black"
                  >
                    <ShieldOff className="mr-2 h-4 w-4" /> Askıya Al
                  </Button>
                )}
                {hotel.status === 'suspended' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRepublish(hotel.id)}
                    className="hover:bg-green-50 text-black"
                  >
                    <Shield className="mr-2 h-4 w-4" /> Tekrar Yayına Al
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Hotel Management</h2>
      
      <Tabs defaultValue="approval" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="approval">Approval Management</TabsTrigger>
          <TabsTrigger value="inspection">Hotel Inspection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="approval" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotels
            .filter(hotel => hotel.status === 'pending')
            .map(hotel => renderHotelCard(hotel, true))
          }
          {hotels.filter(hotel => hotel.status === 'pending').length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">
              No pending hotel applications
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="inspection" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotels
            .filter(hotel => hotel.status !== 'pending')
            .map(hotel => renderHotelCard(hotel, false))
          }
          {hotels.filter(hotel => hotel.status !== 'pending').length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">
              No hotels to inspect
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HotelsOverview;
