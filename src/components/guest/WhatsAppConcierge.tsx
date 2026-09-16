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
    <Card className="bg-white border-amber-900/10 text-amber-950 rounded-2xl shadow-sm">
      <CardHeader className="pb-3 border-b border-amber-900/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100/60 text-emerald-700 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-serif font-bold text-amber-950">Canal WhatsApp Concierge</CardTitle>
              <p className="text-[11px] text-amber-900/60 font-medium">Assistance dédiée 7j/7</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        <p className="text-xs text-amber-900/80 font-medium leading-relaxed">
          Notre concierge dédié est à votre disposition durant tout votre séjour pour vos demandes particulières (chef à domicile, ESF, bois de chauffage, forfaits).
        </p>

        <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-900/15 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-950 font-medium">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Horaires de conciergerie : 08h00 - 22h00</span>
          </div>
          <span className="text-[10px] font-bold font-serif text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
            En ligne
          </span>
        </div>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block pt-1">
          <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-serif font-semibold text-xs py-3 rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" /> Ouvrir la discussion WhatsApp
          </Button>
        </a>
      </CardContent>
    </Card>
  );
};
