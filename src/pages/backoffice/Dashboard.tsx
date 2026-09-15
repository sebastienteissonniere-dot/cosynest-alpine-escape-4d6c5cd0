import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  FileCheck,
  Shield,
  Key,
  LogOut,
  ExternalLink,
  RefreshCw,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAllReservations, Beds24Reservation } from '@/lib/beds24';

export default function BackofficeDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Beds24Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllReservations().then((data) => {
      setReservations(data);
      setLoading(false);
    });
  }, []);

  const directBookings = reservations.filter((r) => r.source === 'Direct');
  const signedContracts = reservations.filter((r) => r.contractSigned);
  const authorizedDeposits = reservations.filter((r) => r.depositStatus === 'authorized');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Header with typography logo Chalet Cosynest */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold text-slate-900 tracking-tight">Chalet Cosynest</h1>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Backoffice Beds24
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Connecté : <span className="text-slate-800 font-semibold">{user?.name}</span> ({user?.role})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/guest/demo" target="_blank">
              <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-indigo-600" /> Tester Guest App PWA
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                logout();
                navigate('/backoffice/login');
              }}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-1" /> Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center gap-1">
          <Link to="/backoffice/dashboard">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm">
              Dashboard
            </Button>
          </Link>
          <Link to="/backoffice/reservations">
            <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium rounded-xl">
              Réservations Beds24
            </Button>
          </Link>
          <Link to="/backoffice/inventories">
            <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium rounded-xl">
              États des Lieux
            </Button>
          </Link>
          <Link to="/backoffice/igloohome-keys">
            <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium rounded-xl">
              Serrures Igloohome
            </Button>
          </Link>
        </div>

        {/* ChargeAutomation Metrics KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Réservations Beds24</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{reservations.length}</p>
                <p className="text-[11px] text-indigo-600 font-semibold mt-1">
                  {directBookings.length} Directes • {reservations.length - directBookings.length} OTA
                </p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                <Calendar className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contrats Signés</p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">{signedContracts.length}</p>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">Conformité eIDAS PDF</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                <FileCheck className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cautions Swikly</p>
                <p className="text-3xl font-extrabold text-amber-600 mt-1">{authorizedDeposits.length}</p>
                <p className="text-[11px] text-amber-700 font-semibold mt-1">Empreintes bloquées</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                <Shield className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Codes Igloohome</p>
                <p className="text-3xl font-extrabold text-sky-600 mt-1">{reservations.length}</p>
                <p className="text-[11px] text-sky-700 font-semibold mt-1">Générés & Synchro</p>
              </div>
              <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl border border-sky-100">
                <Key className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Reservation Table ChargeAutomation style */}
        <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" /> Suivi Automatisé des Séjours
            </CardTitle>
            <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 text-xs font-semibold rounded-xl bg-white">
              <RefreshCw className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Synchro Beds24
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Dates Séjour</th>
                    <th className="py-3 px-4">Contrat</th>
                    <th className="py-3 px-4">Identité</th>
                    <th className="py-3 px-4">Caution Swikly</th>
                    <th className="py-3 px-4">Code Igloohome</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reservations.map((r) => (
                    <tr key={r.bookingId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {r.guestName}
                        <span className="block text-[10px] font-medium text-slate-400">{r.bookingId}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          r.source === 'Direct'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {r.source}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {r.checkIn} ➔ {r.checkOut}
                      </td>
                      <td className="py-3.5 px-4">
                        {r.contractSigned ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Signé
                          </span>
                        ) : r.requiresContract ? (
                          <span className="inline-flex items-center gap-1 text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-full text-[11px] border border-red-200">
                            <AlertCircle className="w-3 h-3 text-red-600" /> Requis
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">OTA (Inclus)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {r.identityVerified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200">
                            ✓ Gemini IA
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full text-[11px] border border-amber-200">
                            En attente
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {r.depositStatus === 'authorized' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200">
                            ✓ {r.depositAmount} €
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full text-[11px] border border-amber-200">
                            {r.depositAmount} €
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-indigo-700 font-extrabold text-sm">
                        {r.igloohomePinCode || 'Généré'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/guest/${r.bookingId}`} target="_blank">
                          <Button size="sm" variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-xs font-semibold py-1 h-7 rounded-lg">
                            Portail Guest <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
