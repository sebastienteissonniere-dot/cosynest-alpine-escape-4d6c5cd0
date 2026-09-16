import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Lock, Copy, Check, ShieldAlert, WifiOff, Sparkles } from 'lucide-react';
import { getIgloohomeAccessCode, IgloohomeAccessInfo } from '@/lib/igloohome';

interface IgloohomeKeyAccessProps {
  bookingId: string;
  checkInDate: string;
  checkOutDate: string;
  isUnlocked: boolean; // Contract + Identity + Deposit done
}

export const IgloohomeKeyAccess: React.FC<IgloohomeKeyAccessProps> = ({
  bookingId,
  checkInDate,
  checkOutDate,
  isUnlocked,
}) => {
  const [accessInfo, setAccessInfo] = useState<IgloohomeAccessInfo | null>(null);
  const [copiedPin, setCopiedPin] = useState(false);
  const [copiedKeybox, setCopiedKeybox] = useState(false);

  useEffect(() => {
    if (isUnlocked) {
      getIgloohomeAccessCode(bookingId, checkInDate, checkOutDate).then(setAccessInfo);
    }
  }, [bookingId, checkInDate, checkOutDate, isUnlocked]);

  const copyToClipboard = (text: string, type: 'pin' | 'keybox') => {
    navigator.clipboard.writeText(text);
    if (type === 'pin') {
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    } else {
      setCopiedKeybox(true);
      setTimeout(() => setCopiedKeybox(false), 2000);
    }
  };

  if (!isUnlocked) {
    return (
      <Card className="bg-white border-amber-900/10 text-amber-950 rounded-2xl shadow-sm">
        <CardHeader className="pb-3 border-b border-amber-900/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-rose-700" />
              <CardTitle className="text-base font-serif font-bold text-amber-950">Accès Serrure Igloohome</CardTitle>
            </div>
            <span className="text-[11px] font-bold font-serif text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Verrouillé
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-rose-950 space-y-1 font-medium">
              <p className="font-bold text-rose-950 font-serif">Les codes d'accès serrures sont verrouillés.</p>
              <p>
                Pour afficher votre code PIN temporaire et le code de la boîte à clés Igloohome, complétez la signature du contrat, la vérification d'identité et l'enregistrement de la caution.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-[#2C1D11] via-[#1E140B] to-[#120C07] border-[#9B6B43]/40 text-white rounded-2xl shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Key className="w-32 h-32 text-amber-400" />
      </div>

      <CardHeader className="pb-3 border-b border-amber-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#9B6B43]/30 text-amber-300 rounded-xl border border-[#9B6B43]/40">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-serif font-bold text-white">Vos Codes d'Accès Igloohome</CardTitle>
              <p className="text-[11px] text-amber-200/80 flex items-center gap-1 mt-0.5 font-medium">
                <Sparkles className="w-3 h-3 text-amber-400" /> Valides pour la durée du séjour
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold font-serif text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
            Actif
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Code PIN Serrure Principale */}
        <div className="bg-black/60 p-4 rounded-xl border border-[#9B6B43]/40 space-y-2 backdrop-blur-sm">
          <div className="flex justify-between items-center text-xs text-amber-100/90 font-serif">
            <span>Serrure Connectée Entrée Principale</span>
            <span className="text-[10px] font-semibold text-amber-200 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800/80 font-sans">
              Digicode Igloohome
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-3xl font-extrabold tracking-widest text-amber-400 drop-shadow-sm">
              {accessInfo?.pinCode || '------'}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => accessInfo && copyToClipboard(accessInfo.pinCode, 'pin')}
              className="text-amber-200 hover:text-white hover:bg-amber-950/80 font-semibold text-xs"
            >
              {copiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-[11px] text-amber-200/60 font-sans">
            Saisir le code sur le pavé tactile puis valider avec la touche <strong>#</strong>.
          </p>
        </div>

        {/* Code Boîte à clés de secours */}
        <div className="bg-black/60 p-4 rounded-xl border border-stone-800 space-y-2 backdrop-blur-sm">
          <div className="flex justify-between items-center text-xs text-stone-400 font-serif">
            <span>Boîte à Clés Physiques (Secours)</span>
            <span className="text-[10px] font-mono text-stone-400">Accès Mécanique</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-2xl font-bold tracking-wider text-amber-100">
              {accessInfo?.keyboxCode || '----'}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => accessInfo && copyToClipboard(accessInfo.keyboxCode, 'keybox')}
              className="text-amber-200/70 hover:text-white hover:bg-stone-900"
            >
              {copiedKeybox ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Info PWA offline */}
        <div className="flex items-center gap-2 text-[11px] text-amber-100/70 bg-black/40 p-3 rounded-xl border border-amber-900/30">
          <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            Grâce à l'application <strong>CosyNest PWA</strong>, vos codes d'accès restent sauvegardés sur votre smartphone même sans réseau.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
