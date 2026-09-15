import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock } from 'lucide-react';

interface WhatsAppConciergeProps {
  guestName: string;
  bookingId: string;
}

export const WhatsAppConcierge: React.FC<WhatsAppConciergeProps> = ({ guestName, bookingId }) => {
  const conciergePhoneNumber = '+33600000000';
  const defaultMessage = encodeURIComponent(
    `Bonjour ! Je suis ${guestName} (Réservation ${bookingId} au Chalet CosyNest). J'aurais une question concernant notre séjour.`
  );
  const whatsappUrl = `https://wa.me/${conciergePhoneNumber}?text=${defaultMessage}`;

  return (
    <Card className="bg-white border-slate-200/80 text-slate-900 rounded-2xl shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Canal WhatsApp Concierge</CardTitle>
              <p className="text-[11px] text-slate-500 font-medium">Assistance dédiée 7j/7</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          Notre concierge dédié est à votre disposition durant tout votre séjour pour vos demandes particulières (chef à domicile, ESF, bois de chauffage, forfaits).
        </p>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Horaires de conciergerie : 08h00 - 22h00</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
            En ligne
          </span>
        </div>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block pt-1">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-3 rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" /> Ouvrir la discussion WhatsApp
          </Button>
        </a>
      </CardContent>
    </Card>
  );
};
