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
import { WhatsAppConcierge } from '@/components/guest/WhatsAppConcierge';
import chaletRender from '@/assets/chalet-render-2027.jpg';
import wifiQr from '@/assets/wifi-qr.png';
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
    navigator.clipboard.writeText('Cosynest05560!');
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
      <div className="min-h-screen bg-[#FAF7F2] text-amber-950 flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#9B6B43] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-amber-900/70 font-semibold font-serif">{t('weather.loading')}</p>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-amber-950 flex items-center justify-center p-6 font-sans">
        <p className="text-rose-700 font-bold font-serif">Réservation introuvable.</p>
      </div>
    );
  }

  const contractOk = !reservation.requiresContract || reservation.contractSigned;
  const depositOk = reservation.source === 'Airbnb' || reservation.depositStatus === 'authorized';
  const isUnlocked = contractOk && reservation.identityVerified && depositOk;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-amber-950 font-sans antialiased pb-20">
      {/* Touch Stay Header */}
      <header className="bg-white/90 border-b border-amber-900/10 sticky top-0 z-40 backdrop-blur-md shadow-xs px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-serif font-bold text-amber-950 tracking-tight">
              Chalet Cosynest
            </h1>
            <span className="text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/60 font-serif">
              Digital Guidebook
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher FR | EN */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-950 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-900/15 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#9B6B43]" />
              <span className="font-serif">{language === 'fr' ? 'FR 🇫🇷' : 'EN 🇬🇧'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="bg-[#9B6B43] text-white px-4 py-2.5 flex items-center justify-between text-xs max-w-lg mx-auto shadow-sm">
          <span className="font-semibold flex items-center gap-1.5 font-serif">
            <Download className="w-4 h-4" /> {t('guest.pwa.installPrompt')}
          </span>
          <Button size="sm" variant="secondary" onClick={handleInstallClick} className="text-xs h-7 bg-amber-50 text-amber-950 font-bold hover:bg-white rounded-lg border border-amber-200">
            {t('guest.pwa.installBtn')}
          </Button>
        </div>
      )}

      {/* Touch Stay Hero Header Card */}
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <div className="relative rounded-3xl overflow-hidden shadow-md border border-amber-900/10 bg-white">
          <div className="h-44 bg-cover bg-center relative" style={{ backgroundImage: `url(${chaletRender})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <Badge className="bg-[#9B6B43] text-white border-none text-[10px] font-semibold mb-1">
                Vars 2000 • Hautes-Alpes
              </Badge>
              <h2 className="text-xl font-serif font-bold text-white leading-tight">Chalet Cosynest</h2>
              <p className="text-xs text-amber-100 flex items-center gap-1 font-sans">
                <MapPin className="w-3 h-3 text-amber-300" /> Vars 05560, France
              </p>
            </div>
          </div>

          <div className="p-4 bg-white space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-amber-900/10 pb-3 text-amber-950">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#9B6B43]" />
                <div>
                  <span className="block text-[10px] text-amber-900/60 font-bold uppercase tracking-wider">{t('guest.welcome')}</span>
                  <span className="font-bold text-amber-950 font-serif text-sm">{reservation.guestName}</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-serif ${
                reservation.source === 'Direct' ? 'bg-amber-100/80 text-amber-950 border border-amber-300/80' : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}>
                {reservation.source}
              </span>
            </div>

            {/* Touch Stay Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-amber-900/40" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'fr' ? 'Rechercher dans le livret (Wi-Fi, Spa, Code...)' : 'Search guidebook (Wi-Fi, Spa, Code...)'}
                className="bg-amber-50/50 border-amber-900/15 text-xs pl-9 rounded-xl focus:border-[#9B6B43] focus:ring-[#9B6B43]/20 text-amber-950 placeholder:text-amber-900/40"
              />
            </div>
          </div>
        </div>

        {/* BANDEAU DE NAVIGATION PAR SECTIONS (STICKY TOP BANNER) */}
        <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-amber-900/10 shadow-md">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none no-scrollbar">
            <button
              onClick={() => setActiveTab('access')}
              className={`flex-1 min-w-max px-3.5 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'access'
                  ? 'bg-[#9B6B43] text-white shadow-sm'
                  : 'bg-amber-50/60 text-amber-950 hover:bg-amber-100/60 border border-amber-900/10'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{t('guest.tabs.access')} & Codes</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 min-w-max px-3.5 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'manual'
                  ? 'bg-[#9B6B43] text-white shadow-sm'
                  : 'bg-amber-50/60 text-amber-950 hover:bg-amber-100/60 border border-amber-900/10'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t('guest.tabs.guide')} Chalet</span>
            </button>

            <button
              onClick={() => setActiveTab('concierge')}
              className={`flex-1 min-w-max px-3.5 py-2 rounded-xl text-xs font-serif font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'concierge'
                  ? 'bg-[#9B6B43] text-white shadow-sm'
                  : 'bg-amber-50/60 text-amber-950 hover:bg-amber-100/60 border border-amber-900/10'
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
              <Card className="bg-white border-amber-900/10 text-amber-950 rounded-2xl shadow-xs overflow-hidden">
                <CardHeader className="py-3 flex flex-row items-center justify-between border-b border-amber-900/10">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-[#9B6B43]" />
                    <CardTitle className="text-sm font-serif font-bold text-amber-950">
                      {language === 'fr' ? 'Connexion Wi-Fi Haute Vitesse' : 'High-Speed Wi-Fi Connection'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-xs space-y-3 text-amber-900/80 pt-3">
                  <p><span className="text-amber-900/60 font-medium">{language === 'fr' ? 'Réseau (SSID) :' : 'Network (SSID):'}</span> <strong className="text-amber-950 font-bold font-mono text-sm">Cosynest</strong></p>
                  
                  <div className="flex items-center justify-between bg-amber-50/50 p-2.5 rounded-xl border border-amber-900/15">
                    <div>
                      <span className="text-amber-900/50 text-[10px] block font-bold uppercase">{language === 'fr' ? 'Mot de passe' : 'Password'}</span>
                      <strong className="text-[#9B6B43] font-mono text-sm">Cosynest05560!</strong>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyWifiPassword}
                      className="text-[#9B6B43] hover:bg-amber-100/60 font-semibold text-xs gap-1.5"
                    >
                      {copiedWifi ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">{language === 'fr' ? 'Copié !' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>{language === 'fr' ? 'Copier' : 'Copy'}</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* QR Code Section */}
                  <div className="pt-2 border-t border-amber-900/10 flex flex-col sm:flex-row items-center gap-3.5 bg-amber-50/40 p-3 rounded-xl border border-amber-900/10">
                    <div className="bg-white p-2 rounded-xl shadow-xs border border-amber-900/10 flex-shrink-0">
                      <img src={wifiQr} alt="Wi-Fi QR Code" className="w-28 h-28 object-contain rounded-lg" />
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <span className="text-xs font-serif font-bold text-amber-950 block">
                        {language === 'fr' ? 'Flash & Connect 📲' : 'Scan & Connect 📲'}
                      </span>
                      <p className="text-[11px] text-amber-900/70 leading-snug">
                        {language === 'fr'
                          ? 'Scannez ce QR Code avec l\'appareil photo de votre smartphone pour vous connecter directement au réseau Wi-Fi du chalet.'
                          : 'Scan this QR Code with your smartphone camera to connect directly to the chalet\'s Wi-Fi network.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sauna & Fitness Card */}
              <Card className="bg-white border-amber-900/10 text-amber-950 rounded-2xl shadow-xs">
                <CardHeader className="py-3 flex flex-row items-center gap-2 border-b border-amber-900/10">
                  <Flame className="w-5 h-5 text-[#9B6B43]" />
                  <CardTitle className="text-sm font-serif font-bold text-amber-950">
                    {language === 'fr' ? 'Sauna Nordique & Espace Fitness' : 'Nordic Sauna & Fitness Area'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2 text-amber-900/80 pt-3 font-medium">
                  <p>{language === 'fr' ? '• Sauna Nordique : allumer le poêle 30 min avant utilisation via le boîtier mural.' : '• Nordic Sauna: turn on the heater 30 mins before use via the wall controller.'}</p>
                  <p>{language === 'fr' ? '• Salle Fitness : équipée d\'un tapis de course Technogym, d\'haltères et de tapis de yoga à votre disposition.' : '• Fitness Room: equipped with a Technogym treadmill, dumbbells, and yoga mats at your disposal.'}</p>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card className="bg-white border-amber-900/10 text-amber-950 rounded-2xl shadow-xs">
                <CardHeader className="py-3 flex flex-row items-center gap-2 border-b border-amber-900/10">
                  <Phone className="w-5 h-5 text-rose-700" />
                  <CardTitle className="text-sm font-serif font-bold text-amber-950">
                    {language === 'fr' ? 'Contacts d\'Urgence' : 'Emergency Contacts'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-1 text-amber-900/80 pt-3 font-medium">
                  <p><span className="text-amber-900/60">{t('services.items.concierge')} :</span> +33 6 00 00 00 00</p>
                  <p><span className="text-amber-900/60">{language === 'fr' ? 'Secours Montagne :' : 'Mountain Rescue:'}</span> 112</p>
                  <p><span className="text-amber-900/60">{language === 'fr' ? 'Cabinet Médical :' : 'Medical Center:'}</span> +33 4 50 00 00 00</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* SECTION 3: CONCIERGERIE & AVIS */}
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
