import { supabase } from '@/integrations/supabase/client';
import { Beds24Reservation } from './beds24';
import { GeminiIdentityResult } from './geminiIdentity';

/**
 * Fetch a single reservation from Supabase by bookingId
 */
export async function getSupabaseReservation(bookingId: string): Promise<Beds24Reservation | null> {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('booking_id', bookingId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapRowToBeds24Reservation(data);
  } catch (err) {
    console.warn('Erreur de lecture Supabase:', err);
    return null;
  }
}

/**
 * Fetch all reservations from Supabase
 */
export async function getAllSupabaseReservations(): Promise<Beds24Reservation[]> {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('check_in', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data.map(mapRowToBeds24Reservation);
  } catch (err) {
    console.warn('Erreur de lecture de la liste Supabase:', err);
    return [];
  }
}

/**
 * Upsert or update a reservation in Supabase
 */
export async function saveSupabaseReservation(reservation: Partial<Beds24Reservation> & { bookingId: string }): Promise<void> {
  try {
    const rowData: any = {
      booking_id: reservation.bookingId,
      updated_at: new Date().toISOString(),
    };

    if (reservation.guestName !== undefined) rowData.guest_name = reservation.guestName;
    if (reservation.guestEmail !== undefined) rowData.guest_email = reservation.guestEmail;
    if (reservation.guestPhone !== undefined) rowData.guest_phone = reservation.guestPhone;
    if (reservation.checkIn !== undefined) rowData.check_in = reservation.checkIn;
    if (reservation.checkOut !== undefined) rowData.check_out = reservation.checkOut;
    if (reservation.numberOfGuests !== undefined) rowData.number_of_guests = reservation.numberOfGuests;
    if (reservation.totalAmount !== undefined) rowData.total_amount = reservation.totalAmount;
    if (reservation.source !== undefined) rowData.source = reservation.source;
    if (reservation.status !== undefined) rowData.status = reservation.status;
    if (reservation.requiresContract !== undefined) rowData.requires_contract = reservation.requiresContract;
    if (reservation.contractSigned !== undefined) rowData.contract_signed = reservation.contractSigned;
    if (reservation.contractSignedAt !== undefined) rowData.contract_signed_at = reservation.contractSignedAt;
    if (reservation.identityVerified !== undefined) rowData.identity_verified = reservation.identityVerified;
    if (reservation.depositStatus !== undefined) rowData.deposit_status = reservation.depositStatus;
    if (reservation.depositAmount !== undefined) rowData.deposit_amount = reservation.depositAmount;
    if (reservation.igloohomePinCode !== undefined) rowData.igloohome_pin_code = reservation.igloohomePinCode;
    if (reservation.igloohomeKeyboxCode !== undefined) rowData.igloohome_keybox_code = reservation.igloohomeKeyboxCode;
    if (reservation.checkInInventoryDone !== undefined) rowData.check_in_inventory_done = reservation.checkInInventoryDone;
    if (reservation.checkOutInventoryDone !== undefined) rowData.check_out_inventory_done = reservation.checkOutInventoryDone;
    if (reservation.notes !== undefined) rowData.notes = reservation.notes;

    const { error } = await supabase
      .from('reservations')
      .upsert(rowData, { onConflict: 'booking_id' });

    if (error) {
      console.warn('Erreur d\'enregistrement Supabase:', error.message);
    }
  } catch (err) {
    console.warn('Erreur réseau Supabase:', err);
  }
}

/**
 * Save Gemini AI Identity Verification log to Supabase
 */
export async function saveGeminiIdentityLog(bookingId: string, result: GeminiIdentityResult): Promise<void> {
  try {
    await supabase.from('identity_verifications').insert({
      booking_id: bookingId,
      guest_name: result.extractedName || 'Voyageur',
      extracted_name: result.extractedName,
      verification_passed: result.verificationPassed,
      confidence_score: result.confidenceScore,
      face_matches: result.faceMatches,
      name_matches: result.nameMatches,
      is_live_person: result.isLivePerson,
      summary_reason: result.summaryReason,
    });
  } catch (err) {
    console.warn('Erreur de sauvegarde log Gemini Supabase:', err);
  }
}

/**
 * Helper to map Supabase table row to Beds24Reservation TypeScript interface
 */
function mapRowToBeds24Reservation(row: any): Beds24Reservation {
  return {
    id: row.id || row.booking_id,
    bookingId: row.booking_id,
    guestName: row.guest_name,
    guestEmail: row.guest_email || '',
    guestPhone: row.guest_phone || '',
    checkIn: row.check_in,
    checkOut: row.check_out,
    numberOfGuests: row.number_of_guests || 2,
    totalAmount: Number(row.total_amount) || 0,
    source: (row.source as any) || 'Direct',
    status: (row.status as any) || 'confirmed',
    notes: row.notes,
    requiresContract: row.requires_contract ?? true,
    contractSigned: row.contract_signed ?? false,
    contractSignedAt: row.contract_signed_at,
    identityVerified: row.identity_verified ?? false,
    depositStatus: row.deposit_status || 'pending',
    depositAmount: Number(row.deposit_amount) || 1500,
    igloohomePinCode: row.igloohome_pin_code,
    igloohomeKeyboxCode: row.igloohome_keybox_code,
    checkInInventoryDone: row.check_in_inventory_done ?? false,
    checkOutInventoryDone: row.check_out_inventory_done ?? false,
  };
}
