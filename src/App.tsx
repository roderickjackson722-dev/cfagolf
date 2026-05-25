import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { ProtectedShell } from "@/components/ProtectedShell";

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
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import Admin from "./pages/Admin";
import PaymentSuccess from "./pages/PaymentSuccess";
import MemberPreview from "./pages/MemberPreview";
import About from "./pages/About";
import SubmitTestimonial from "./pages/SubmitTestimonial";
import Flyer from "./pages/Flyer";
import Welcome from "./pages/Welcome";
import SocialLanding from "./pages/SocialLanding";
import SocialKit from "./pages/SocialKit";
import WagrTournaments from "./pages/WagrTournaments";
import TransferPortalTracker from "./pages/TransferPortalTracker";
import TransferGuide from "./pages/TransferGuide";
import TransferFlyer from "./pages/TransferFlyer";
import PlayerRelease from "./pages/PlayerRelease";
import Shop from "./pages/Shop";
import RecruitingRoadmap from "./pages/shop/RecruitingRoadmap";
import EmailTemplates from "./pages/shop/EmailTemplates";
import AthleteResume from "./pages/shop/AthleteResume";
import RecruitingHuddle from "./pages/shop/RecruitingHuddle";
import NotFound from "./pages/NotFound";
import Unsubscribe from "./pages/Unsubscribe";
import Coaching from "./pages/Coaching";
import MeetingAgenda from "./pages/MeetingAgenda";
import Review from "./pages/Review";
import CoachLogin from "./pages/coach/CoachLogin";
import CoachDashboard from "./pages/coach/CoachDashboard";
import CoachProfileEdit from "./pages/coach/CoachProfileEdit";
import CoachPublicProfile from "./pages/coach/CoachPublicProfile";
import PresentationStart from "./pages/admin/Presentation";
import PresentationMode from "./pages/admin/PresentationMode";
import PresentationView from "./pages/PresentationView";
import RecruitingTimeline from "./pages/RecruitingTimeline";
import SwingVault from "./pages/SwingVault";
import SwingGallery from "./pages/SwingGallery";
import SwingProfile from "./pages/SwingProfile";
import CoreCourseTrackerPage from "./pages/CoreCourseTrackerPage";
import DocumentVault from "./pages/DocumentVault";
import SharedDocuments from "./pages/SharedDocuments";
import SelfPaced from "./pages/SelfPaced";
import SelfPacedModule from "./pages/SelfPacedModule";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PlayerSite from "./pages/PlayerSite";
import PlayerLogin from "./pages/PlayerLogin";
import PlayerDashboard from "./pages/PlayerDashboard";
import AdminPlayers from "./pages/admin/AdminPlayers";
import AdminPlayerEdit from "./pages/admin/AdminPlayerEdit";


const queryClient = new QueryClient();

// Component to handle visitor tracking
function VisitorTracker() {
  useVisitorTracking();
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <VisitorTracker />
      <ProtectedShell />
      
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
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/member-preview" element={<MemberPreview />} />
            <Route path="/about" element={<About />} />
            <Route path="/share-your-experience" element={<SubmitTestimonial />} />
            <Route path="/flyer" element={<Flyer />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/go" element={<SocialLanding />} />
            <Route path="/social-kit" element={<SocialKit />} />
            <Route path="/tools/wagr-tournaments" element={<WagrTournaments />} />
            <Route path="/tools/transfer-portal" element={<TransferPortalTracker />} />
            <Route path="/tools/transfer-guide" element={<TransferGuide />} />
            <Route path="/tools/recruiting-timeline" element={<RecruitingTimeline />} />
            <Route path="/flyer/transfer" element={<TransferFlyer />} />
            <Route path="/player-release" element={<PlayerRelease />} />
            <Route path="/ebook" element={<Shop />} />
            <Route path="/ebook/roadmap" element={<RecruitingRoadmap />} />
            <Route path="/ebook/templates" element={<EmailTemplates />} />
            <Route path="/ebook/resume" element={<AthleteResume />} />
            <Route path="/ebook/course" element={<RecruitingHuddle />} />
            <Route path="/toolkit" element={<Navigate to="/ebook" replace />} />
            <Route path="/shop" element={<Navigate to="/ebook" replace />} />
            <Route path="/shop/*" element={<Navigate to="/ebook" replace />} />
            <Route path="/coaching" element={<Coaching />} />
            <Route path="/meeting-agenda/:userId" element={<MeetingAgenda />} />
            <Route path="/review" element={<Review />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/coach/login" element={<CoachLogin />} />
            <Route path="/coach/dashboard" element={<CoachDashboard />} />
            <Route path="/coach/profile/edit" element={<CoachProfileEdit />} />
            <Route path="/coach/:slug" element={<CoachPublicProfile />} />
            <Route path="/admin/presentation" element={<PresentationStart />} />
            <Route path="/admin/presentation/mode" element={<PresentationMode />} />
            <Route path="/presentation/:token" element={<PresentationView />} />
            <Route path="/tools/swing-vault" element={<SwingVault />} />
            <Route path="/tools/core-course-tracker" element={<CoreCourseTrackerPage />} />
            <Route path="/tools/document-vault" element={<DocumentVault />} />
            <Route path="/shared/:token" element={<SharedDocuments />} />
            <Route path="/self-paced" element={<SelfPaced />} />
            <Route path="/self-paced/:slug" element={<SelfPacedModule />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/terms" element={<Navigate to="/terms-of-use" replace />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/m/swing" element={<SwingGallery />} />
            <Route path="/m/swing/:userId" element={<SwingProfile />} />
            <Route path="/p/:slug" element={<PlayerSite />} />
            <Route path="/player/login" element={<PlayerLogin />} />
            <Route path="/player/dashboard" element={<PlayerDashboard />} />
            <Route path="/admin/players" element={<AdminPlayers />} />
            <Route path="/admin/players/new" element={<AdminPlayerEdit />} />
            <Route path="/admin/players/:id/edit" element={<AdminPlayerEdit />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
