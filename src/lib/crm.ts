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

export interface ProspectLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string; // ex: 'Formulaire Web', 'Téléphone', 'Instagram', 'Recommandation'
  statusTag: 'Nouveau Prospect' | 'Devis Envoyé' | 'En Négociation' | 'Converti' | 'Inactif';
  notes?: string;
  createdAt: string;
  tags: string[];
}

export interface EmailCampaign {
  id: string;
  title: string;
  subject: string;
  targetSegment: 'all' | 'direct_only' | 'ota_convert' | 'vip' | 'prospects_only' | 'all_with_prospects';
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

// Keys for localStorage fallback
const CAMPAIGNS_KEY = 'cosynest_crm_campaigns';
const PROSPECTS_KEY = 'cosynest_crm_prospects';

const INITIAL_PROSPECTS: ProspectLead[] = [
  {
    id: 'prospect-101',
    name: 'Marc & Valérie Laurent',
    email: 'marc.laurent@example.com',
    phone: '+33 6 45 89 12 34',
    source: 'Formulaire Web CosyNest',
    statusTag: 'Devis Envoyé',
    notes: 'Intéressé par 1 semaine en février 2027 pour 10 personnes. Souhaite des infos sur le Sauna.',
    createdAt: '2026-09-28',
    tags: ['Prospect', 'Hiver 2027'],
  },
];

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
];

/**
 * Agrège les réservations par personne pour construire les fiches clients
 */
export function buildClientProfiles(reservations: Beds24Reservation[]): ClientProfile[] {
  const map = new Map<string, ClientProfile>();

  if (!Array.isArray(reservations)) return [];

  reservations.forEach((r) => {
    if (!r) return;
    const rawEmail = typeof r.guestEmail === 'string' ? r.guestEmail : '';
    const rawName = typeof r.guestName === 'string' ? r.guestName : 'Voyageur';

    const guestEmail = rawEmail.trim();
    const guestName = rawName.trim();
    const emailKey = (guestEmail || guestName).toLowerCase();
    if (!emailKey) return;
    
    const historyItem: ClientBookingHistory = {
      bookingId: r.bookingId || 'ID-RES',
      checkIn: r.checkIn || new Date().toISOString().slice(0, 10),
      checkOut: r.checkOut || new Date().toISOString().slice(0, 10),
      totalAmount: typeof r.totalAmount === 'number' ? r.totalAmount : 0,
      source: r.source || 'Direct',
      status: r.status || 'confirmed',
      numberOfGuests: typeof r.numberOfGuests === 'number' ? r.numberOfGuests : 2,
      contractSigned: Boolean(r.contractSigned),
      depositStatus: r.depositStatus || 'pending',
    };

    if (!map.has(emailKey)) {
      const isDirect = r.source === 'Direct';
      map.set(emailKey, {
        id: emailKey,
        name: guestName || 'Voyageur',
        email: guestEmail || 'Email non fourni',
        phone: r.guestPhone || 'N/A',
        totalStays: r.status !== 'cancelled' ? 1 : 0,
        totalRevenue: r.status !== 'cancelled' ? (typeof r.totalAmount === 'number' ? r.totalAmount : 0) : 0,
        lastCheckIn: r.checkIn || new Date().toISOString().slice(0, 10),
        preferredSource: r.source || 'Direct',
        isDirectBooker: isDirect,
        statusTag: 'Nouveau Client',
        bookings: [historyItem],
        tags: [r.source || 'Direct'],
      });
    } else {
      const client = map.get(emailKey)!;
      client.bookings.push(historyItem);
      if (r.status !== 'cancelled') {
        client.totalStays += 1;
        client.totalRevenue += typeof r.totalAmount === 'number' ? r.totalAmount : 0;
      }
      if (r.checkIn && client.lastCheckIn && new Date(r.checkIn).getTime() > new Date(client.lastCheckIn).getTime()) {
        client.lastCheckIn = r.checkIn;
      }
      if (r.source && !client.tags.includes(r.source)) {
        client.tags.push(r.source);
      }
    }
  });

  const profiles = Array.from(map.values()).map((client) => {
    client.bookings.sort((a, b) => {
      const tA = new Date(a.checkIn || 0).getTime() || 0;
      const tB = new Date(b.checkIn || 0).getTime() || 0;
      return tB - tA;
    });

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

  return profiles.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
}

/**
 * Récupère les prospects / leads enregistrés depuis la BDD Infomaniak
 */
export async function fetchProspectsFromDb(): Promise<ProspectLead[]> {
  try {
    const res = await fetch('/api/crm.php?action=get_prospects');
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        localStorage.setItem(PROSPECTS_KEY, JSON.stringify(data.data));
        return data.data;
      }
    }
  } catch (e) {
    console.warn('Fallback local pour prospects:', e);
  }
  return getProspectsLocal();
}

