export interface IgloohomeAccessInfo {
  pinCode: string;
  keyboxCode: string;
  validFrom: string;
  validTo: string;
  lockName: string;
  status: 'active' | 'expired' | 'pending';
}

/**
 * Generates or retrieves Igloohome PIN code for a specific booking period.
 * Connects to Igloohome Algorithmic OTP API or Cloud API.
 */
export async function getIgloohomeAccessCode(
  bookingId: string,
  checkInDate: string,
  checkOutDate: string
): Promise<IgloohomeAccessInfo> {
  // Simulate Igloohome API request delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Dynamic PIN algorithm mock based on bookingId hash
  let pinHash = 0;
  for (let i = 0; i < bookingId.length; i++) {
    pinHash += bookingId.charCodeAt(i) * (i + 1);
  }
  const generatedPin = String((pinHash * 98765) % 1000000).padStart(6, '9');
  const generatedKeybox = String((pinHash * 4321) % 10000).padStart(4, '4');

  return {
    pinCode: generatedPin,
    keyboxCode: generatedKeybox,
    validFrom: `${checkInDate}T16:00:00`,
    validTo: `${checkOutDate}T10:00:00`,
    lockName: 'Serrure Principale Entrée Chalet & Boîte à clés Igloohome',
    status: 'active',
  };
}
