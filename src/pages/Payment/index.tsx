import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

interface PaymentData {
  userId: number;
  roomId: number;
  hotelId: number;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  email: string;
  name?: string;
  surname?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  ipAddress?: string;
  shippingAddress?: {
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
}

interface RoomDetails {
  roomNumber: string | null;
  roomType: string | null;
  nights: number;
  basePrice: number;
}

interface PaymentResponse {
  reservationId: number;
  checkoutFormContent: string;
  status?: 'success' | 'error';
  message?: string;
}

const Payment = () => {
  const [paymentHtml, setPaymentHtml] = useState('');
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const location = useLocation();
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  // İyzico script'ini yükle
  const loadIyzicoScript = (content: string) => {
    try {
      // Önce form div'ini oluştur
      setPaymentHtml('<div id="iyzipay-checkout-form" class="responsive"></div>');

      // Script'i DOM'a ekle
      const scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.text = content.replace('<script type="text/javascript">', '').replace('</script>', '');
      document.body.appendChild(scriptElement);
    } catch (error) {
      console.error('Script yükleme hatası:', error);
      setPaymentStatus('error');
      toast.error('Ödeme formu yüklenirken bir hata oluştu');
    }
  };

  useEffect(() => {
    if (!isFirstRender.current) {
      return;
    }

    isFirstRender.current = false;

    const createPayment = async () => {
      try {
        const state = location.state as { paymentData: PaymentData; roomDetails: RoomDetails } | null;
        
        if (!state || !state.paymentData) {
          console.error('Ödeme verileri bulunamadı:', location.state);
          toast.error('Ödeme bilgileri bulunamadı');
          navigate('/');
          return;
        }

        const { paymentData, roomDetails } = state;

        // Debug için detaylı loglama
        console.log('Ödeme işlemi başlatılıyor:', {
          paymentData,
          roomDetails
        });

        // Gerekli alanların kontrolü
        const requiredFields = ['userId', 'roomId', 'hotelId', 'checkIn', 'checkOut', 'totalPrice', 'email'] as const;
        const missingFields = requiredFields.filter(field => !paymentData[field]);

        if (missingFields.length > 0) {
          console.error('Eksik alanlar:', missingFields);
          console.error('Mevcut veriler:', paymentData);
          toast.error(`Ödeme bilgilerinde eksik alanlar var: ${missingFields.join(', ')}`);
          navigate(-1);
          return;
        }

        // Sayısal değerlerin kontrolü
        if (paymentData.totalPrice <= 0) {
          toast.error('Geçersiz ödeme tutarı');
          navigate(-1);
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Oturum süreniz dolmuş');
          navigate('/login');
          return;
        }

        const response = await axios.post<PaymentResponse>(
          'https://localhost:7174/api/payments/create',
          {
            userId: Number(paymentData.userId),
            roomId: Number(paymentData.roomId),
            hotelId: Number(paymentData.hotelId),
            checkIn: paymentData.checkIn,
            checkOut: paymentData.checkOut,
            totalPrice: Number(paymentData.totalPrice),
            email: paymentData.email,
            name: paymentData.name || "Rezervasyon",
            surname: paymentData.surname || "Müşterisi",
            address: paymentData.address || "Test Adresi",
            city: paymentData.city || "İstanbul",
            zipCode: paymentData.zipCode || "34000",
            ipAddress: paymentData.ipAddress || "127.0.0.1",
            shippingAddress: paymentData.shippingAddress || {
              address: "Test Teslimat Adresi",
              city: "İstanbul",
              country: "Türkiye",
              zipCode: "34000"
            }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log('API yanıtı:', response.data);

        if (!response.data.checkoutFormContent || !response.data.reservationId) {
          throw new Error('Geçersiz API yanıtı');
        }

        // Rezervasyon ID'yi kaydet
        setReservationId(response.data.reservationId);

        // URL'i güncelle
        window.history.replaceState(null, '', `/payment?reservationId=${response.data.reservationId}`);

        // İyzico script'ini yükle
        loadIyzicoScript(response.data.checkoutFormContent);

      } catch (error) {
        console.error('Ödeme başlatma hatası:', error);
        setPaymentStatus('error');
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || 'Ödeme başlatılırken bir hata oluştu');
        } else {
          toast.error('Beklenmeyen bir hata oluştu');
        }
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    createPayment();
  }, []); // Boş dependency array

  // Component unmount olduğunda script'i ve reservationId'yi temizle
  useEffect(() => {
    return () => {
      const script = document.querySelector('script[src*="iyzipay"]');
      if (script) {
        script.remove();
      }
      localStorage.removeItem('reservationId');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Ödeme sayfası yükleniyor...</p>
          </div>
        ) : (
          <>
            {paymentStatus === 'pending' && (
              <>
                <div dangerouslySetInnerHTML={{ __html: paymentHtml }} />
                {reservationId && (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Rezervasyon ID: {reservationId}
                  </div>
                )}
              </>
            )}
            {paymentStatus === 'success' && (
              <div className="text-center text-green-600">
                <h2 className="text-2xl font-bold mb-4">Ödeme Başarılı!</h2>
                <p>Rezervasyonunuz başarıyla tamamlandı.</p>
                <p className="mt-2">Rezervasyon sayfasına yönlendiriliyorsunuz...</p>
              </div>
            )}
            {paymentStatus === 'error' && (
              <div className="text-center text-red-600">
                <h2 className="text-2xl font-bold mb-4">Ödeme Başarısız</h2>
                <p>Ödeme işlemi sırasında bir hata oluştu.</p>
                <button 
                  onClick={() => navigate(-1)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Tekrar Dene
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Payment; 