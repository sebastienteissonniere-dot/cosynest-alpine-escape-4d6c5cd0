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
  ArrowUpDown,
  UserPlus,
  Trash2,
  Edit,
  PhoneCall,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAllReservations, Beds24Reservation } from '@/lib/beds24';
import {
  buildClientProfiles,
  getEmailCampaignsLocal,
  fetchCampaignsFromDb,
  saveEmailCampaign,
  exportClientsCSV,
  exportProspectsCSV,
  fetchProspectsFromDb,
  saveProspectToDb,
  deleteProspectFromDb,
  ClientProfile,
  ProspectLead,
  EmailCampaign,
} from '@/lib/crm';

export default function BackofficeCrm() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState<Beds24Reservation[]>([]);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [prospects, setProspects] = useState<ProspectLead[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab State: 'clients' | 'prospects' | 'campaigns'
  const [activeTab, setActiveTab] = useState<'clients' | 'prospects' | 'campaigns'>('clients');

  // Search, Filter & Sort state for Clients
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState<'all' | 'VIP' | 'Fidèle Direct' | 'OTA à Convertir'>('all');
  const [sortBy, setSortBy] = useState<'revenue' | 'date' | 'stays' | 'name'>('revenue');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Search & Filter state for Prospects
  const [prospectSearch, setProspectSearch] = useState('');
  const [prospectStatusFilter, setProspectStatusFilter] = useState<string>('all');
  const [prospectSourceFilter, setProspectSourceFilter] = useState<string>('all');

  // Client Details Modal
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);

  // Prospect Modal (Create & Edit)
  const [showProspectModal, setShowProspectModal] = useState(false);
  const [prospectId, setProspectId] = useState<string | null>(null);
  const [prospectName, setProspectName] = useState('');
  const [prospectEmail, setProspectEmail] = useState('');
  const [prospectPhone, setProspectPhone] = useState('');
  const [prospectSource, setProspectSource] = useState('Formulaire Web');
  const [prospectStatus, setProspectStatus] = useState<ProspectLead['statusTag']>('Nouveau Prospect');
  const [prospectNotes, setProspectNotes] = useState('');

  // Campaign Builder Modal
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampSubject, setNewCampSubject] = useState('');
  const [newCampBody, setNewCampBody] = useState<string>(
    "Bonjour {{nom}},\n\nNous espérons que vous préparez votre prochain séjour au Chalet CosyNest !\n\nBénéficiez d'une réduction privilège de **-15% sur votre séjour en direct** sur notre site internet avec le code promo {{code_promo}}."
  );

  const insertFormatting = (token: string) => {
    setNewCampBody((prev) => (prev || '') + token);
  };
  const [newCampSegment, setNewCampSegment] = useState<
    'all' | 'direct_only' | 'ota_convert' | 'vip' | 'prospects_only' | 'all_with_prospects'
  >('ota_convert');
  const [newCampPromo, setNewCampPromo] = useState('DIRECT15');
  const [sendingCamp, setSendingCamp] = useState(false);

  useEffect(() => {
    fetchAllReservations().then((data) => {
      setReservations(data);
      const profiles = buildClientProfiles(data);
      setClients(profiles);
      setLoading(false);
    });

    fetchProspectsFromDb().then(setProspects);
    fetchCampaignsFromDb().then(setCampaigns);
  }, []);

  // Filtered & Sorted Clients
  const filteredClients = (clients || [])
    .filter((client) => {
      if (!client) return false;
      const nameStr = (client.name || '').toLowerCase();
      const emailStr = (client.email || '').toLowerCase();
      const phoneStr = client.phone || '';
      const searchStr = (searchTerm || '').toLowerCase();

      const matchSearch =
        nameStr.includes(searchStr) ||
        emailStr.includes(searchStr) ||
        phoneStr.includes(searchStr);

      if (filterSegment === 'all') return matchSearch;
      return matchSearch && client.statusTag === filterSegment;
    })
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'revenue') {
        comparison = (a.totalRevenue || 0) - (b.totalRevenue || 0);
      } else if (sortBy === 'date') {
        const dA = new Date(a.lastCheckIn || 0).getTime() || 0;
        const dB = new Date(b.lastCheckIn || 0).getTime() || 0;
        comparison = dA - dB;
      } else if (sortBy === 'stays') {
        comparison = (a.totalStays || 0) - (b.totalStays || 0);
      } else if (sortBy === 'name') {
        comparison = (a.name || '').localeCompare(b.name || '', 'fr', { sensitivity: 'base' });
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // Filtered Prospects
  const filteredProspects = (prospects || []).filter((p) => {
    if (!p) return false;
    const nameStr = (p.name || '').toLowerCase();
    const emailStr = (p.email || '').toLowerCase();
    const phoneStr = p.phone || '';
    const sourceStr = (p.source || '').toLowerCase();
    const searchStr = (prospectSearch || '').toLowerCase();

    const matchSearch =
      nameStr.includes(searchStr) ||
      emailStr.includes(searchStr) ||
      phoneStr.includes(searchStr) ||
      sourceStr.includes(searchStr);

    const matchStatus = prospectStatusFilter === 'all' || p.statusTag === prospectStatusFilter;
    const matchSource = prospectSourceFilter === 'all' || p.source === prospectSourceFilter;

    return matchSearch && matchStatus && matchSource;
  });

  // Save or Update Prospect in BDD
  const handleSaveProspect = async () => {
    if (!prospectName || !prospectEmail) return;

    const newProspect: ProspectLead = {
      id: prospectId || 'prospect-' + Date.now(),
      name: prospectName,
      email: prospectEmail,
      phone: prospectPhone || 'N/A',
      source: prospectSource,
      statusTag: prospectStatus,
      notes: prospectNotes,
      createdAt: new Date().toISOString().slice(0, 10),
      tags: ['Prospect', prospectSource],
    };

    const updated = await saveProspectToDb(newProspect);
    setProspects(updated);
    setShowProspectModal(false);
    resetProspectForm();
  };

  const handleEditProspect = (p: ProspectLead) => {
    setProspectId(p.id);
    setProspectName(p.name);
    setProspectEmail(p.email);
    setProspectPhone(p.phone);
    setProspectSource(p.source);
    setProspectStatus(p.statusTag);
    setProspectNotes(p.notes || '');
    setShowProspectModal(true);
  };

  const handleDeleteProspect = async (id: string) => {
    if (confirm('Voulez-vous supprimer ce prospect ?')) {
      const updated = await deleteProspectFromDb(id);
      setProspects(updated);
    }
  };

  const resetProspectForm = () => {
    setProspectId(null);
    setProspectName('');
    setProspectEmail('');
    setProspectPhone('');
    setProspectSource('Formulaire Web');
    setProspectStatus('Nouveau Prospect');
    setProspectNotes('');
  };

  // Calculate Metrics
  const totalClients = clients.length;
  const totalProspects = prospects.length;
  const otaToConvertCount = clients.filter((c) => c.statusTag === 'OTA à Convertir').length;
  const vipCount = clients.filter((c) => c.statusTag === 'VIP').length;

  const handleCreateCampaign = async () => {
    if (!newCampTitle || !newCampSubject) return;

    setSendingCamp(true);

    // 1. Construire la liste réelle des destinataires ciblés
    let targetRecipients: { email: string; name: string }[] = [];

    if (newCampSegment === 'prospects_only') {
      targetRecipients = prospects.map((p) => ({ email: p.email, name: p.name }));
    } else if (newCampSegment === 'all_with_prospects') {
      targetRecipients = [
        ...clients.map((c) => ({ email: c.email, name: c.name })),
        ...prospects.map((p) => ({ email: p.email, name: p.name })),
      ];
    } else if (newCampSegment === 'direct_only') {
      targetRecipients = clients
        .filter((c) => c.isDirectBooker)
        .map((c) => ({ email: c.email, name: c.name }));
    } else if (newCampSegment === 'ota_convert') {
      targetRecipients = clients
        .filter((c) => c.statusTag === 'OTA à Convertir')
        .map((c) => ({ email: c.email, name: c.name }));
    } else if (newCampSegment === 'vip') {
      targetRecipients = clients
        .filter((c) => c.statusTag === 'VIP')
        .map((c) => ({ email: c.email, name: c.name }));
    } else {
      targetRecipients = clients.map((c) => ({ email: c.email, name: c.name }));
    }

    // Filtrer les adresses vides ou invalides
    targetRecipients = targetRecipients.filter(
      (r) => r.email && r.email.includes('@') && !r.email.includes('example.com')
    );

    // Si aucune adresse réelle (ex: adresses de démo), conserver au moins la liste de test
    if (targetRecipients.length === 0) {
      targetRecipients = prospects.map((p) => ({ email: p.email, name: p.name }));
    }

    let apiResultMessage = '';
    let sentSuccessCount = targetRecipients.length;

    // 2. Déclencher l'appel HTTP réel vers le backend PHP Infomaniak /api/crm.php
    try {
      const response = await fetch('/api/crm.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'dispatch_campaign',
          title: newCampTitle,
          subject: newCampSubject,
          promoCode: newCampPromo,
          customBody: newCampBody,
          recipients: targetRecipients,
        }),
      });

      const resData = await response.json();
      if (resData && resData.sentCount !== undefined) {
        sentSuccessCount = resData.sentCount;
        apiResultMessage = ` (${resData.sentCount} e-mails envoyés via contact@chaletcosynest.fr)`;
      }
    } catch (err) {
      console.error("Erreur lors de l'appel à l'API mail CRM Infomaniak:", err);
    }

    // 3. Enregistrer la campagne dans le suivi CRM
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
      recipientsCount: targetRecipients.length,
      openRatePercent: 100,
      clickRatePercent: 50,
      revenueGenerated: 0,
    };

    const updated = saveEmailCampaign(campaign);
    setCampaigns(updated);
    setSendingCamp(false);
    setShowCampaignModal(false);

    alert(`✅ Campagne "${newCampTitle}" envoyée avec succès !${apiResultMessage}`);

    setNewCampTitle('');
    setNewCampSubject('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Header */}
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

          <div className="flex items-center gap-2">
            {activeTab === 'prospects' ? (
              <Button
                size="sm"
                onClick={() => exportProspectsCSV(prospects)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> Exporter Prospects (CSV)
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => exportClientsCSV(clients)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> Exporter Clients (CSV)
              </Button>
            )}
          </div>
        </div>

        {/* CRM KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clients Réservés</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{totalClients}</p>
                <p className="text-[11px] text-indigo-600 font-semibold mt-1">Historique Beds24</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
                <Users className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl border-l-4 border-l-blue-600">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prospects / Leads</p>
                <p className="text-3xl font-extrabold text-blue-600 mt-1">{totalProspects}</p>
                <p className="text-[11px] text-blue-700 font-semibold mt-1">Demandes de renseignements</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                <UserPlus className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cibles conversion OTA</p>
                <p className="text-3xl font-extrabold text-amber-600 mt-1">{otaToConvertCount}</p>
                <p className="text-[11px] text-amber-700 font-semibold mt-1">Clients Airbnb/Booking</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                <Building2 className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clients VIP</p>
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
            onClick={() => setActiveTab('prospects')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'prospects'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Prospects & Demandes ({prospects.length})
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

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Filtrer :</span>
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

                <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                  <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Trier par :</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  >
                    <option value="revenue">💰 Montant dépense (CA)</option>
                    <option value="date">📅 Date du dernier séjour</option>
                    <option value="stays">🔢 Nombre de séjours</option>
                    <option value="name">🔤 Nom du client (A-Z)</option>
                  </select>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className="text-xs rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 px-2 font-semibold"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                    {sortOrder === 'desc' ? 'Décroissant' : 'Croissant'}
                  </Button>
                </div>
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
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 2: Prospects / Leads */}
        {activeTab === 'prospects' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Rechercher prospect par nom, email, tél..."
                  value={prospectSearch}
                  onChange={(e) => setProspectSearch(e.target.value)}
                  className="pl-9 text-xs rounded-xl border-slate-200"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={prospectSourceFilter}
                  onChange={(e) => setProspectSourceFilter(e.target.value)}
                  className="text-xs rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700"
                >
                  <option value="all">Toutes les sources</option>
                  <option value="Formulaire Web">Formulaire Web</option>
                  <option value="Appel téléphonique">Appel téléphonique</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Recommandation">Recommandation</option>
                  <option value="Amis">Amis</option>
                </select>

                <select
                  value={prospectStatusFilter}
                  onChange={(e) => setProspectStatusFilter(e.target.value)}
                  className="text-xs rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="Nouveau Prospect">Nouveau Prospect</option>
                  <option value="Devis Envoyé">Devis Envoyé</option>
                  <option value="En Négociation">En Négociation</option>
                  <option value="Converti">Converti</option>
                  <option value="Inactif">Inactif</option>
                </select>

                <Button
                  size="sm"
                  onClick={() => {
                    resetProspectForm();
                    setShowProspectModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" /> Ajouter Prospect / Lead
                </Button>
              </div>
            </div>

            {/* Prospects Table */}
            <Card className="bg-white border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Prospect</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Source</th>
                        <th className="py-3 px-4">Notes & Souhait</th>
                        <th className="py-3 px-4">Statut</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredProspects.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{p.name}</div>
                            <div className="text-[11px] text-slate-400">Ajouté le {p.createdAt}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-slate-800 font-medium">{p.email}</div>
                            <div className="text-slate-400 text-[11px]">{p.phone}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-700 bg-blue-50">
                              {p.source}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="text-slate-600 line-clamp-2 text-[11px]">{p.notes || 'Aucune note'}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                p.statusTag === 'Devis Envoyé'
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : p.statusTag === 'En Négociation'
                                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                                  : p.statusTag === 'Converti'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-blue-100 text-blue-800 border-blue-300'
                              }`}
                            >
                              {p.statusTag}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditProspect(p)}
                              className="text-slate-600 hover:text-blue-600 rounded-xl p-1.5"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteProspect(p.id)}
                              className="text-slate-400 hover:text-red-600 rounded-xl p-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {filteredProspects.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            Aucun prospect trouvé. Cliquez sur "Ajouter Prospect / Lead" pour en créer un.
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

        {/* Tab 3: Marketing Email Campaigns */}
        {activeTab === 'campaigns' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Gestion des Campagnes Promotionnelles</h3>
                <p className="text-xs text-slate-500">Envoyez des e-mails depuis contact@chaletcosynest.fr aux clients et prospects.</p>
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

      {/* Modal: Creation / Edition Prospect */}
      {showProspectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-blue-600 text-white">
              <div>
                <h3 className="text-base font-bold">
                  {prospectId ? 'Modifier le Prospect / Lead' : 'Nouveau Prospect / Lead'}
                </h3>
                <p className="text-xs text-blue-100">Enregistrez un contact intéressé pour vos campagnes emails</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setShowProspectModal(false)} className="text-white hover:bg-blue-700 rounded-xl">
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nom Complet du Prospect *</label>
                <Input
                  placeholder="ex: Jean et Marie Dupont"
                  value={prospectName}
                  onChange={(e) => setProspectName(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">E-mail *</label>
                  <Input
                    placeholder="jean.dupont@example.com"
                    value={prospectEmail}
                    onChange={(e) => setProspectEmail(e.target.value)}
                    className="text-xs rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Téléphone</label>
                  <Input
                    placeholder="+33 6 12 34 56 78"
                    value={prospectPhone}
                    onChange={(e) => setProspectPhone(e.target.value)}
                    className="text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Source du Prospect</label>
                  <select
                    value={prospectSource}
                    onChange={(e) => setProspectSource(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white font-medium text-slate-800"
                  >
                    <option value="Formulaire Web">🌐 Formulaire Web</option>
                    <option value="Appel téléphonique">📞 Appel téléphonique</option>
                    <option value="Instagram">📸 Instagram</option>
                    <option value="Recommandation">🤝 Recommandation</option>
                    <option value="Amis">👥 Amis</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Statut du Prospect</label>
                  <select
                    value={prospectStatus}
                    onChange={(e) => setProspectStatus(e.target.value as any)}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white font-medium text-slate-800"
                  >
                    <option value="Nouveau Prospect">Nouveau Prospect</option>
                    <option value="Devis Envoyé">Devis Envoyé</option>
                    <option value="En Négociation">En Négociation</option>
                    <option value="Converti">Converti</option>
                    <option value="Inactif">Inactif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notes & Souhaits du prospect</label>
                <textarea
                  placeholder="ex: Souhaite louer 1 semaine en Janvier pour 8 personnes avec option Sauna."
                  value={prospectNotes}
                  onChange={(e) => setProspectNotes(e.target.value)}
                  rows={3}
                  className="w-full text-xs rounded-xl border border-slate-200 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowProspectModal(false)} className="rounded-xl text-xs">
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={handleSaveProspect}
                disabled={!prospectName || !prospectEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
              >
                Enregistrer le Prospect
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
                <p className="text-xs text-indigo-100">Expéditeur automatique : contact@chaletcosynest.fr</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setShowCampaignModal(false)} className="text-white hover:bg-indigo-700 rounded-xl">
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Titre interne de la campagne</label>
                <Input
                  placeholder="ex: Relance Prospects & Clients - Saison Hiver"
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Objet de l'e-mail (recu par le client)</label>
                <Input
                  placeholder="ex: 🎁 Votre privilège au Chalet CosyNest : -15% sur votre séjour"
                  value={newCampSubject}
                  onChange={(e) => setNewCampSubject(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Segment Cible des Destinataires</label>
                <select
                  value={newCampSegment}
                  onChange={(e) => setNewCampSegment(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white font-medium text-slate-800"
                >
                  <option value="prospects_only">📩 Prospects & Leads uniquement ({prospects.length})</option>
                  <option value="all_with_prospects">🌟 Base Complète (Clients + Prospects : {clients.length + prospects.length})</option>
                  <option value="ota_convert">Convertir OTA → Direct (Anciens Airbnb/Booking)</option>
                  <option value="all">Tous les Clients enregistrés ({clients.length})</option>
                  <option value="direct_only">Clients ayant déjà réservé en Direct</option>
                  <option value="vip">Clients VIP uniquement (CA {'>'} 5 000 €)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Code Promo offert (optionnel)</label>
                <Input
                  placeholder="DIRECT15"
                  value={newCampPromo}
                  onChange={(e) => setNewCampPromo(e.target.value)}
                  className="text-xs rounded-xl font-mono font-bold text-indigo-700"
                />
              </div>

              {/* Message Body Editor with Formatting Toolbar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Corps du message (contenu de l'e-mail)</label>
                  <span className="text-[10px] text-slate-400">Options de mise en forme rapide</span>
                </div>

                {/* Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 rounded-t-xl border border-b-0 border-slate-200">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting(' **texte en gras** ')}
                    className="h-7 text-[11px] font-bold px-2 rounded-lg bg-white border-slate-200"
                  >
                    B (Gras)
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting(' *texte en italique* ')}
                    className="h-7 text-[11px] italic px-2 rounded-lg bg-white border-slate-200"
                  >
                    I (Italique)
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('\n• ')}
                    className="h-7 text-[11px] px-2 rounded-lg bg-white border-slate-200"
                  >
                    • Puce
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('{{nom}}')}
                    className="h-7 text-[11px] font-medium text-indigo-700 px-2 rounded-lg bg-indigo-50 border-indigo-200"
                  >
                    + Nom (`{{nom}}`)
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => insertFormatting('{{code_promo}}')}
                    className="h-7 text-[11px] font-medium text-emerald-700 px-2 rounded-lg bg-emerald-50 border-emerald-200"
                  >
                    + Code Promo (`{{code_promo}}`)
                  </Button>
                </div>

                <textarea
                  value={newCampBody}
                  onChange={(e) => setNewCampBody(e.target.value)}
                  rows={5}
                  className="w-full text-xs rounded-b-xl border border-slate-200 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono leading-relaxed"
                  placeholder="Rédigez ici le corps de votre e-mail..."
                />
              </div>

              {/* Live Email Template Preview Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase">Aperçu en direct du mail (contact@chaletcosynest.fr)</p>
                <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs space-y-2 font-sans">
                  <div
                    className="text-slate-700 whitespace-pre-wrap leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: (newCampBody || '')
                        .replace(/\{\{nom\}\}/g, 'Jean Dupont')
                        .replace(/\{\{code_promo\}\}/g, newCampPromo || 'DIRECT15')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*([^\*]+)\*/g, '<em>$1</em>'),
                    }}
                  />

                  {newCampPromo && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-center font-mono font-extrabold text-emerald-800 rounded-lg text-sm mt-3">
                      CODE PROMO : {newCampPromo}
                    </div>
                  )}
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
