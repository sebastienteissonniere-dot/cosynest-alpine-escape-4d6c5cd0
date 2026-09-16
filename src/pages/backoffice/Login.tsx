import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, User, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';

export default function BackofficeLogin() {
  const [role, setRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('contact@chaletcosynest.fr');
  const [password, setPassword] = useState('Cosynest2026!');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/backoffice/dashboard';

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setEmail('contact@chaletcosynest.fr');
      setPassword('Cosynest2026!');
    } else {
      setEmail('concierge@chaletcosynest.fr');
      setPassword('Concierge2026!');
    }
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await login(email, password, role);
    setLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.error || 'Erreur d\'authentification. Veuillez vérifier vos identifiants.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-amber-950 flex items-center justify-center p-4 antialiased font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Typography Logo Header matching chaletcosynest.fr/dev */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-serif font-bold text-amber-950 tracking-tight">
            Chalet Cosynest
          </h1>
          <p className="text-xs text-amber-900/70 font-serif font-medium">
            Backoffice Propriétaire & Conciergerie (BDD Infomaniak)
          </p>
        </div>

        <Card className="bg-white border-amber-900/10 shadow-xl rounded-2xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <CardHeader className="border-b border-amber-900/10 bg-amber-50/50 pb-4 pt-5">
              <CardTitle className="text-base font-serif font-bold text-amber-950 text-center flex items-center justify-center gap-2">
                <KeyRound className="w-4 h-4 text-[#9B6B43]" /> Espace de Connexion Sécurisé
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-serif font-semibold text-amber-950">Adresse Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-amber-50/40 border-amber-900/15 text-amber-950 text-xs focus:border-[#9B6B43] focus:ring-[#9B6B43]/20 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-serif font-semibold text-amber-950">Mot de passe</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-amber-50/40 border-amber-900/15 text-amber-950 text-xs focus:border-[#9B6B43] focus:ring-[#9B6B43]/20 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-serif font-semibold text-amber-950">Sélectionner votre profil :</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('admin')}
                    className={`p-2.5 rounded-xl border text-xs font-serif font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'admin'
                        ? 'bg-[#9B6B43] text-white border-[#9B6B43] shadow-sm'
                        : 'bg-amber-50/40 border-amber-900/15 text-amber-950 hover:bg-amber-100/50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" /> Propriétaire
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('concierge')}
                    className={`p-2.5 rounded-xl border text-xs font-serif font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'concierge'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                        : 'bg-amber-50/40 border-amber-900/15 text-amber-950 hover:bg-amber-100/50'
                    }`}
                  >
                    <User className="w-4 h-4" /> Concierge
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2 pb-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#9B6B43] hover:bg-[#855a38] text-white font-serif font-semibold text-xs py-3 rounded-xl shadow-lg shadow-[#9B6B43]/20"
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
