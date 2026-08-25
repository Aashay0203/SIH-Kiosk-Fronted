import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import Navbar from "./Navbar";
import SlideBar from "./SlideBar";
import { SidebarContext } from "./useSidebarContext";
import "./Applayout.css";

// ─── AppLayout ────────────────────────────────────────────────────────────────
export default function AppLayout() {
  // Mobile: < 768px | Tablet+: ≥ 768px
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Desktop sidebar state (user-controlled toggle) — starts open
  const [isOpenDesktop, setIsOpenDesktop] = useState(true);

  // Mobile sidebar state (overlay) — starts closed
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Derived state: use appropriate state based on viewport
  const isOpen = isMobile ? isOpenMobile : isOpenDesktop;

  const toggle = useCallback(() => {
    if (isMobile) {
      setIsOpenMobile((prev) => !prev);
    } else {
      setIsOpenDesktop((prev) => !prev);
    }
  }, [isMobile]);

  const close = useCallback(() => {
    if (isMobile) {
      setIsOpenMobile(false);
    } else {
      setIsOpenDesktop(false);
    }
  }, [isMobile]);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      <div className="al-root">
        {/* ── Sidebar ── */}
        <SlideBar
          open={isOpen}
          onClose={close}
          variant={isMobile ? "temporary" : "persistent"}
        />

        {/* ── Right side: navbar + page content ── */}
        <div
          className={`al-body ${!isMobile && isOpen ? "al-body--shifted" : ""}`}
        >
          <Navbar onAvatarClick={toggle} />

          <main className="al-main">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
