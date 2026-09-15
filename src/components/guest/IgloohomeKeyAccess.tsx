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
      <Card className="bg-white border-slate-200/80 text-slate-900 rounded-2xl shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              <CardTitle className="text-base font-bold text-slate-900">Accès Serrure Igloohome</CardTitle>
            </div>
            <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
              Verrouillé
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-red-900 space-y-1 font-medium">
              <p className="font-bold text-red-950">Les codes d'accès serrures sont verrouillés.</p>
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
    <Card className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 border-indigo-700/50 text-white rounded-2xl shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Key className="w-32 h-32 text-indigo-400" />
      </div>

      <CardHeader className="pb-3 border-b border-indigo-800/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-white">Vos Codes d'Accès Igloohome</CardTitle>
              <p className="text-[11px] text-indigo-300 flex items-center gap-1 mt-0.5 font-medium">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Valides pour la durée du séjour
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
            Actif
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Code PIN Serrure Principale */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-indigo-500/40 space-y-2 backdrop-blur-sm">
          <div className="flex justify-between items-center text-xs text-indigo-200">
            <span>Serrure Connectée Entrée Principale</span>
            <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-900 px-2.5 py-0.5 rounded-full border border-indigo-700">
              Digicode Igloohome
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-3xl font-extrabold tracking-widest text-indigo-300">
              {accessInfo?.pinCode || '------'}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => accessInfo && copyToClipboard(accessInfo.pinCode, 'pin')}
              className="text-indigo-300 hover:text-white hover:bg-indigo-900/60 font-semibold text-xs"
            >
              {copiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-[11px] text-slate-400">
            Saisir le code sur le pavé tactile puis valider avec la touche <strong>#</strong>.
          </p>
        </div>

        {/* Code Boîte à clés de secours */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 backdrop-blur-sm">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Boîte à Clés Physiques (Secours)</span>
            <span className="text-[10px] font-mono text-slate-400">Accès Mécanique</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-2xl font-bold tracking-wider text-slate-200">
              {accessInfo?.keyboxCode || '----'}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => accessInfo && copyToClipboard(accessInfo.keyboxCode, 'keybox')}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {copiedKeybox ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Info PWA offline */}
        <div className="flex items-center gap-2 text-[11px] text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
          <WifiOff className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span>
            Grâce à l'application <strong>CosyNest PWA</strong>, vos codes d'accès restent sauvegardés sur votre smartphone même sans réseau.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
