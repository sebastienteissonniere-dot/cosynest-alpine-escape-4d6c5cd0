import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { fetchAllReservations, Beds24Reservation, updateReservationState } from '@/lib/beds24';

export default function BackofficeInventories() {
  const [reservations, setReservations] = useState<Beds24Reservation[]>([]);

  useEffect(() => {
    fetchAllReservations().then(setReservations);
  }, []);

  const handleReleaseDeposit = (bookingId: string) => {
    updateReservationState(bookingId, { depositStatus: 'released' }).then(() => {
      fetchAllReservations().then(setReservations);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Gestion des États des Lieux (Entrée / Sortie)</h1>
            <p className="text-xs text-slate-500 font-medium">Inspection conciergerie, photos de réserves & restitution des cautions Swikly</p>
          </div>
          <Link to="/backoffice/dashboard">
            <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl">
              ← Retour Dashboard
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {reservations.map((res) => (
            <Card key={res.bookingId} className="bg-white border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="py-4 px-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-indigo-600" />
                    <CardTitle className="text-base font-bold text-slate-900">{res.guestName}</CardTitle>
                    <span className="text-xs text-slate-400 font-mono">({res.bookingId})</span>
                  </div>
                  <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 font-semibold">
                    Séjour du {res.checkIn} au {res.checkOut}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* état des lieux d'entrée */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>État des Lieux d'Entrée</span>
                      {res.checkInInventoryDone ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Validé par le voyageur</span>
                      ) : (
                        <span className="text-amber-600 font-semibold">En attente d'arrivée</span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Vérification du Jacuzzi, Sauna, mobilier séjour, râteliers skis et chambres.
                    </p>
                  </div>

                  {/* état des lieux de sortie */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>État des Lieux de Sortie</span>
                      {res.checkOutInventoryDone ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Contrôle Concierge OK</span>
                      ) : (
                        <span className="text-slate-400 font-medium">En attente de départ</span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Inspection post-départ comparée à l'état initial.
                    </p>
                  </div>
                </div>

                {/* Gestion Caution */}
                <div className="flex items-center justify-between bg-slate-100/70 p-3.5 rounded-xl border border-slate-200 text-xs font-medium">
                  <div>
                    <span className="text-slate-600">Statut Caution ({res.depositAmount} €) : </span>
                    <strong className={res.depositStatus === 'authorized' ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                      {res.depositStatus === 'authorized' ? 'Empreinte Active (Swikly)' : 'Caution Libérée'}
                    </strong>
                  </div>

                  {res.depositStatus === 'authorized' && (
                    <Button
                      size="sm"
                      onClick={() => handleReleaseDeposit(res.bookingId)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Libérer la caution
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
