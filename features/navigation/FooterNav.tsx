import React from "react";
import { MissionIcon } from "./icons/MissionIcon";
import { CollectionIcon } from "./icons/CollectionIcon";
import { StoreIcon } from "./icons/StoreIcon";
import { ForgeIcon } from "./icons/ForgeIcon";
import { LabIcon } from "./icons/LabIcon";
import { CasinoIcon } from "./icons/CasinoIcon";
import { SettingsIcon } from "./icons/SettingsIcon";

export type AppView =
  | "missions"
  | "bosses"
  | "collection"
  | "lab"
  | "store"
  | "casino"
  | "forge"
  | "leaderboard"
  | "badges"
  | "wiki"
  | "wizard"
  | "settings";

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ReactNode;
}

const allNavItems: NavItem[] = [
  { id: "missions", label: "Missions", icon: <MissionIcon /> },
  { id: "collection", label: "Collection", icon: <CollectionIcon /> },
  { id: "forge", label: "Forge", icon: <ForgeIcon /> },
  { id: "lab", label: "Lab", icon: <LabIcon /> },
  { id: "store", label: "Store", icon: <StoreIcon /> },
  { id: "casino", label: "Casino", icon: <CasinoIcon /> },
  { id: "settings", label: "Account", icon: <SettingsIcon /> },
];

interface FooterNavProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onCasinoClick: () => void;
  missionActive: boolean;
  isLabUnlocked: boolean;
}

export const FooterNav: React.FC<FooterNavProps> = ({
  activeView,
  onNavigate,
  onCasinoClick,
  missionActive,
  isLabUnlocked,
}) => {
  const navItems = allNavItems.filter((item) => {
    if (item.id === "lab") {
      return isLabUnlocked;
    }
    return true;
  });

  const gridColsClass = `grid-cols-${navItems.length}`;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 z-30 h-20">
      <nav className={`max-w-xl mx-auto grid ${gridColsClass} h-full`}>
        {navItems.map((item) => (
          <button
            id={`footer-nav-${item.id}`}
            key={item.id}
            onClick={() => {
              if (item.id === "casino") {
                onCasinoClick();
              } else {
                onNavigate(item.id);
              }
            }}
            className={`flex flex-col items-center justify-center p-2 w-full transition-colors ${
              activeView === item.id
                ? "text-cyan-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
            aria-current={activeView === item.id ? "page" : undefined}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </nav>
    </footer>
  );
};
