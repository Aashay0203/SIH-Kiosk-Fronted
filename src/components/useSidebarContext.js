import { createContext, useContext } from "react";

// ─── Sidebar Context ──────────────────────────────────────────────────────────
export const SidebarContext = createContext({ isOpen: false, toggle: () => { } });

export const useSidebar = () => useContext(SidebarContext);
