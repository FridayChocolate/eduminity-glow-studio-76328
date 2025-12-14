import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatBot } from "@/components/ChatBot";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import QASection from "./pages/QASection";
import StudyMaterials from "./pages/StudyMaterials";
import Community from "./pages/Community";
import Wallet from "./pages/Wallet";
import Premium from "./pages/Premium";
import Donate from "./pages/Donate";
import WriteStory from "./pages/WriteStory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/questions" element={<QASection />} />
          <Route path="/materials" element={<StudyMaterials />} />
          <Route path="/community" element={<Community />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/write" element={<WriteStory />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatBot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
