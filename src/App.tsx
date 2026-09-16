import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/backoffice/ProtectedRoute";
import { registerServiceWorker } from "@/pwaRegister";

import Index from "./pages/Index";
import Reservation from "./pages/Reservation";
import Chalet from "./pages/Chalet";
import Gallery from "./pages/Gallery";
import Plans from "./pages/Plans";
import Around from "./pages/Around";
import Journal from "./pages/Journal";
import BlogPost from "./pages/BlogPost";
import Weather from "./pages/Weather";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";
import MentionsLegales from "./pages/MentionsLegales";
import CookieConsent from "@/components/CookieConsent";

// PWA & Guest Portal & Backoffice
import GuestPortal from "./pages/GuestPortal";
import BackofficeLogin from "./pages/backoffice/Login";
import BackofficeDashboard from "./pages/backoffice/Dashboard";
import BackofficeReservations from "./pages/backoffice/Reservations";
import BackofficeInventories from "./pages/backoffice/Inventories";
import BackofficeIgloohomeKeys from "./pages/backoffice/IgloohomeKeys";

// Enregistrement du Service Worker PWA
registerServiceWorker();

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Site Public Chalet CosyNest */}
              <Route path="/" element={<ComingSoon />} />
              <Route path="/dev" element={<Index />} />
              <Route path="/dev/*" element={<Index />} />
              <Route path="/chalet" element={<Chalet />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/around" element={<Around />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/:slug" element={<BlogPost />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />

              {/* Guest App PWA Voyageur */}
              <Route path="/guest/:bookingId" element={<GuestPortal />} />

              {/* Backoffice Sécurisé Propriétaire & Conciergerie */}
              <Route path="/backoffice/login" element={<BackofficeLogin />} />
              <Route
                path="/backoffice"
                element={<Navigate to="/backoffice/dashboard" replace />}
              />
              <Route
                path="/backoffice/dashboard"
                element={
                  <ProtectedRoute>
                    <BackofficeDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backoffice/reservations"
                element={
                  <ProtectedRoute>
                    <BackofficeReservations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backoffice/inventories"
                element={
                  <ProtectedRoute>
                    <BackofficeInventories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/backoffice/igloohome-keys"
                element={
                  <ProtectedRoute>
                    <BackofficeIgloohomeKeys />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <CookieConsent />
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
