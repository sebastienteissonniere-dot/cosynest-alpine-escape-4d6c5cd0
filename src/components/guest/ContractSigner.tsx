import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, ShieldCheck, Download, Edit3, Trash2 } from 'lucide-react';
import { Beds24Reservation } from '@/lib/beds24';

interface ContractSignerProps {
  reservation: Beds24Reservation;
  onSigned: (signedAt: string) => void;
}

export const ContractSigner: React.FC<ContractSignerProps> = ({ reservation, onSigned }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [signed, setSigned] = useState(reservation.contractSigned);
  const [signedTimestamp, setSignedTimestamp] = useState<string | null>(reservation.contractSignedAt || null);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = '#4F46E5'; // Indigo stroke
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();

    if (!hasSignature) setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSign = () => {
    if (!hasSignature || !acceptedTerms) return;
    const now = new Date().toISOString();
    setSigned(true);
    setSignedTimestamp(now);
    onSigned(now);
  };

  if (signed) {
    return (
      <Card className="bg-emerald-50/80 border-emerald-200 text-emerald-950 rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
          <div>
            <CardTitle className="text-base font-bold text-emerald-900">
              Contrat de Location Signé Électroniquement
            </CardTitle>
            <p className="text-xs text-emerald-700 font-medium">
              Horodaté le {signedTimestamp ? new Date(signedTimestamp).toLocaleString('fr-FR') : 'Récemment'}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-emerald-800 pt-1">
          <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 space-y-1 text-xs shadow-xs">
            <p><span className="font-bold text-emerald-900">Locataire :</span> {reservation.guestName}</p>
            <p><span className="font-bold text-emerald-900">Période :</span> Du {reservation.checkIn} au {reservation.checkOut}</p>
            <p><span className="font-bold text-emerald-900">Montant total :</span> {reservation.totalAmount} €</p>
            <p><span className="font-bold text-emerald-900">Statut eIDAS :</span> Valide & Conforme</p>
          </div>
          <Button variant="outline" size="sm" className="w-full border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-100 font-semibold rounded-xl text-xs">
            <Download className="w-4 h-4 mr-2 text-emerald-600" /> Télécharger mon contrat PDF
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-slate-200/80 text-slate-900 rounded-2xl shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-base font-bold text-slate-900">Contrat de Location Saisonnière Directe</CardTitle>
          </div>
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            Direct Booking
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Termes du contrat */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 max-h-48 overflow-y-auto space-y-2 leading-relaxed">
          <p className="font-bold text-indigo-900">CONTRAT DE LOCATION DE VACANCES - CHALET COSYNEST</p>
          <p>
            Entre le propriétaire du Chalet CosyNest et le locataire principal <strong>{reservation.guestName}</strong> ({reservation.guestEmail}), pour le séjour du <strong>{reservation.checkIn}</strong> au <strong>{reservation.checkOut}</strong> ({reservation.numberOfGuests} personnes).
          </p>
          <p className="font-bold text-slate-800">1. Usage du bien :</p>
          <p>
            Le logement est destiné exclusivement à l'usage de villégiature privée. Les fêtes et événements non autorisés sont strictement interdits.
          </p>
          <p className="font-bold text-slate-800">2. Jacuzzi & Sauna :</p>
          <p>
            L'utilisation de l'espace bien-être se fait sous la responsabilité des occupants. Les enfants doivent être sous la surveillance constante d'un adulte.
          </p>
          <p className="font-bold text-slate-800">3. Règlement intérieur :</p>
          <p>
            Chalet non-fumeur. Les animaux ne sont admis qu'après accord préalable. Le calme doit être respecté après 22h00.
          </p>
        </div>

        {/* Case à cocher d'acceptation */}
        <div className="flex items-start space-x-3 pt-1">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
            className="mt-0.5 border-slate-300 data-[state=checked]:bg-indigo-600"
          />
          <label htmlFor="terms" className="text-xs text-slate-700 font-medium leading-snug cursor-pointer">
            J'ai lu et j'accepte les conditions du contrat de location ainsi que le règlement intérieur du Chalet CosyNest.
          </label>
        </div>

        {/* Pad de signature */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1"><Edit3 className="w-3.5 h-3.5 text-indigo-600" /> Signer dans l'encadré :</span>
            {hasSignature && (
              <button onClick={clearCanvas} className="text-red-600 hover:text-red-700 flex items-center gap-1 text-[11px] font-semibold">
                <Trash2 className="w-3 h-3" /> Effacer
              </button>
            )}
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <canvas
              ref={canvasRef}
              width={340}
              height={120}
              className="w-full h-28 touch-none cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-1 pb-4">
        <Button
          onClick={handleSign}
          disabled={!hasSignature || !acceptedTerms}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3 rounded-xl shadow-md shadow-indigo-600/20"
        >
          <ShieldCheck className="w-4 h-4 mr-2" /> Valider et Signer le Contrat
        </Button>
      </CardFooter>
    </Card>
  );
};
