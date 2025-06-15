
import { Outlet, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";
import { MobileHeader } from "./MobileHeader";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function MainLayout() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background scanlines">
      {isMobile ? <MobileHeader /> : <Header />}
      
      {user && (
        <button 
          onClick={handleLogout} 
          className="fixed top-20 md:top-18 right-4 z-50 text-destructive font-mono uppercase text-sm animate-pulse hover:animate-none hover:text-destructive/80 transition-colors"
        >
          End Session
        </button>
      )}

      <main className="px-4 pt-28 pb-24 md:pt-24 md:pb-8">
        <Outlet />
      </main>
      {isMobile && <BottomNav />}
    </div>
  );
}
