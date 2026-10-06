import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface BackofficeHeaderProps {
  activeTab: 'dashboard' | 'reservations' | 'keys' | 'crm';
  rightElement?: React.ReactNode;
}

export function BackofficeHeader({ activeTab, rightElement }: BackofficeHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* Top Sticky Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold text-slate-900 tracking-tight">Chalet Cosynest</h1>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Backoffice Beds24
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Connecté : <span className="text-slate-800 font-semibold">{user?.name}</span> ({user?.role})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/guest/demo" target="_blank">
              <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-indigo-600" /> Tester Guest App PWA
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                logout();
                navigate('/backoffice/login');
              }}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-1" /> Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Navigation Tabs Bar */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Link to="/backoffice/dashboard">
            <Button
              size="sm"
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              className={
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium rounded-xl'
              }
            >
              Dashboard
            </Button>
          </Link>
          <Link to="/backoffice/reservations">
            <Button
              size="sm"
              variant={activeTab === 'reservations' ? 'default' : 'ghost'}
              className={
                activeTab === 'reservations'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium rounded-xl'
              }
            >
              Réservations Beds24
            </Button>
          </Link>
          <Link to="/backoffice/igloohome-keys">
            <Button
              size="sm"
              variant={activeTab === 'keys' ? 'default' : 'ghost'}
              className={
                activeTab === 'keys'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium rounded-xl'
              }
            >
              Serrures Igloohome
            </Button>
          </Link>
          <Link to="/backoffice/crm">
            <Button
              size="sm"
              variant={activeTab === 'crm' ? 'default' : 'ghost'}
              className={
                activeTab === 'crm'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium rounded-xl'
              }
            >
              CRM & Campagnes
            </Button>
          </Link>
        </div>

        {rightElement && <div className="flex items-center gap-2">{rightElement}</div>}
      </div>
    </>
  );
}
