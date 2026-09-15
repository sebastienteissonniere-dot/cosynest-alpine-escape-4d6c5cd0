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
    <Card className="bg-white border-slate-200/80 text-slate-900 rounded-2xl shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-base font-bold text-slate-900">{title}</CardTitle>
          </div>
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            {type === 'check_in' ? 'Arrivée (24h réserves)' : 'Départ'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
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
                    ? 'bg-slate-50 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 cursor-pointer" onClick={() => toggleRoom(room.id)}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleRoom(room.id)}
                      className="mt-1 rounded border-slate-300 bg-white text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{room.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{room.description}</p>
                    </div>
                  </div>

                  <label className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer transition-colors relative">
                    <Camera className="w-4 h-4 text-indigo-600" />
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
          <label className="text-xs text-slate-700 font-semibold">Remarques ou réserves éventuelles :</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Ex : Légère rayure constatée sur la table en bois à l'arrivée..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 h-20"
          />
        </div>
      </CardContent>

      <CardFooter className="pt-1 pb-4">
        <Button
          onClick={handleSubmit}
          disabled={!isAllChecked}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3 rounded-xl shadow-md shadow-indigo-600/20"
        >
          <ShieldCheck className="w-4 h-4 mr-2" /> Valider l'{title}
        </Button>
      </CardFooter>
    </Card>
  );
};
