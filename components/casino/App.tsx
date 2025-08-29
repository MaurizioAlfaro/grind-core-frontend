import React, { useState, useEffect } from "react";
import BlackjackGame from "./features/blackjack";
import BaccaratGame from "./features/baccarat";
import RouletteGame from "./features/roulette";
import Chat from "./features/chat";
import DealerAvatar from "./components/DealerAvatar";

const Disclaimer: React.FC = () => {
  // Responsive dimensions
  const isSmallScreen =
    typeof window !== "undefined" && window.innerWidth < 640;
  const isMediumScreen =
    typeof window !== "undefined" && window.innerWidth < 768;

  const disclaimerPadding = isSmallScreen
    ? "0.75rem"
    : isMediumScreen
    ? "1rem"
    : "1rem";
  const disclaimerMargin = isSmallScreen ? "0.5rem" : "0.75rem";
  const disclaimerFontSize = isSmallScreen ? "0.75rem" : "0.875rem";
  const iconFontSize = isSmallScreen ? "1rem" : "1.125rem";

  return (
    <div
      style={{
        background:
          "linear-gradient(to right, rgba(120, 53, 15, 0.4), rgba(194, 65, 12, 0.4))",
        border: "1px solid rgba(245, 158, 11, 0.6)",
        borderRadius: "0.5rem",
        padding: disclaimerPadding,
        marginBottom: disclaimerMargin,
        textAlign: "center",
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        <span style={{ color: "#facc15", fontSize: iconFontSize }}>⚠️</span>
        <p
          style={{
            color: "#fef3c7",
            fontSize: disclaimerFontSize,
            fontWeight: "500",
          }}
        >
          <span style={{ fontWeight: "700", color: "#fbbf24" }}>
            Disclaimer:
          </span>{" "}
          Casino chips are not related to gold as of now. They will be in the
          future.
        </p>
        <span style={{ color: "#facc15", fontSize: iconFontSize }}>⚠️</span>
      </div>
    </div>
  );
};

const AddChipsButton: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentChips, setCurrentChips] = useState(0);

  // Get current chips for display
  useEffect(() => {
    const updateChips = () => {
      const chips = parseInt(localStorage.getItem("blackjack_chips") || "0");
      setCurrentChips(chips);
    };

    updateChips();
    window.addEventListener("chipsUpdated", updateChips);
    return () => window.removeEventListener("chipsUpdated", updateChips);
  }, []);

  const addChips = () => {
    // Get current chips from localStorage or default to 0
    const storedChips = parseInt(
      localStorage.getItem("blackjack_chips") || "0"
    );
    const newChips = storedChips + 1000;
    localStorage.setItem("blackjack_chips", newChips.toString());

    // Dispatch a custom event to notify the blackjack game
    window.dispatchEvent(
      new CustomEvent("chipsUpdated", { detail: { chips: newChips } })
    );

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  if (!isVisible) return null;

  // Responsive dimensions
  const isSmallScreen =
    typeof window !== "undefined" && window.innerWidth < 640;
  const isMediumScreen =
    typeof window !== "undefined" && window.innerWidth < 768;

  const buttonPadding = isSmallScreen
    ? "0.5rem 1rem"
    : isMediumScreen
    ? "0.75rem 1.25rem"
    : "1rem 1.5rem";
  const buttonFontSize = isSmallScreen
    ? "0.75rem"
    : isMediumScreen
    ? "0.875rem"
    : "1rem";
  const buttonTop = isSmallScreen ? "0.75rem" : "1rem";
  const buttonLeft = isSmallScreen ? "0.75rem" : "1rem";
  const successTop = isSmallScreen ? "2.5rem" : "3rem";

  return (
    <div
      style={{
        position: "absolute",
        top: buttonTop,
        left: buttonLeft,
        zIndex: 20,
      }}
    >
      <button
        onClick={addChips}
        style={{
          padding: buttonPadding,
          background: "#16a34a",
          color: "white",
          fontWeight: "700",
          borderRadius: "0.5rem",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          transition: "background-color 0.15s ease-in-out",
          border: "none",
          cursor: "pointer",
          fontSize: buttonFontSize,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#15803d";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#16a34a";
        }}
        title={`Add 1000 chips for testing (Current: ${currentChips})`}
      >
        🪙 +1000 Chips
      </button>

      {/* Success message */}
      {showSuccess && (
        <div
          style={{
            position: "absolute",
            top: successTop,
            left: 0,
            background: "#16a34a",
            color: "white",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.5rem",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            fontSize: buttonFontSize,
            animation: "fadeIn 0.3s ease-out forwards",
          }}
        >
          ✅ Added 1000 chips!
        </div>
      )}
    </div>
  );
};

const GameTab: React.FC<{
  title: string;
  isActive: boolean;
  onClick: () => void;
  isLocked?: boolean;
  requiredLevel?: number;
}> = ({ title, isActive, onClick, isLocked, requiredLevel }) => {
  // Responsive dimensions
  const isSmallScreen =
    typeof window !== "undefined" && window.innerWidth < 640;
  const isMediumScreen =
    typeof window !== "undefined" && window.innerWidth < 768;

  const tabPadding = isSmallScreen
    ? "0.5rem 0.75rem"
    : isMediumScreen
    ? "0.75rem 1rem"
    : "1rem 1.5rem";
  const tabFontSize = isSmallScreen
    ? "0.875rem"
    : isMediumScreen
    ? "1rem"
    : "1.125rem";

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      style={{
        padding: tabPadding,
        fontSize: tabFontSize,
        fontWeight: "700",
        borderTopLeftRadius: "0.5rem",
        borderTopRightRadius: "0.5rem",
        transition: "colors 0.15s ease-in-out",
        outline: "none",
        position: "relative",
        background: isActive
          ? "#2a503e"
          : isLocked
          ? "#4b5563"
          : "rgba(0, 0, 0, 0.3)",
        color: isActive ? "#fbbf24" : isLocked ? "#9ca3af" : "#ffffff",
        cursor: isLocked ? "not-allowed" : "pointer",
        border: "none",
      }}
      onMouseEnter={(e) => {
        if (!isLocked && !isActive) {
          e.currentTarget.style.background = "rgba(0, 0, 0, 0.5)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isLocked && !isActive) {
          e.currentTarget.style.background = "rgba(0, 0, 0, 0.3)";
        }
      }}
    >
      {title}
      {isLocked && (
        <div
          style={{
            position: "absolute",
            top: "-0.5rem",
            right: "-0.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "0.75rem",
          }}
        >
          <span style={{ color: "#9ca3af" }}>🔒</span>
        </div>
      )}
    </button>
  );
};

