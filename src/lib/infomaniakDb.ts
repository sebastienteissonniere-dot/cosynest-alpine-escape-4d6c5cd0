import { Beds24Reservation } from './beds24';
import { GeminiIdentityResult } from './geminiIdentity';

const API_BASE_URL = '/api';

/**
 * Fetch a single reservation from Infomaniak PHP API
 */
export async function getInfomaniakReservation(bookingId: string): Promise<Beds24Reservation | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/reservations.php?bookingId=${encodeURIComponent(bookingId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch (err) {
    console.warn('Infomaniak DB offline or non reachable:', err);
    return null;
  }
}

/**
 * Fetch all reservations from Infomaniak PHP API
 */
export async function getAllInfomaniakReservations(): Promise<Beds24Reservation[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/reservations.php`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('Infomaniak DB list offline or non reachable:', err);
    return [];
  }
}

/**
 * Save / Update reservation state via Infomaniak PHP API
 */
export async function saveInfomaniakReservation(reservation: Partial<Beds24Reservation> & { bookingId: string }): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/reservations.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation),
    });
  } catch (err) {
    console.warn('Infomaniak DB save error:', err);
  }
}

/**
 * Save Gemini AI Identity log via Infomaniak PHP API
 */
export async function saveInfomaniakIdentityLog(bookingId: string, result: GeminiIdentityResult): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/identity.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId,
        guestName: result.extractedName || 'Voyageur',
        extractedName: result.extractedName,
        verificationPassed: result.verificationPassed,
        confidenceScore: result.confidenceScore,
        faceMatches: result.faceMatches,
        nameMatches: result.nameMatches,
        isLivePerson: result.isLivePerson,
        summaryReason: result.summaryReason,
      }),
    });
  } catch (err) {
    console.warn('Infomaniak DB identity log error:', err);
  }
}
