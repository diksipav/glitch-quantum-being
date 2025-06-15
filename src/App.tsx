
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { MainLayout } from "./components/layout/MainLayout";
import Meditation from "./pages/Meditation";
import Presence from "./pages/Presence";
import Ritual from "./pages/Ritual";
import Journal from "./pages/Journal";
import Matrix from "./pages/Matrix";
import Auth from "./pages/Auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import RitualLogs from "./pages/RitualLogs";
import JournalHistory from "./pages/JournalHistory";
import CosmicTutor from "./pages/CosmicTutor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/auth" element={<Auth />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/presence" element={<Presence />} />
              <Route path="/ritual" element={<Ritual />} />
              <Route path="/matrix" element={<Matrix />} />
              <Route path="/ritual-logs" element={<RitualLogs />} />
              <Route path="/journal-history" element={<JournalHistory />} />
              <Route path="/cosmic-tutor" element={<CosmicTutor />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
