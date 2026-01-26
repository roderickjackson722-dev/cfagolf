import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Pages
import Landing from "./pages/Landing";
import Database from "./pages/Database";
import Dashboard from "./pages/Dashboard";
import TargetSchoolBuilder from "./pages/TargetSchoolBuilder";
import CoachTracker from "./pages/CoachTracker";
import CampusVisits from "./pages/CampusVisits";
import TournamentLog from "./pages/TournamentLog";
import ScholarshipCalculator from "./pages/ScholarshipCalculator";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/database" element={<Database />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tools/target-schools" element={<TargetSchoolBuilder />} />
            <Route path="/tools/coach-tracker" element={<CoachTracker />} />
            <Route path="/tools/campus-visits" element={<CampusVisits />} />
            <Route path="/tools/tournament-log" element={<TournamentLog />} />
            <Route path="/tools/scholarship-calculator" element={<ScholarshipCalculator />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
