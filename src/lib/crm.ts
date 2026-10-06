import { Beds24Reservation } from './beds24';

export interface ClientBookingHistory {
  bookingId: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  source: 'Direct' | 'Airbnb' | 'Booking.com' | 'VRBO';
  status: 'confirmed' | 'cancelled' | 'checked_in' | 'checked_out';
  numberOfGuests: number;
  contractSigned: boolean;
  depositStatus: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalStays: number;
  totalRevenue: number;
  lastCheckIn: string;
  preferredSource: string;
  isDirectBooker: boolean;
  statusTag: 'VIP' | 'Fidèle Direct' | 'OTA à Convertir' | 'Nouveau Client';
  bookings: ClientBookingHistory[];
  tags: string[];
}

export interface EmailCampaign {
  id: string;
  title: string;
  subject: string;
  targetSegment: 'all' | 'direct_only' | 'ota_convert' | 'vip';
  templateId: 'promo_15_direct' | 'season_reopening' | 'custom_offer';
  customBody?: string;
  promoCode?: string;
  status: 'draft' | 'scheduled' | 'sent';
  createdDate: string;
  sentDate?: string;
  recipientsCount: number;
  openRatePercent?: number;
  clickRatePercent?: number;
  revenueGenerated?: number;
}

// Memory & LocalStorage Cache for Email Campaigns
const CAMPAIGNS_KEY = 'cosynest_crm_campaigns';

const INITIAL_CAMPAIGNS: EmailCampaign[] = [
  {
    id: 'camp-01',
    title: 'Offre Privilège Saison Hiver 2026',
    subject: '🎁 Votre privilège au Chalet CosyNest : -15% sur votre séjour en direct',
    targetSegment: 'ota_convert',
    templateId: 'promo_15_direct',
    promoCode: 'VIPDIRECT15',
    status: 'sent',
    createdDate: '2026-09-01',
    sentDate: '2026-09-10',
    recipientsCount: 42,
    openRatePercent: 68,
    clickRatePercent: 41,
    revenueGenerated: 9600,
  },
  {
    id: 'camp-02',
    title: 'Nouveautés Espace Bien-Être & Sauna Nordique',
    subject: '🧘 Découvrez le nouveau Sauna Nordique & Espace Fitness au Chalet CosyNest',
    targetSegment: 'all',
    templateId: 'season_reopening',
    status: 'draft',
    createdDate: '2026-10-01',
    recipientsCount: 85,
    openRatePercent: 0,
    clickRatePercent: 0,
    revenueGenerated: 0,
  },
];

/**
 * Agrège les réservations par personne pour construire les fiches clients
 */
export function buildClientProfiles(reservations: Beds24Reservation[]): ClientProfile[] {
  const map = new Map<string, ClientProfile>();

  reservations.forEach((r) => {
    const emailKey = r.guestEmail.trim().toLowerCase() || r.guestName.trim().toLowerCase();
    
    const historyItem: ClientBookingHistory = {
      bookingId: r.bookingId,
      checkIn: r.checkIn,
      checkOut: r.checkOut,
      totalAmount: r.totalAmount || 0,
      source: r.source,
      status: r.status,
      numberOfGuests: r.numberOfGuests || 2,
      contractSigned: r.contractSigned,
      depositStatus: r.depositStatus,
    };

    if (!map.has(emailKey)) {
      const isDirect = r.source === 'Direct';
      map.set(emailKey, {
        id: emailKey,
        name: r.guestName,
        email: r.guestEmail || 'Email non fourni',
        phone: r.guestPhone || 'N/A',
        totalStays: r.status !== 'cancelled' ? 1 : 0,
        totalRevenue: r.status !== 'cancelled' ? r.totalAmount || 0 : 0,
        lastCheckIn: r.checkIn,
        preferredSource: r.source,
        isDirectBooker: isDirect,
        statusTag: 'Nouveau Client',
        bookings: [historyItem],
        tags: [r.source],
      });
    } else {
      const client = map.get(emailKey)!;
      client.bookings.push(historyItem);
      if (r.status !== 'cancelled') {
        client.totalStays += 1;
        client.totalRevenue += r.totalAmount || 0;
      }
      if (new Date(r.checkIn) > new Date(client.lastCheckIn)) {
        client.lastCheckIn = r.checkIn;
      }
      if (!client.tags.includes(r.source)) {
        client.tags.push(r.source);
      }
    }
  });

  const profiles = Array.from(map.values()).map((client) => {
    client.bookings.sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());

    const hasDirect = client.bookings.some((b) => b.source === 'Direct');
    const hasOTA = client.bookings.some((b) => b.source !== 'Direct');

    if (client.totalRevenue >= 5000 || client.totalStays >= 3) {
      client.statusTag = 'VIP';
    } else if (hasDirect) {
      client.statusTag = 'Fidèle Direct';
    } else if (hasOTA) {
      client.statusTag = 'OTA à Convertir';
    } else {
      client.statusTag = 'Nouveau Client';
    }

    return client;
  });

  return profiles.sort((a, b) => b.totalRevenue - a.totalRevenue);
}

/**
 * Récupère les campagnes e-mails enregistrées
 */
export function getEmailCampaigns(): EmailCampaign[] {
  try {
    const stored = localStorage.getItem(CAMPAIGNS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Erreur lecture campagnes CRM', e);
  }
  return INITIAL_CAMPAIGNS;
}

/**
 * Sauvegarde ou met à jour une campagne e-mail
 */
export function saveEmailCampaign(campaign: EmailCampaign): EmailCampaign[] {
  const current = getEmailCampaigns();
  const existingIdx = current.findIndex((c) => c.id === campaign.id);

  let updated: EmailCampaign[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = campaign;
  } else {
    updated = [campaign, ...current];
  }

  try {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Erreur sauvegarde campagne CRM', e);
  }
  return updated;
}

/**
 * Génère le CSV d'exportation pour les clients cibles
 */
export function exportClientsCSV(clients: ClientProfile[]): void {
  const headers = ['Nom', 'Email', 'Telephone', 'Nombre_Sejours', 'CA_Total_EUR', 'Dernier_Sejour', 'Statut_Client', 'Canaux_Utilises'];
  const rows = clients.map((c) => [
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.email.replace(/"/g, '""')}"`,
    `"${c.phone.replace(/"/g, '""')}"`,
    c.totalStays,
    c.totalRevenue,
    c.lastCheckIn,
    `"${c.statusTag}"`,
    `"${c.tags.join(', ')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `cosynest_clients_crm_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