export function getProspectsLocal(): ProspectLead[] {
  try {
    const stored = localStorage.getItem(PROSPECTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Erreur lecture prospects local', e);
  }
  return INITIAL_PROSPECTS;
}

/**
 * Enregistre ou met à jour un prospect / lead en BDD Infomaniak
 */
export async function saveProspectToDb(prospect: ProspectLead): Promise<ProspectLead[]> {
  // Save local fallback immediately
  const localList = saveProspectLocal(prospect);

  try {
    await fetch('/api/crm.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_prospect',
        prospect: prospect,
      }),
    });
    // Refresh from DB
    return await fetchProspectsFromDb();
  } catch (e) {
    console.error('Erreur sauvegarde prospect BDD:', e);
  }
  return localList;
}

function saveProspectLocal(prospect: ProspectLead): ProspectLead[] {
  const current = getProspectsLocal();
  const idx = current.findIndex((p) => p.id === prospect.id);

  let updated: ProspectLead[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = prospect;
  } else {
    updated = [prospect, ...current];
  }

  try {
    localStorage.setItem(PROSPECTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Erreur sauvegarde prospect local', e);
  }
  return updated;
}

/**
 * Supprime un prospect / lead de la BDD Infomaniak
 */
export async function deleteProspectFromDb(id: string): Promise<ProspectLead[]> {
  deleteProspectLocal(id);

  try {
    await fetch('/api/crm.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_prospect',
        id: id,
      }),
    });
    return await fetchProspectsFromDb();
  } catch (e) {
    console.error('Erreur suppression prospect BDD:', e);
  }
  return getProspectsLocal();
}

function deleteProspectLocal(id: string): ProspectLead[] {
  const current = getProspectsLocal();
  const updated = current.filter((p) => p.id !== id);
  try {
    localStorage.setItem(PROSPECTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Erreur suppression prospect local', e);
  }
  return updated;
}

/**
 * Récupère les campagnes e-mails enregistrées depuis la BDD
 */
export async function fetchCampaignsFromDb(): Promise<EmailCampaign[]> {
  try {
    const res = await fetch('/api/crm.php?action=get_campaigns');
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(data.data));
        return data.data;
      }
    }
  } catch (e) {
    console.warn('Fallback local pour campagnes:', e);
  }
  return getEmailCampaignsLocal();
}

export function getEmailCampaignsLocal(): EmailCampaign[] {
  try {
    const stored = localStorage.getItem(CAMPAIGNS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Erreur lecture campagnes local', e);
  }
  return INITIAL_CAMPAIGNS;
}

export async function saveCampaignToDb(campaign: EmailCampaign): Promise<EmailCampaign[]> {
  const localList = saveEmailCampaign(campaign);

  try {
    await fetch('/api/crm.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_campaign',
        campaign: campaign,
      }),
    });
    return await fetchCampaignsFromDb();
  } catch (e) {
    console.error('Erreur sauvegarde campagne BDD:', e);
  }
  return localList;
}

export async function deleteCampaignFromDb(id: string): Promise<EmailCampaign[]> {
  deleteCampaignLocal(id);

  try {
    await fetch('/api/crm.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_campaign',
        id: id,
      }),
    });
    return await fetchCampaignsFromDb();
  } catch (e) {
    console.error('Erreur suppression campagne BDD:', e);
  }
  return getEmailCampaignsLocal();
}

function deleteCampaignLocal(id: string): EmailCampaign[] {
  const current = getEmailCampaignsLocal();
  const updated = current.filter((c) => c.id !== id);
  try {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Erreur suppression campagne local', e);
  }
  return updated;
}

export function saveEmailCampaign(campaign: EmailCampaign): EmailCampaign[] {
  const current = getEmailCampaignsLocal();
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
    console.error('Erreur sauvegarde campagne local', e);
  }
  return updated;
}

/**
 * Génère le CSV d'exportation pour les clients ou prospects
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

export function exportProspectsCSV(prospects: ProspectLead[]): void {
  const headers = ['Nom', 'Email', 'Telephone', 'Source', 'Statut_Prospect', 'Notes', 'Date_Creation'];
  const rows = prospects.map((p) => [
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.email.replace(/"/g, '""')}"`,
    `"${p.phone.replace(/"/g, '""')}"`,
    `"${p.source.replace(/"/g, '""')}"`,
    `"${p.statusTag}"`,
    `"${(p.notes || '').replace(/"/g, '""')}"`,
    p.createdAt,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `cosynest_prospects_leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
