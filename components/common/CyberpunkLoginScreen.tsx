import React, { useState, useEffect } from "react";

// Note: This component is designed to be standalone.
// It assumes `React` is available in the global scope.
// It also assumes the host application has loaded the 'VT323' and 'Press Start 2P' fonts.
interface CyberpunkLoginScreenProps {
  onNewAccount: () => void;
  onWalletLogin: () => void;
  onRecoveryLogin: (recoveryString: string) => void;
}

const CyberpunkLoginScreen: React.FC<CyberpunkLoginScreenProps> = ({
  onNewAccount,
  onWalletLogin,
  onRecoveryLogin,
}) => {
  // FIX: Use useState from React import
  const [animationState, setAnimationState] = useState("typing");
  // FIX: Use useState from React import
  const [typedText, setTypedText] = useState("");
  const [showRecoveryInput, setShowRecoveryInput] = useState(false);
  const [recoveryString, setRecoveryString] = useState("");
  const fullText =
    "> Authenticating... ACCESS GRANTED.\n> Welcome, Seeker.\n> Please select an option to proceed:";

  // FIX: Use useEffect from React import
  useEffect(() => {
    setAnimationState("typing");
    setTypedText("");
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setAnimationState("glitching");
          setTimeout(() => setAnimationState("finished"), 800);
        }, 300);
      }
    }, 40);
    return () => clearInterval(typingInterval);
  }, []);

  const styles = `
        /* KEYFRAMES */
        @keyframes g13-neon-flicker {
            0%, 18%, 22%, 25%, 53%, 57%, 100% {
              opacity: 1;
              text-shadow: 0 0 4px #fff, 0 0 10px #a3e635, 0 0 20px #84cc16;
            }
            20%, 24%, 55% { 
              opacity: 0.7;
              text-shadow: 0 0 4px #fff, 0 0 8px #a3e635;
            }
        }
        @keyframes g13-glitch-flicker {
            0%, 100% { opacity: 1; }
            20% { opacity: 0.8; filter: brightness(1.2); }
            40% { opacity: 1; filter: none; }
            60% { opacity: 0.9; transform: translateX(2px); }
            80% { opacity: 1; transform: translateX(-2px); }
        }
        @keyframes g13-scale-in {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes g13-ping {
            75%, 100% {
                transform: scale(1.5);
                opacity: 0;
            }
        }
        @keyframes g13-cursor-blink {
            50% { opacity: 0; }
        }

        /* ANIMATION CLASSES */
        .g13-animate-neon-flicker { 
            animation: g13-neon-flicker 1.5s infinite linear;
        }
        .g13-animate-glitch-flicker {
            animation: g13-glitch-flicker 0.2s linear infinite;
        }
        .g13-animate-scale-in {
            animation: g13-scale-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .g13-cursor {
            animation: g13-cursor-blink 1s step-end infinite;
        }

        /* BUTTON STYLES */
        .g13-button {
            position: relative;
            display: inline-block;
            font-size: 1.25rem;
            line-height: 1.5;
            font-family: 'Press Start 2P', cursive;
            padding: 0.75rem 1.5rem;
            background-color: rgba(0, 0, 0, 0.5);
            border: 4px double #a3e635;
            color: #a3e635;
            transition: all 0.3s;
            width: 100%;
            max-width: 20rem;
            text-align: center;
            text-decoration: none;
            user-select: none;
        }
        .g13-button:hover {
            background-color: #a3e635;
            color: #0d0a1a;
            box-shadow: 0 0 5px #84cc16, 0 0 10px #84cc16, 0 0 20px #a3e635, 0 0 40px #bef264;
        }
        .g13-button-ping-border {
            position: absolute;
            top: -0.25rem;
            left: -0.25rem;
            right: -0.25rem;
            bottom: -0.25rem;
            border-width: 2px;
            border-color: #a3e635;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .g13-button:hover .g13-button-ping-border {
            opacity: 1;
            animation: g13-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
    `;

  const handleRecoverySubmit = () => {
    if (recoveryString.trim()) {
      onRecoveryLogin(recoveryString.trim());
    }
  };

  const GameButton = ({
    children,
    onClick,
  }: {
    children: any;
    onClick?: () => void;
  }) => (
    <button onClick={onClick} className="g13-button">
      <span className="g13-button-ping-border"></span>
      <span>{children}</span>
    </button>
  );

  const TerminalView = () => (
    <div
      className={
        animationState === "glitching" ? "g13-animate-glitch-flicker" : ""
      }
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        padding: "1rem",
        fontFamily: "'VT323', monospace",
        color: "#a3e635",
        fontSize: "1.25rem",
        lineHeight: "1.75rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "48rem" }}>
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
          {typedText}
          {animationState === "typing" && <span className="g13-cursor">_</span>}
        </pre>
      </div>
    </div>
  );

  const RecoveryView = () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        padding: "1rem",
        fontFamily: "'VT323', monospace",
        color: "#a3e635",
        fontSize: "1.25rem",
        lineHeight: "1.75rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "48rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{ fontSize: "2rem", marginBottom: "1rem", color: "#d9f99d" }}
          >
            &gt; ACCOUNT RECOVERY
          </h1>
          <p style={{ color: "#84cc16" }}>
            &gt; Enter your recovery string to restore your account
          </p>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <textarea
            value={recoveryString}
            onChange={(e) => setRecoveryString(e.target.value)}
            placeholder="> Paste your recovery string here..."
            style={{
              width: "100%",
              height: "8rem",
              padding: "1rem",
              backgroundColor: "rgba(163, 230, 53, 0.1)",
              border: "2px solid #a3e635",
              borderRadius: "0.5rem",
              color: "#a3e635",
              fontFamily: "'VT323', monospace",
              fontSize: "1rem",
              resize: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => setShowRecoveryInput(false)}
            style={{
              flex: 1,
              padding: "0.75rem 1.5rem",
              backgroundColor: "rgba(163, 230, 53, 0.2)",
              border: "2px solid #a3e635",
              color: "#a3e635",
              borderRadius: "0.5rem",
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            &gt; BACK
          </button>
          <button
            onClick={handleRecoverySubmit}
            disabled={!recoveryString.trim()}
            style={{
              flex: 1,
              padding: "0.75rem 1.5rem",
              backgroundColor: recoveryString.trim()
                ? "#a3e635"
                : "rgba(163, 230, 53, 0.2)",
              border: "2px solid #a3e635",
              color: recoveryString.trim() ? "#000" : "#a3e635",
              borderRadius: "0.5rem",
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "0.875rem",
              cursor: recoveryString.trim() ? "pointer" : "not-allowed",
              opacity: recoveryString.trim() ? 1 : 0.5,
            }}
          >
            &gt; RESTORE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );

  const HudView = () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "1rem",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(132, 204, 22, 0.2) 0, transparent 60%)",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(132,204,22,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(132,204,22,0.1) 1px, transparent 1px)",
          backgroundSize: "2rem 2rem",
        }}
      ></div>

      <div
        className="g13-animate-scale-in"
        style={{
          width: "100%",
          maxWidth: "28rem",
          border: "2px solid rgba(163, 230, 53, 0.5)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          padding: "2rem",
          textAlign: "center",
          boxShadow:
            "0 0 5px #84cc16, 0 0 10px #84cc16, 0 0 20px #a3e635, 0 0 40px #bef264",
        }}
      >
        <h1
          style={{
            fontSize: "1.875rem",
            lineHeight: "2.25rem",
            fontFamily: "'Press Start 2P', cursive",
            marginBottom: "2rem",
            color: "#d9f99d",
            textShadow:
              "0 0 5px #84cc16, 0 0 10px #84cc16, 0 0 20px #a3e635, 0 0 40px #bef264",
            minHeight: "56px",
          }}
        >
          <span className="g13-animate-neon-flicker">
            Reptilianz RPG Minigame
          </span>
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            alignItems: "center",
            width: "100%",
          }}
        >
          <GameButton onClick={onNewAccount}>New Account</GameButton>
          <GameButton onClick={onWalletLogin}>Log in with wallet</GameButton>
          <GameButton onClick={() => setShowRecoveryInput(true)}>
            Recovery phrase
          </GameButton>
        </div>
      </div>
    </div>
  );

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0d0a1a",
        color: "#e0e0e0",
        overflow: "hidden",
        fontFamily: "'VT323', monospace",
      }}
    >
      <style>{styles}</style>
      {(animationState === "typing" || animationState === "glitching") && (
        <TerminalView />
      )}
      {animationState === "finished" && !showRecoveryInput && <HudView />}
      {animationState === "finished" && showRecoveryInput && <RecoveryView />}
    </main>
  );
};

export default CyberpunkLoginScreen;