const App: React.FC<{ playerLevel: number; currentPlayerId?: string }> = ({
  playerLevel,
  currentPlayerId,
}) => {
  const [activeGame, setActiveGame] = useState<
    "blackjack" | "baccarat" | "roulette" | "chat"
  >("blackjack");

  // Responsive dimensions
  const isSmallScreen =
    typeof window !== "undefined" && window.innerWidth < 640;
  const isMediumScreen =
    typeof window !== "undefined" && window.innerWidth < 768;

  const containerPadding = isSmallScreen
    ? "0.25rem"
    : isMediumScreen
    ? "0.5rem"
    : "1rem";
  const tabGap = isSmallScreen ? "0.25rem" : "0.5rem";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#35654d",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        fontFamily: "sans-serif",
        padding: containerPadding,
        overflow: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "80rem",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            gap: tabGap,
          }}
        >
          <GameTab
            title="Blackjack"
            isActive={activeGame === "blackjack"}
            onClick={() => setActiveGame("blackjack")}
          />
          <GameTab
            title="Baccarat"
            isActive={activeGame === "baccarat"}
            onClick={() => setActiveGame("baccarat")}
            isLocked={playerLevel < 10}
            requiredLevel={10}
          />
          <GameTab
            title="Roulette"
            isActive={activeGame === "roulette"}
            onClick={() => setActiveGame("roulette")}
            isLocked={playerLevel < 20}
            requiredLevel={20}
          />
          <GameTab
            title="Chat"
            isActive={activeGame === "chat"}
            onClick={() => setActiveGame("chat")}
          />
        </div>

        {/* Disclaimer */}
        <Disclaimer />

        <div
          style={{
            position: "relative",
            flexGrow: 1,
            minHeight: 0,
            overflow: "auto",
          }}
        >
          {activeGame !== "chat" && <DealerAvatar />}

          {/* Add Chips Button - Only visible for blackjack */}
          <AddChipsButton isVisible={activeGame === "blackjack"} />

          {activeGame === "blackjack" && <BlackjackGame />}
          {activeGame === "baccarat" && <BaccaratGame />}
          {activeGame === "roulette" && <RouletteGame />}
          {activeGame === "chat" && <Chat currentPlayerId={currentPlayerId} />}
        </div>
      </div>
    </div>
  );
};

export default App;
