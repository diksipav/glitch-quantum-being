
import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";

export function MainLayout() {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-background scanlines">
      {isMobile ? <BottomNav /> : <Header />}
      <main className="pb-24 md:pt-24 md:pb-8 px-4">
        <Outlet />
      </main>
    </div>
  );
}
