import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Camera, CheckCircle2, ShieldCheck } from 'lucide-react';

interface InventoryInspectorProps {
  type: 'check_in' | 'check_out';
  isCompleted: boolean;
  onComplete: () => void;
}

const ROOMS = [
  { id: 'living', name: 'Grand Séjour & Cheminée', description: 'Canapés, télévision, cheminée à bois, luminaires' },
  { id: 'spa', name: 'Espace Bien-Être (Jacuzzi & Sauna)', description: 'Jacuzzi 6 places, sauna nordique, serviettes' },
  { id: 'kitchen', name: 'Cuisine Équipée & Salle à manger', description: 'Électroménager, vaisselle, table en bois massif' },
  { id: 'bedrooms', name: 'Chambres & Salles de bains', description: 'Literie haut de gamme, draps, douches à l’italienne' },
  { id: 'ski_room', name: 'Local à Ski & Extérieurs', description: 'Sèche-chaussures, râteliers skis, terrasse' },
];

export const InventoryInspector: React.FC<InventoryInspectorProps> = ({
  type,
  isCompleted,
  onComplete,
}) => {
  const [checkedRooms, setCheckedRooms] = useState<Record<string, boolean>>({});
  const [photos, setPhotos] = useState<Record<string, File>>({});
  const [remarks, setRemarks] = useState('');
  const [done, setDone] = useState(isCompleted);

  const toggleRoom = (roomId: string) => {
    setCheckedRooms((prev) => ({ ...prev, [roomId]: !prev[roomId] }));
  };

  const handlePhotoAdd = (roomId: string, file: File) => {
    setPhotos((prev) => ({ ...prev, [roomId]: file }));
  };

  const isAllChecked = ROOMS.every((r) => checkedRooms[r.id]);

  const handleSubmit = () => {
    setDone(true);
    onComplete();
  };

  const title = type === 'check_in' ? "État des Lieux d'Entrée" : "État des Lieux de Sortie";

  if (done) {
    return (
      <Card className="bg-emerald-50/80 border-emerald-200 text-emerald-950 rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 py-3">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
          <div>
            <CardTitle className="text-base font-bold text-emerald-900">{title} Validé</CardTitle>
            <p className="text-xs text-emerald-700 font-medium">
              Rapport enregistré et transmis à la conciergerie avec horodatage.
            </p>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-amber-900/10 text-amber-950 rounded-2xl shadow-sm">
      <CardHeader className="pb-3 border-b border-amber-900/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-[#9B6B43]" />
            <CardTitle className="text-base font-serif font-bold text-amber-950">{title}</CardTitle>
          </div>
          <span className="text-[11px] font-bold font-serif text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/60">
            {type === 'check_in' ? 'Arrivée (24h réserves)' : 'Départ'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <p className="text-xs text-amber-900/80 font-medium leading-relaxed">
          Veuillez contrôler les espaces du chalet et joindre des photos en cas de réserve particulière.
        </p>

        <div className="space-y-2">
          {ROOMS.map((room) => {
            const isChecked = !!checkedRooms[room.id];
            const roomPhoto = photos[room.id];

            return (
              <div
                key={room.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isChecked
                    ? 'bg-amber-50/60 border-emerald-400'
                    : 'bg-white border-amber-900/15 hover:border-amber-900/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 cursor-pointer" onClick={() => toggleRoom(room.id)}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleRoom(room.id)}
                      className="mt-1 rounded border-amber-900/30 bg-white text-emerald-700 focus:ring-emerald-500"
                    />
                    <div>
                      <h4 className="text-xs font-serif font-bold text-amber-950">{room.name}</h4>
                      <p className="text-[11px] text-amber-900/70 font-medium">{room.description}</p>
                    </div>
                  </div>

                  <label className="p-2 bg-amber-100/60 text-amber-950 rounded-lg hover:bg-amber-100 cursor-pointer transition-colors relative">
                    <Camera className="w-4 h-4 text-[#9B6B43]" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handlePhotoAdd(room.id, e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>
                </div>

                {roomPhoto && (
                  <p className="mt-2 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Photo jointe : {roomPhoto.name}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-1">
          <label className="text-xs text-amber-950 font-serif font-semibold">Remarques ou réserves éventuelles :</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Ex : Légère rayure constatée sur la table en bois à l'arrivée..."
            className="w-full bg-amber-50/50 border border-amber-900/15 rounded-xl p-3 text-xs text-amber-950 focus:outline-none focus:border-[#9B6B43] h-20 placeholder:text-amber-900/40"
          />
        </div>
      </CardContent>

      <CardFooter className="pt-1 pb-4">
        <Button
          onClick={handleSubmit}
          disabled={!isAllChecked}
          className="w-full bg-[#9B6B43] hover:bg-[#855a38] text-white font-serif font-semibold text-xs py-3 rounded-xl shadow-md shadow-[#9B6B43]/20"
        >
          <ShieldCheck className="w-4 h-4 mr-2" /> Valider l'{title}
        </Button>
      </CardFooter>
    </Card>
  );
};
