
import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";
import { MobileHeader } from "./MobileHeader";

export function MainLayout() {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-background scanlines">
      {isMobile ? <MobileHeader /> : <Header />}
      <main className="px-4 pt-28 pb-24 md:pt-24 md:pb-8">
        <Outlet />
      </main>
      {isMobile && <BottomNav />}
    </div>
  );
}
