export interface Beds24Reservation {
  id: string;
  bookingId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  numberOfGuests: number;
  totalAmount: number;
  source: 'Direct' | 'Airbnb' | 'Booking.com' | 'VRBO';
  status: 'confirmed' | 'cancelled' | 'checked_in' | 'checked_out';
  notes?: string;
  requiresContract: boolean;
  contractSigned: boolean;
  contractSignedAt?: string;
  identityVerified: boolean;
  depositStatus: 'pending' | 'authorized' | 'released' | 'claimed';
  depositAmount: number;
  igloohomePinCode?: string;
  igloohomeKeyboxCode?: string;
  checkInInventoryDone: boolean;
  checkOutInventoryDone: boolean;
  googleReviewStatus?: 'pending' | 'submitted_google' | 'private_feedback';
}

// Mock database / cache for Beds24 sync
const MOCK_RESERVATIONS: Record<string, Beds24Reservation> = {
  'RES-DIRECT-101': {
    id: '1',
    bookingId: 'RES-DIRECT-101',
    guestName: 'Alexandre & Sophie Martin',
    guestEmail: 'alexandre.martin@example.com',
    guestPhone: '+33 6 12 34 56 78',
    checkIn: '2026-09-15',
    checkOut: '2026-09-22',
    numberOfGuests: 8,
    totalAmount: 4800,
    source: 'Direct',
    status: 'confirmed',
    notes: 'Réservation directe via le site CosyNest. Arrivée prévue vers 16h.',
    requiresContract: true,
    contractSigned: false,
    identityVerified: false,
    depositStatus: 'pending',
    depositAmount: 1500,
    igloohomePinCode: '849201',
    igloohomeKeyboxCode: '3940',
    checkInInventoryDone: false,
    checkOutInventoryDone: false,
  },
  'RES-AIRBNB-204': {
    id: '2',
    bookingId: 'RES-AIRBNB-204',
    guestName: 'Thomas Dubois',
    guestEmail: 't.dubois@example.com',
    guestPhone: '+33 6 98 76 54 32',
    checkIn: '2026-09-23',
    checkOut: '2026-09-30',
    numberOfGuests: 6,
    totalAmount: 4200,
    source: 'Airbnb',
    status: 'confirmed',
    notes: 'Réservation via Airbnb. Contrat couvert par les CGV Airbnb.',
    requiresContract: false,
    contractSigned: true, // Auto-waived for OTA
    identityVerified: true,
    depositStatus: 'authorized',
    depositAmount: 1500,
    igloohomePinCode: '720194',
    igloohomeKeyboxCode: '8103',
    checkInInventoryDone: true,
    checkOutInventoryDone: false,
  },
  'demo': {
    id: 'demo',
    bookingId: 'demo',
    guestName: 'Jean Dupont',
    guestEmail: 'jean.dupont@example.com',
    guestPhone: '+33 6 00 11 22 33',
    checkIn: '2026-09-14',
    checkOut: '2026-09-21',
    numberOfGuests: 10,
    totalAmount: 5200,
    source: 'Direct',
    status: 'confirmed',
    notes: 'Séjour Direct démonstration Chalet CosyNest.',
    requiresContract: true,
    contractSigned: false,
    identityVerified: false,
    depositStatus: 'pending',
    depositAmount: 2000,
    igloohomePinCode: '918234',
    igloohomeKeyboxCode: '5412',
    checkInInventoryDone: false,
    checkOutInventoryDone: false,
  }
};

import {
  getSupabaseReservation,
  getAllSupabaseReservations,
  saveSupabaseReservation,
} from './supabaseDb';

export async function fetchBeds24Reservation(bookingId: string): Promise<Beds24Reservation | null> {
  // 1. Try fetching from Supabase PostgreSQL database first
  const dbResult = await getSupabaseReservation(bookingId);
  if (dbResult) {
    MOCK_RESERVATIONS[bookingId] = dbResult;
    return dbResult;
  }

  // 2. Fallback to local memory cache / mock
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_RESERVATIONS[bookingId] || MOCK_RESERVATIONS['demo'];
}

export async function fetchAllReservations(): Promise<Beds24Reservation[]> {
  // 1. Try fetching from Supabase
  const dbList = await getAllSupabaseReservations();
  if (dbList.length > 0) {
    dbList.forEach((r) => {
      MOCK_RESERVATIONS[r.bookingId] = r;
    });
    return dbList;
  }

  // 2. Fallback to local cache
  await new Promise((resolve) => setTimeout(resolve, 200));
  return Object.values(MOCK_RESERVATIONS);
}

export async function updateReservationState(
  bookingId: string,
  updates: Partial<Beds24Reservation>
): Promise<Beds24Reservation> {
  const current = MOCK_RESERVATIONS[bookingId] || MOCK_RESERVATIONS['demo'];
  const updated = { ...current, ...updates };
  MOCK_RESERVATIONS[bookingId] = updated;

  // Persist asynchronously in Supabase
  saveSupabaseReservation({ ...updates, bookingId });

  return updated;
}
