import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy, Check, Search, Calendar, UserCheck, Shield } from 'lucide-react';
import { fetchAllReservations, Beds24Reservation } from '@/lib/beds24';

export default function BackofficeReservations() {
  const [reservations, setReservations] = useState<Beds24Reservation[]>([]);
  const [filterSource, setFilterSource] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllReservations().then(setReservations);
  }, []);

  const filtered = reservations.filter((r) => {
    if (filterSource === 'all') return true;
    if (filterSource === 'Direct') return r.source === 'Direct';
    return r.source !== 'Direct';
  });

  const copyGuestLink = (bookingId: string) => {
    const url = `${window.location.origin}/guest/${bookingId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(bookingId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Gestion des Réservations Beds24</h1>
            <p className="text-xs text-slate-500 font-medium">Routage automatique Direct (Contrat) vs OTA (Airbnb / Booking)</p>
          </div>
          <Link to="/backoffice/dashboard">
            <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-xl">
              ← Retour Dashboard
            </Button>
          </Link>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setFilterSource('all')}
            className={filterSource === 'all' ? 'bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-sm' : 'bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-xl'}
          >
            Toutes les réservations ({reservations.length})
          </Button>
          <Button
            size="sm"
            onClick={() => setFilterSource('Direct')}
            className={filterSource === 'Direct' ? 'bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-sm' : 'bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-xl'}
          >
            Directes (Contrat Exigé)
          </Button>
          <Button
            size="sm"
            onClick={() => setFilterSource('OTA')}
            className={filterSource === 'OTA' ? 'bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-sm' : 'bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-xl'}
          >
            Plateformes OTA (Airbnb / Booking)
          </Button>
        </div>

        {/* Reservation List */}
        <div className="space-y-4">
          {filtered.map((res) => (
            <Card key={res.bookingId} className="bg-white border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{res.guestName}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      res.source === 'Direct'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {res.source}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    ID Beds24 : <span className="font-mono text-indigo-600 font-bold">{res.bookingId}</span> | {res.guestEmail} | {res.guestPhone}
                  </p>
                  <p className="text-xs text-slate-700 font-medium">
                    Période du séjour : <strong className="text-slate-900">{res.checkIn}</strong> au <strong className="text-slate-900">{res.checkOut}</strong> ({res.numberOfGuests} personnes - {res.totalAmount} €)
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyGuestLink(res.bookingId)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl"
                  >
                    {copiedId === res.bookingId ? (
                      <span className="flex items-center text-emerald-600 font-bold"><Check className="w-3.5 h-3.5 mr-1" /> Lien Copié</span>
                    ) : (
                      <span className="flex items-center"><Copy className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Copier Lien Guest App</span>
                    )}
                  </Button>

                  <Link to={`/guest/${res.bookingId}`} target="_blank">
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/20 w-full">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> Ouvrir Portail Client PWA
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
