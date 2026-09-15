import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Key,
  FileText,
  UserCheck,
  Shield,
  MessageSquare,
  Home,
  Flame,
  Wifi,
  Sparkles,
  ClipboardCheck,
  Star,
  Download,
  Phone,
  Globe,
  Search,
  MapPin,
  Calendar,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchBeds24Reservation, Beds24Reservation, updateReservationState } from '@/lib/beds24';
import { ContractSigner } from '@/components/guest/ContractSigner';
import { IdentityVerification } from '@/components/guest/IdentityVerification';
import { DepositSecurity } from '@/components/guest/DepositSecurity';
import { IgloohomeKeyAccess } from '@/components/guest/IgloohomeKeyAccess';
import { InventoryInspector } from '@/components/guest/InventoryInspector';
import { WhatsAppConcierge } from '@/components/guest/WhatsAppConcierge';
import chaletRender from '@/assets/chalet-render-2027.jpg';
import { ReviewRedirect } from '@/components/guest/ReviewRedirect';

export default function GuestPortal() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { language, setLanguage, t } = useLanguage();
  const [reservation, setReservation] = useState<Beds24Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('access');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    fetchBeds24Reservation(bookingId || 'demo').then((data) => {
      setReservation(data);
      setLoading(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [bookingId]);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setShowInstallBanner(false);
      });
    }
  };

  const copyWifiPassword = () => {
    navigator.clipboard.writeText('AlpineLuxury2026!');
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2000);
  };

  const handleContractSigned = (signedAt: string) => {
    if (!reservation) return;
    updateReservationState(reservation.bookingId, {
      contractSigned: true,
      contractSignedAt: signedAt,
    }).then(setReservation);
  };

  const handleIdentityVerified = () => {
    if (!reservation) return;
    updateReservationState(reservation.bookingId, {
      identityVerified: true,
    }).then(setReservation);
  };

  const handleDepositAuthorized = () => {
    if (!reservation) return;
    updateReservationState(reservation.bookingId, {
      depositStatus: 'authorized',
    }).then(setReservation);
  };

  const handleCheckInComplete = () => {
    if (!reservation) return;
    updateReservationState(reservation.bookingId, {
      checkInInventoryDone: true,
      status: 'checked_in',
    }).then(setReservation);
  };

  const handleCheckOutComplete = () => {
    if (!reservation) return;
    updateReservationState(reservation.bookingId, {
      checkOutInventoryDone: true,
      status: 'checked_out',
    }).then(setReservation);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-900 flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-semibold">{t('weather.loading')}</p>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-stone-100 text-stone-900 flex items-center justify-center p-6 font-sans">
        <p className="text-red-600 font-bold">Réservation introuvable.</p>
      </div>
    );
  }

  const contractOk = !reservation.requiresContract || reservation.contractSigned;
  const depositOk = reservation.source === 'Airbnb' || reservation.depositStatus === 'authorized';
  const isUnlocked = contractOk && reservation.identityVerified && depositOk;

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans antialiased pb-20">
      {/* Touch Stay Header */}
      <header className="bg-white border-b border-stone-200/80 sticky top-0 z-40 shadow-xs px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-serif font-bold text-stone-900 tracking-tight">
              Chalet Cosynest
            </h1>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              Digital Guidebook
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher FR | EN */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1 rounded-full border border-stone-200 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>{language === 'fr' ? 'FR 🇫🇷' : 'EN 🇬🇧'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="bg-indigo-600 text-white px-4 py-2.5 flex items-center justify-between text-xs max-w-lg mx-auto shadow-sm">
          <span className="font-semibold flex items-center gap-1.5">
            <Download className="w-4 h-4" /> {t('guest.pwa.installPrompt')}
          </span>
          <Button size="sm" variant="secondary" onClick={handleInstallClick} className="text-xs h-7 bg-white text-stone-900 font-bold hover:bg-stone-100 rounded-lg">
            {t('guest.pwa.installBtn')}
          </Button>
        </div>
      )}

      {/* Touch Stay Hero Header Card */}
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <div className="relative rounded-3xl overflow-hidden shadow-md border border-stone-200 bg-white">
          <div className="h-44 bg-cover bg-center relative" style={{ backgroundImage: `url(${chaletRender})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <Badge className="bg-indigo-600 text-white border-none text-[10px] font-semibold mb-1">
                Vars 2000 • Hautes-Alpes
              </Badge>
              <h2 className="text-xl font-serif font-bold text-white leading-tight">Chalet Cosynest</h2>
              <p className="text-xs text-stone-200 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-indigo-400" /> Vars 05560, France
              </p>
            </div>
          </div>

          <div className="p-4 bg-white space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-stone-100 pb-3 text-stone-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <div>
                  <span className="block text-[10px] text-stone-400 font-bold uppercase">{t('guest.welcome')}</span>
                  <span className="font-bold text-stone-900">{reservation.guestName}</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                reservation.source === 'Direct' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {reservation.source}
              </span>
            </div>

            {/* Touch Stay Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'fr' ? 'Rechercher dans le livret (Wi-Fi, Spa, Code...)' : 'Search guidebook (Wi-Fi, Spa, Code...)'}
                className="bg-stone-50 border-stone-200 text-xs pl-9 rounded-xl focus:border-indigo-600 focus:ring-indigo-600/20"
              />
            </div>
          </div>
        </div>

        {/* BANDEAU DE NAVIGATION PAR SECTIONS (STICKY TOP BANNER) */}
        <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-stone-200/90 shadow-md">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none no-scrollbar">
            <button
              onClick={() => setActiveTab('access')}
              className={`flex-1 min-w-max px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'access'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/60'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{t('guest.tabs.access')} & Codes</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 min-w-max px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'manual'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/60'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t('guest.tabs.guide')} Chalet</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 min-w-max px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'inventory'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/60'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>{t('guest.tabs.inventory')}</span>
            </button>

            <button
              onClick={() => setActiveTab('concierge')}
              className={`flex-1 min-w-max px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'concierge'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Concierge & Avis</span>
            </button>
          </div>
        </div>

        {/* SECTION CONTENT BASED ON TOP BANNER */}
        <div className="space-y-4 pt-1">
          {/* SECTION 1: ACCÈS, CODES SERRURES & CONTRAT */}
          {activeTab === 'access' && (
            <div className="space-y-4">
              {reservation.requiresContract && (
                <ContractSigner reservation={reservation} onSigned={handleContractSigned} />
              )}

              <IdentityVerification
                guestName={reservation.guestName}
                isVerified={reservation.identityVerified}
                onVerified={handleIdentityVerified}
              />

              <DepositSecurity
                bookingId={reservation.bookingId}
                depositAmount={reservation.depositAmount}
                depositStatus={reservation.depositStatus}
                source={reservation.source}
                onDepositAuthorized={handleDepositAuthorized}
              />

              <IgloohomeKeyAccess
                bookingId={reservation.bookingId}
                checkInDate={reservation.checkIn}
                checkOutDate={reservation.checkOut}
                isUnlocked={isUnlocked}
              />
            </div>
          )}

          {/* SECTION 2: MANUEL & CONSIGNES DU CHALET */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              {/* Wi-Fi Card */}
              <Card className="bg-white border-stone-200/80 text-stone-900 rounded-2xl shadow-xs">
                <CardHeader className="py-3 flex flex-row items-center justify-between border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-indigo-600" />
                    <CardTitle className="text-sm font-bold text-stone-900">
                      {language === 'fr' ? 'Connexion Wi-Fi Haute Vitesse' : 'High-Speed Wi-Fi Connection'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-xs space-y-2 text-stone-700 pt-3">
                  <p><span className="text-stone-500 font-medium">{language === 'fr' ? 'Réseau :' : 'Network:'}</span> <strong className="text-stone-900 font-bold">CosyNest_5G_Chalet</strong></p>
                  <div className="flex items-center justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <div>
                      <span className="text-stone-400 text-[10px] block font-bold uppercase">{language === 'fr' ? 'Mot de passe' : 'Password'}</span>
                      <strong className="text-indigo-700 font-mono text-sm">AlpineLuxury2026!</strong>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyWifiPassword}
                      className="text-indigo-600 hover:bg-indigo-50 font-semibold text-xs"
                    >
                      {copiedWifi ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Jacuzzi & Sauna Card */}
              <Card className="bg-white border-stone-200/80 text-stone-900 rounded-2xl shadow-xs">
                <CardHeader className="py-3 flex flex-row items-center gap-2 border-b border-stone-100">
                  <Flame className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-sm font-bold text-stone-900">
                    {language === 'fr' ? 'Jacuzzi & Sauna Nordique' : 'Jacuzzi & Nordic Sauna'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2 text-stone-700 pt-3 font-medium">
                  <p>{language === 'fr' ? '• Le jacuzzi est préchauffé à 37.5°C pour votre arrivée.' : '• Jacuzzi is pre-heated to 37.5°C for your arrival.'}</p>
                  <p>{language === 'fr' ? '• Merci de remettre la couverture thermique après chaque utilisation.' : '• Please replace the thermal cover after each use.'}</p>
                  <p>{language === 'fr' ? '• Sauna : allumer le poêle 30 min avant utilisation via le boîtier mural.' : '• Sauna: turn on the heater 30 mins before use via the wall controller.'}</p>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card className="bg-white border-slate-200/80 text-slate-900 rounded-2xl shadow-xs">
                <CardHeader className="py-3 flex flex-row items-center gap-2 border-b border-slate-100">
                  <Phone className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-sm font-bold text-slate-900">
                    {language === 'fr' ? 'Contacts d\'Urgence' : 'Emergency Contacts'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-1 text-slate-700 pt-3 font-medium">
                  <p><span className="text-slate-500">{t('services.items.concierge')} :</span> +33 6 00 00 00 00</p>
                  <p><span className="text-slate-500">{language === 'fr' ? 'Secours Montagne :' : 'Mountain Rescue:'}</span> 112</p>
                  <p><span className="text-slate-500">{language === 'fr' ? 'Cabinet Médical :' : 'Medical Center:'}</span> +33 4 50 00 00 00</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* SECTION 3: ÉTATS DES LIEUX (ENTRÉE & SORTIE) */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <InventoryInspector
                type="check_in"
                isCompleted={reservation.checkInInventoryDone}
                onComplete={handleCheckInComplete}
              />

              {reservation.checkInInventoryDone && (
                <InventoryInspector
                  type="check_out"
                  isCompleted={reservation.checkOutInventoryDone}
                  onComplete={handleCheckOutComplete}
                />
              )}
            </div>
          )}

          {/* SECTION 4: CONCIERGERIE & AVIS */}
          {activeTab === 'concierge' && (
            <div className="space-y-4">
              <WhatsAppConcierge guestName={reservation.guestName} bookingId={reservation.bookingId} />
              <ReviewRedirect guestName={reservation.guestName} bookingId={reservation.bookingId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
