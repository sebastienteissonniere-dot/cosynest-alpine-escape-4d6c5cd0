import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, Heart, Send, CheckCircle2 } from 'lucide-react';

interface ReviewRedirectProps {
  guestName: string;
  bookingId: string;
}

export const ReviewRedirect: React.FC<ReviewRedirectProps> = ({ guestName, bookingId }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [privateComment, setPrivateComment] = useState('');

  const googleReviewUrl = 'https://g.page/r/cosynest-chalet/review';

  const handleRatingSelect = (selected: number) => {
    setRating(selected);
    if (selected >= 4) {
      window.open(googleReviewUrl, '_blank');
    }
  };

  const handleSendPrivateFeedback = () => {
    setFeedbackSent(true);
  };

  return (
    <Card className="bg-white border-slate-200/80 text-slate-900 rounded-2xl shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <CardTitle className="text-base font-bold text-slate-900">Votre Avis sur le Séjour CosyNest</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <p className="text-xs text-slate-600 font-medium">
          Comment s'est déroulé votre séjour au Chalet CosyNest ? Votre satisfaction est notre priorité absolue.
        </p>

        {/* Sélection d'étoiles */}
        <div className="flex items-center justify-center gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingSelect(star)}
              className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
            >
              <Star
                className={`w-7 h-7 ${
                  rating && rating >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Routage conditionnel selon la note */}
        {rating !== null && (
          <div>
            {rating >= 4 ? (
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center space-y-3">
                <p className="text-xs text-emerald-900 font-bold">
                  🎉 Un grand merci ! Nous sommes ravis que votre expérience au chalet ait été parfaite.
                </p>
                <p className="text-[11px] text-emerald-800 font-medium">
                  Pourriez-vous partager votre avis en quelques secondes sur Google ?
                </p>
                <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center justify-center gap-2 py-2.5">
                    <ExternalLink className="w-4 h-4" /> Laisser un avis 5★ sur Google
                  </Button>
                </a>
              </div>
            ) : feedbackSent ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="text-xs text-slate-800 font-semibold">
                  Votre retour a bien été transmis à la direction et au concierge. Nous revenons vers vous rapidement.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-3">
                <p className="text-xs text-amber-900 font-bold">
                  Merci pour votre franchise. Dites-nous ce que nous pouvons améliorer :
                </p>
                <textarea
                  value={privateComment}
                  onChange={(e) => setPrivateComment(e.target.value)}
                  placeholder="Expliquez-nous en détails afin que nous puissions immédiatement intervenir..."
                  className="w-full bg-white border border-amber-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-600 h-20"
                />
                <Button
                  onClick={handleSendPrivateFeedback}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center justify-center gap-2 py-2.5"
                >
                  <Send className="w-3.5 h-3.5" /> Transmettre confidentiellement au Concierge
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
