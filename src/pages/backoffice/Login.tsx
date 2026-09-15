import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, User, KeyRound } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';

export default function BackofficeLogin() {
  const [email, setEmail] = useState('proprietaire@cosynest.fr');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<UserRole>('admin');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/backoffice/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, role);
    setLoading(false);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 antialiased font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Typography Logo Header as on chaletcosynest.fr/dev */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Chalet Cosynest
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Backoffice Propriétaire & Conciergerie (Beds24)
          </p>
        </div>

        <Card className="bg-white border-slate-200/80 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 pt-5">
              <CardTitle className="text-base font-bold text-slate-800 text-center flex items-center justify-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-600" /> Espace de Connexion Sécurisé
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Adresse Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-slate-200 text-slate-900 text-xs focus:border-indigo-600 focus:ring-indigo-600/20 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Mot de passe</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-slate-200 text-slate-900 text-xs focus:border-indigo-600 focus:ring-indigo-600/20 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Sélectionner votre profil :</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'admin'
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-600" /> Propriétaire
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('concierge')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'concierge'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-4 h-4 text-emerald-600" /> Concierge
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2 pb-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3 rounded-xl shadow-lg shadow-indigo-600/20"
              >
                {loading ? 'Connexion en cours...' : 'Accéder au Backoffice'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
