import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import OrganHome from "./pages/OrganHome";
import OrganSignup from "./pages/OrganSignup";
import OrganSignupSuccess from "./pages/OrganSignupSuccess";
import RecipientSignup from "./pages/RecipientSignup";
import StaffSignup from "./pages/StaffSignup";
import OrgSignup from "./pages/OrgSignup";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import DonorHome from "./pages/DonorHome";
import RoleLogin from "./pages/RoleLogin";
import RecipientHome from "./pages/RecipientHome";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OrganHome />} />
          <Route path="/organ-donation/signup" element={<OrganSignup />} />
          <Route
            path="/organ-donation/success"
            element={<OrganSignupSuccess />}
          />

          <Route path="/recipient/signup" element={<RecipientSignup />} />
          <Route path="/recipient/success" element={<RegistrationSuccess />} />

          <Route path="/hospital-staff/signup" element={<StaffSignup />} />
          <Route
            path="/hospital-staff/success"
            element={<RegistrationSuccess />}
          />

          <Route path="/organizations/signup" element={<OrgSignup />} />
          <Route
            path="/organizations/success"
            element={<RegistrationSuccess />}
          />

          <Route path="/login" element={<RoleLogin />} />
          <Route path="/donor/home" element={<DonorHome />} />
          <Route path="/recipient/home" element={<RecipientHome />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
