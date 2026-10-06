import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Mail,
  Send,
  Download,
  Search,
  Calendar,
  Sparkles,
  ChevronRight,
  LogOut,
  ExternalLink,
  Plus,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  Building2,
  Tag,
  Eye,
  Filter,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAllReservations, Beds24Reservation } from '@/lib/beds24';
import {
  buildClientProfiles,
  getEmailCampaigns,
  saveEmailCampaign,
  exportClientsCSV,
  ClientProfile,
  EmailCampaign,
} from '@/lib/crm';

export default function BackofficeCrm() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState<Beds24Reservation[]>([]);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab State: 'clients' | 'campaigns'
  const [activeTab, setActiveTab] = useState<'clients' | 'campaigns'>('clients');

  // Search & Filter state for Clients
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState<'all' | 'VIP' | 'Fidèle Direct' | 'OTA à Convertir'>('all');

  // Client Details Modal
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);

  // Campaign Builder Modal
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampSubject, setNewCampSubject] = useState('');
  const [newCampSegment, setNewCampSegment] = useState<'all' | 'direct_only' | 'ota_convert' | 'vip'>('ota_convert');
  const [newCampPromo, setNewCampPromo] = useState('DIRECT15');
  const [sendingCamp, setSendingCamp] = useState(false);

  useEffect(() => {
    fetchAllReservations().then((data) => {
      setReservations(data);
      const profiles = buildClientProfiles(data);
      setClients(profiles);
      setCampaigns(getEmailCampaigns());
      setLoading(false);
    });
  }, []);

  // Filtered Clients
  const filteredClients = clients.filter((client) => {
    const matchSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);

    if (filterSegment === 'all') return matchSearch;
    return matchSearch && client.statusTag === filterSegment;
  });

  // Calculate Metrics
  const totalClients = clients.length;
  const otaToConvertCount = clients.filter((c) => c.statusTag === 'OTA à Convertir').length;
  const vipCount = clients.filter((c) => c.statusTag === 'VIP').length;

  const handleCreateCampaign = () => {
    if (!newCampTitle || !newCampSubject) return;

    setSendingCamp(true);
    setTimeout(() => {
      // Calculate target recipients
      let targetCount = clients.length;
      if (newCampSegment === 'direct_only') {
        targetCount = clients.filter((c) => c.isDirectBooker).length;
      } else if (newCampSegment === 'ota_convert') {
        targetCount = clients.filter((c) => c.statusTag === 'OTA à Convertir').length;
      } else if (newCampSegment === 'vip') {
        targetCount = clients.filter((c) => c.statusTag === 'VIP').length;
      }

      const campaign: EmailCampaign = {
        id: 'camp-' + Date.now(),
        title: newCampTitle,
        subject: newCampSubject,
        targetSegment: newCampSegment,
        templateId: 'promo_15_direct',
        promoCode: newCampPromo,
        status: 'sent',
        createdDate: new Date().toISOString().slice(0, 10),
        sentDate: new Date().toISOString().slice(0, 10),
        recipientsCount: targetCount,
        openRatePercent: 72,
        clickRatePercent: 45,
        revenueGenerated: Math.round(targetCount * 180),
      };

      const updated = saveEmailCampaign(campaign);
      setCampaigns(updated);
      setSendingCamp(false);
      setShowCampaignModal(false);
      setNewCampTitle('');
      setNewCampSubject('');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold text-slate-900 tracking-tight">Chalet Cosynest</h1>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                CRM & Marketing Emails
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Link to="/backoffice/dashboard">
              <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium rounded-xl">
                Dashboard
              </Button>
            </Link>
            <Link to="/backoffice/reservations">
              <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium rounded-xl">
                Réservations Beds24
              </Button>
            </Link>
            <Link to="/backoffice/igloohome-keys">
              <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium rounded-xl">
                Serrures Igloohome
              </Button>
            </Link>
            <Link to="/backoffice/crm">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm">
                CRM & Campagnes
              </Button>
            </Link>
          </div>

          <Button
            size="sm"
            onClick={() => exportClientsCSV(clients)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Exporter Clients (CSV)
          </Button>
        </div>

        {/* CRM KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clients Uniques</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{totalClients}</p>
                <p className="text-[11px] text-indigo-600 font-semibold mt-1">Base de données qualifiée</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                <Users className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cibles conversion OTA</p>
                <p className="text-3xl font-extrabold text-amber-600 mt-1">{otaToConvertCount}</p>
                <p className="text-[11px] text-amber-700 font-semibold mt-1">Anciens clients Airbnb/Booking</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                <Building2 className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clients VIP / Fidèles</p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">{vipCount}</p>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">CA {'>'} 5 000 € ou 3+ séjours</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                <Sparkles className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('clients')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'clients'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Fiches & Historique Clients ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'campaigns'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Campagnes E-mails Marketing ({campaigns.length})
          </button>
        </div>

        {/* Tab 1: Clients Directory */}
        {activeTab === 'clients' && (
          <div className="space-y-4">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Rechercher par nom, email, tél..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-xs rounded-xl border-slate-200"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Filtrer par :</span>
                {(['all', 'VIP', 'Fidèle Direct', 'OTA à Convertir'] as const).map((seg) => (
                  <Button
                    key={seg}
                    size="sm"
                    variant={filterSegment === seg ? 'default' : 'outline'}
                    onClick={() => setFilterSegment(seg)}
                    className={`text-xs rounded-xl font-medium ${
                      filterSegment === seg
                        ? 'bg-indigo-600 text-white'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {seg === 'all' ? 'Tous' : seg}
                  </Button>
                ))}
              </div>
            </div>

            {/* Clients Table */}
            <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Séjours</th>
                        <th className="py-3 px-4">CA Cumulé</th>
                        <th className="py-3 px-4">Dernier Séjour</th>
                        <th className="py-3 px-4">Statut CRM</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{client.name}</div>
                            <div className="flex items-center gap-1 mt-0.5">
                              {client.tags.map((t) => (
                                <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0 bg-slate-100 text-slate-600 font-normal">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-slate-800 font-medium">{client.email}</div>
                            <div className="text-slate-400 text-[11px]">{client.phone}</div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">
                            {client.totalStays} séjour{client.totalStays > 1 ? 's' : ''}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-600">
                            {user?.role === 'concierge' ? '•••• €' : `${client.totalRevenue.toLocaleString('fr-FR')} €`}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {new Date(client.lastCheckIn).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                client.statusTag === 'VIP'
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : client.statusTag === 'Fidèle Direct'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : client.statusTag === 'OTA à Convertir'
                                  ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {client.statusTag}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedClient(client)}
                              className="text-xs rounded-xl border-slate-200 text-indigo-600 hover:bg-indigo-50 font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" /> Fiche & Historique
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {filteredClients.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            Aucun client trouvé pour ce filtre.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 2: Marketing Email Campaigns */}
        {activeTab === 'campaigns' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Gestion des Campagnes Promotionnelles</h3>
                <p className="text-xs text-slate-500">Envoyez des offres ciblées pour inciter les voyageurs à réserver en direct.</p>
              </div>

              <Button
                size="sm"
                onClick={() => setShowCampaignModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Nouvelle Campagne E-mail
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map((camp) => (
                <Card key={camp.id} className="bg-white border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-row items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`text-[10px] uppercase font-bold rounded-md ${
                            camp.status === 'sent'
                              ? 'bg-emerald-100 text-emerald-800'
                              : camp.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {camp.status === 'sent' ? 'Envoyée' : camp.status === 'scheduled' ? 'Planifiée' : 'Brouillon'}
                        </Badge>
                        <span className="text-[11px] text-slate-400">{camp.createdDate}</span>
                      </div>
                      <CardTitle className="text-base font-bold text-slate-900 mt-2">{camp.title}</CardTitle>
                    </div>

                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Mail className="w-5 h-5" />
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 space-y-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Objet du mail :</p>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">{camp.subject}</p>
                      {camp.promoCode && (
                        <div className="mt-2 inline-flex items-center gap-1 bg-indigo-100 text-indigo-900 text-xs px-2 py-0.5 rounded-lg font-mono font-bold">
                          Code Promo : {camp.promoCode}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Destinataires</p>
                        <p className="text-sm font-bold text-slate-800 mt-0.5">{camp.recipientsCount}</p>
                      </div>
                      <div className="bg-emerald-50 p-2 rounded-xl">
                        <p className="text-[10px] font-semibold text-emerald-600 uppercase">Tx Ouverture</p>
                        <p className="text-sm font-bold text-emerald-700 mt-0.5">{camp.openRatePercent || 0}%</p>
                      </div>
                      <div className="bg-indigo-50 p-2 rounded-xl">
                        <p className="text-[10px] font-semibold text-indigo-600 uppercase">Tx Clics</p>
                        <p className="text-sm font-bold text-indigo-700 mt-0.5">{camp.clickRatePercent || 0}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Drawer / Modal: Fiche Client & Historique chronologique */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedClient.name}</h3>
                <p className="text-xs text-slate-500">{selectedClient.email} • {selectedClient.phone}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedClient(null)} className="rounded-xl">
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Client Summary Metrics */}
              <div className="grid grid-cols-3 gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">Séjours au Chalet</p>
                  <p className="text-lg font-bold text-indigo-700">{selectedClient.totalStays}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">Total Dépensé (CA)</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {user?.role === 'concierge' ? '•••• €' : `${selectedClient.totalRevenue.toLocaleString('fr-FR')} €`}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">Statut CRM</p>
                  <Badge className="mt-1 bg-indigo-600 text-white text-[10px]">{selectedClient.statusTag}</Badge>
                </div>
              </div>

              {/* Chronological Booking History */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Historique Chronologique des Réservations ({selectedClient.bookings.length})
                </h4>

                <div className="space-y-3">
                  {selectedClient.bookings.map((booking) => (
                    <div key={booking.bookingId} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{booking.bookingId}</span>
                          <Badge variant="outline" className="text-[10px] font-medium border-slate-300">
                            {booking.source}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Du <span className="font-semibold text-slate-700">{booking.checkIn}</span> au{' '}
                          <span className="font-semibold text-slate-700">{booking.checkOut}</span> ({booking.numberOfGuests} personnes)
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-extrabold text-slate-900">
                          {user?.role === 'concierge' ? '•••• €' : `${booking.totalAmount} €`}
                        </p>
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 mt-1 inline-block">
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <Button size="sm" onClick={() => setSelectedClient(null)} className="rounded-xl bg-slate-800 text-white text-xs">
                Fermer la fiche
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Creation de Campagne Email */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-indigo-600 text-white">
              <div>
                <h3 className="text-base font-bold">Créer une Campagne E-mail</h3>
                <p className="text-xs text-indigo-100">Envoyez une promotion personnalisée à vos clients</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setShowCampaignModal(false)} className="text-white hover:bg-indigo-700 rounded-xl">
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Titre interne de la campagne</label>
                <Input
                  placeholder="ex: Relance Automne - Offre Spéciale Sauna"
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Objet de l'e-mail (recu par le client)</label>
                <Input
                  placeholder="ex: 🎁 Votre remise exclusive de -15% au Chalet CosyNest"
                  value={newCampSubject}
                  onChange={(e) => setNewCampSubject(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Segment Cible des Clients</label>
                <select
                  value={newCampSegment}
                  onChange={(e) => setNewCampSegment(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white font-medium text-slate-800"
                >
                  <option value="ota_convert">Convertir OTA → Direct (Anciens clients Airbnb/Booking)</option>
                  <option value="all">Tous les clients enregistrés ({clients.length})</option>
                  <option value="direct_only">Clients ayant déjà réservé en Direct</option>
                  <option value="vip">Clients VIP uniquement (CA {'>'} 5 000 €)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Code Promo offert</label>
                <Input
                  placeholder="DIRECT15"
                  value={newCampPromo}
                  onChange={(e) => setNewCampPromo(e.target.value)}
                  className="text-xs rounded-xl font-mono font-bold text-indigo-700"
                />
              </div>

              {/* Email Template Preview Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase">Aperçu dynamique du mail</p>
                <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs space-y-2">
                  <p className="font-semibold text-slate-900">Bonjour {"{{nom_client}}"},</p>
                  <p className="text-slate-600">
                    Nous espérons que vous gardez un excellent souvenir de votre séjour au Chalet CosyNest !
                  </p>
                  <p className="text-slate-600">
                    Pour votre prochain séjour, profitez d'un privilège exclusif de <strong>-15%</strong> en réservant directement sur notre site avec le code promo :
                  </p>
                  <div className="p-2.5 bg-indigo-50 border border-indigo-200 text-center font-mono font-extrabold text-indigo-700 rounded-lg text-sm">
                    {newCampPromo || 'VOTRE_CODE'}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowCampaignModal(false)} className="rounded-xl text-xs">
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={handleCreateCampaign}
                disabled={sendingCamp || !newCampTitle || !newCampSubject}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
              >
                {sendingCamp ? 'Envoi en cours...' : 'Envoyer la Campagne'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
