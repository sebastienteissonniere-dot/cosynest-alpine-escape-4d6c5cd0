export interface SecurityDepositDetails {
  bookingId: string;
  amount: number;
  currency: string;
  provider: 'Swikly' | 'Stripe';
  status: 'pending' | 'authorized' | 'released' | 'claimed';
  authorizedAt?: string;
  expiresAt?: string;
  swiklyLink?: string;
}

export async function processDepositHold(
  bookingId: string,
  amount: number,
  cardToken?: string
): Promise<SecurityDepositDetails> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    bookingId,
    amount,
    currency: 'EUR',
    provider: 'Swikly',
    status: 'authorized',
    authorizedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(),
    swiklyLink: `https://swikly.com/deposit/cosynest/${bookingId}`,
  };
}

export async function releaseDepositHold(bookingId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return true;
}
