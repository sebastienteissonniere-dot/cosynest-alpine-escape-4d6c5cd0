import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Reservation from "./pages/Reservation";
import Chalet from "./pages/Chalet";
import Around from "./pages/Around";
import Weather from "./pages/Weather";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";
import MentionsLegales from "./pages/MentionsLegales";
import CookieConsent from "@/components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ComingSoon />} />
            <Route path="/dev" element={<Index />} />
            <Route path="/chalet" element={<Chalet />} />
            <Route path="/around" element={<Around />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <CookieConsent />
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
