import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { EnvironmentProvider } from "@/contexts/EnvironmentContext";
import PageTransition from "@/components/PageTransition";
import HolographicNav from "@/components/HolographicNav";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MarketplacePage from "./pages/MarketplacePage";
import DiseaseDetectionPage from "./pages/DiseaseDetectionPage";
import DashboardPage from "./pages/DashboardPage";
import WeatherPage from "./pages/WeatherPage";
import GovernmentSchemesPage from "./pages/GovernmentSchemesPage";
import AdminDashboard from "./pages/AdminDashboard";
import CommunityForumPage from "./pages/CommunityForumPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  // Apply dynamic environment theme (season + climate + day/night)
  useEnvironmentTheme();

  return (
    <>
      <PageTransition>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/government-schemes" element={<GovernmentSchemesPage />} />
          <Route path="/community" element={<CommunityForumPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
      <HolographicNav />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
