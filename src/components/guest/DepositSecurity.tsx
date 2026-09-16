import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, CreditCard, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { processDepositHold } from '@/lib/deposit';

interface DepositSecurityProps {
  bookingId: string;
  depositAmount: number;
  depositStatus: 'pending' | 'authorized' | 'released' | 'claimed';
  source?: string;
  onDepositAuthorized: () => void;
}

export const DepositSecurity: React.FC<DepositSecurityProps> = ({
  bookingId,
  depositAmount,
  depositStatus,
  source = 'Direct',
  onDepositAuthorized,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(depositStatus);

  const handleAuthorize = async () => {
    setLoading(true);
    await processDepositHold(bookingId, depositAmount);
    setLoading(false);
    setStatus('authorized');
    onDepositAuthorized();
  };

  // If Airbnb, damage is covered by Airbnb AirCover: no external Swikly deposit needed
  if (source === 'Airbnb') {
    return (
      <Card className="bg-sky-50/80 border-sky-200 text-sky-950 rounded-2xl shadow-xs">
        <CardHeader className="flex flex-row items-center gap-3 py-3">
          <ShieldCheck className="w-7 h-7 text-sky-600 flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-sky-900">Protection Airbnb AirCover</CardTitle>
              <Badge className="bg-sky-600 text-white border-none text-[10px]">Inclus</Badge>
            </div>
            <p className="text-xs text-sky-700 font-medium">
              Votre séjour est automatiquement protégé par Airbnb AirCover. Aucune caution externe n'est demandée.
            </p>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (status === 'authorized') {
    return (
      <Card className="bg-emerald-50/80 border-emerald-200 text-emerald-950 rounded-2xl shadow-xs">
        <CardHeader className="flex flex-row items-center gap-3 py-3">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
          <div>
            <CardTitle className="text-base font-bold text-emerald-900">Empreinte Bancaire Bloquée</CardTitle>
            <p className="text-xs text-emerald-700 font-medium">
              Caution de {depositAmount} € enregistrée via Swikly
            </p>
          </div>
        </CardHeader>
        <CardContent className="text-xs text-emerald-800 space-y-1 pt-0">
          <p>• Aucun débit de votre compte bancaire.</p>
          <p>• Libération automatique post-départ après état des lieux.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-amber-900/10 text-amber-950 rounded-2xl shadow-sm">
      <CardHeader className="pb-3 border-b border-amber-900/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#9B6B43]" />
            <CardTitle className="text-base font-serif font-bold text-amber-950">Dépôt de Garantie / Caution</CardTitle>
          </div>
          <span className="text-[11px] font-bold font-serif text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/60">
            Swikly / Stripe
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        <div className="flex items-center justify-between bg-amber-50/50 p-4 rounded-xl border border-amber-900/15">
          <div>
            <p className="text-xs text-amber-900/60 font-medium">Montant de la caution</p>
            <p className="text-2xl font-serif font-extrabold text-amber-950">{depositAmount} €</p>
          </div>
          <div className="text-right text-xs text-amber-900/70">
            <p className="flex items-center justify-end gap-1 text-emerald-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Sans débit immédiat
            </p>
            <p className="text-[11px] text-amber-900/50 font-medium">Restitution à la sortie</p>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-amber-950 bg-amber-50/70 p-3 rounded-xl border border-amber-300/60">
          <AlertCircle className="w-4 h-4 text-[#9B6B43] flex-shrink-0 mt-0.5" />
          <p className="font-medium">
            L'enregistrement de l'empreinte bancaire déverrouille immédiatement vos codes d'accès à la serrure Igloohome.
          </p>
        </div>
      </CardContent>

      <CardFooter className="pt-1 pb-4">
        <Button
          onClick={handleAuthorize}
          disabled={loading}
          className="w-full bg-[#9B6B43] hover:bg-[#855a38] text-white font-serif font-semibold text-xs py-3 rounded-xl shadow-md shadow-[#9B6B43]/20"
        >
          {loading ? (
            'Communication avec Swikly...'
          ) : (
            <span className="flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" /> Activer l'empreinte de caution ({depositAmount} €)
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
