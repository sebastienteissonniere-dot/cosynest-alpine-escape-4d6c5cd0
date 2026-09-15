import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Copy, Check, Lock } from 'lucide-react';
import { fetchAllReservations, Beds24Reservation } from '@/lib/beds24';

export default function BackofficeIgloohomeKeys() {
  const [reservations, setReservations] = useState<Beds24Reservation[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllReservations().then(setReservations);
  }, []);

  const copyPin = (pin: string, id: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Gestionnaire des Serrures & Boîtes à Clés Igloohome</h1>
            <p className="text-xs text-slate-500 font-medium">Contrôle des codes d'accès temporaires générés pour chaque séjour</p>
          </div>
          <Link to="/backoffice/dashboard">
            <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl">
              ← Retour Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservations.map((res) => (
            <Card key={res.bookingId} className="bg-white border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="py-4 px-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-indigo-600" />
                    <CardTitle className="text-base font-bold text-slate-900">{res.guestName}</CardTitle>
                  </div>
                  <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 font-semibold">
                    {res.bookingId}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-3">
                <p className="text-xs text-slate-600 font-medium">
                  Dates de validité du code : <strong className="text-slate-900">{res.checkIn} 16:00</strong> ➔ <strong className="text-slate-900">{res.checkOut} 10:00</strong>
                </p>

                <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
                    <span>Digicode Serrure Principale (Igloohome)</span>
                    <span className="text-[10px] text-indigo-700 font-bold bg-white px-2 py-0.5 rounded-full border border-indigo-200">OTP Algorithmique</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-extrabold text-indigo-700 tracking-wider">
                      {res.igloohomePinCode || '849201'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyPin(res.igloohomePinCode || '849201', res.bookingId)}
                      className="text-indigo-600 hover:bg-indigo-100 text-xs font-semibold rounded-lg"
                    >
                      {copiedId === res.bookingId ? (
                        <span className="flex items-center text-emerald-600 font-bold"><Check className="w-3.5 h-3.5 mr-1" /> Copié</span>
                      ) : (
                        <span className="flex items-center"><Copy className="w-3.5 h-3.5 mr-1" /> Copier PIN</span>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
                    <span>Boîte à clés mécanique de secours</span>
                    <span className="text-[10px] text-slate-500 font-medium">Accès Physique</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-bold text-slate-800">
                      {res.igloohomeKeyboxCode || '3940'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
