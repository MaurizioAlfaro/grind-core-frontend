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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        <p
          style={{
            color: "#fef3c7",
            fontSize: disclaimerFontSize,
            fontWeight: "500",
          }}
        >
          <span style={{ fontWeight: "700", color: "#fbbf24" }}>
            ⚠️ Disclaimer:
          </span>{" "}
          Casino chips are not related to gold as of now. They will be in the
          future. Game state resets on every page refresh for testing purposes.
        </p>
      </div>
    </div>
  );
};

const AddChipsButton: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const restartGame = () => {
    // Clear all casino-related localStorage items
    const casinoKeys = [
      // Blackjack
      "blackjack_chips",
      "blackjack_bets",
      "blackjack_gameState",
      "blackjack_settings",
      // Baccarat
      "baccarat_chips",
      "baccarat_bets",
      "baccarat_gameState",
      "baccarat_settings",
      // Roulette
      "roulette_chips",
      "roulette_bets",
      "roulette_gameState",
      "roulette_settings",
      // General casino
      "casino_chips",
      "casino_bets",
      "casino_gameState",
      "casino_settings",
      // Casino suit state
      "casinoSuitState",
    ];

    casinoKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    // Nuclear option: Force complete page reload to reset EVERYTHING
    // This is the only way to guarantee 100% clean slate
    setTimeout(() => {
      window.location.reload();
    }, 1500);
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

  return (
    <div
      style={{
        position: "absolute",
        bottom: "1rem",
        left: "1rem",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.5rem",
      }}
    >
      {/* Restart Game Button */}
      <button
        onClick={restartGame}
        style={{
          padding: buttonPadding,
          background: "#dc2626",
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
          e.currentTarget.style.background = "#b91c1c";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#dc2626";
        }}
        title="Restart all casino games and reset all state"
      >
        🔄 Restart Casino
      </button>

      {/* Success message */}
      {showSuccess && (
        <div
          style={{
            background: "#dc2626",
            color: "white",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.5rem",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            fontSize: buttonFontSize,
            animation: "fadeIn 0.3s ease-out forwards",
          }}
        >
          ✅ Casino reset! Page reloading for complete reset...
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

  // Clear localStorage on every refresh to prevent corrupted state
  useEffect(() => {
    // Clear casino-related localStorage items
    localStorage.removeItem("casinoSuitState");
    localStorage.removeItem("baccarat_chips");
    localStorage.removeItem("roulette_chips");
    localStorage.removeItem("casino_chips");
    console.log("Casino localStorage cleared on refresh");
  }, []);

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
