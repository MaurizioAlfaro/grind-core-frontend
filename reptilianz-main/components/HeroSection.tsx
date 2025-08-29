import React, { useState, useEffect } from "react";
import GlitchText from "./GlitchText";
import { ReptileSpriteIcon } from "./Icons";

const HeroSection: React.FC = () => {
  const [showBlinkingText, setShowBlinkingText] = useState(true);
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [spinnerGlitch, setSpinnerGlitch] = useState(false);

  // Background image URL (same as airdrop page)
  const BACKGROUND_URL = new URL(
    "../../reptilianz-landing/assets/images/dessert.jpg",
    import.meta.url
  ).href;

  // Preload background and drive loader fade-out
  useEffect(() => {
    const img = new Image();
    img.src = BACKGROUND_URL;
    const onDone = () => {
      setIsBgLoaded(true);
      // allow bg to fade in, then fade out loader
      setTimeout(() => setShowLoader(false), 600);
    };
    img.addEventListener("load", onDone);
    img.addEventListener("error", onDone);
    return () => {
      img.removeEventListener("load", onDone);
      img.removeEventListener("error", onDone);
    };
  }, []);

  // Add small random jitter to the spinner to mimic glitch
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSpinnerGlitch(true);
      setTimeout(() => setSpinnerGlitch(false), Math.random() * 150 + 50);
    }, Math.random() * 4000 + 2000);
    return () => clearInterval(intervalId);
  }, []);

  // Blinking text effect
  useEffect(() => {
    const blinker = setInterval(() => {
      setShowBlinkingText((prev) => !prev);
    }, 600);
    return () => clearInterval(blinker);
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center text-center relative py-20"
    >
      {/* Background with dessert image */}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ${
          isBgLoaded ? "opacity-30" : "opacity-0"
        }`}
        style={{ backgroundImage: `url(${BACKGROUND_URL})` }}
      >
        <div className="w-full h-full bg-gradient-to-t from-[#0d0a1a] via-transparent to-black/30"></div>
      </div>

      {/* CRT Scanline Overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_4px)] pointer-events-none z-[100]"></div>

      {/* Vignette Overlay */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[99]"
        style={{ boxShadow: "inset 0 0 150px 20px rgba(0,0,0,0.85)" }}
      ></div>

      {/* Loader overlay */}
      {showLoader && (
        <div
          className={`fixed inset-0 z-[1002] flex items-center justify-center bg-[#0d0a1a] ${
            isBgLoaded ? "animate-fade-out" : ""
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-20 h-20 md:w-28 md:h-28">
              <ReptileSpriteIcon
                className={`w-full h-full animate-spin ${
                  spinnerGlitch ? "translate-x-1 -translate-y-1" : ""
                }`}
              />
            </div>
            <div className="mt-6 font-display text-xl md:text-2xl">
              <GlitchText className="text-cyan-400 text-shadow-neon-cyan">
                LOADING...
              </GlitchText>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center px-4">
        <h1 className="text-4xl leading-tight sm:text-6xl md:text-8xl font-display mb-4">
          <GlitchText className="text-cyan-400 text-shadow-neon-cyan">
            Reptilianz
          </GlitchText>
        </h1>
        <p className="text-xl md:text-3xl font-display text-fuchsia-400 text-shadow-neon-fuchsia tracking-widest mb-12">
          Wasteland Arcade
        </p>

        <button
          onClick={() => (window.location.href = "/minigame")}
          className="group relative inline-block text-2xl font-display px-8 py-4 bg-black/50 border-4 border-double border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-black transition-all duration-300 cursor-pointer"
        >
          <span className="absolute -top-2 -left-2 -right-2 -bottom-2 border-2 border-lime-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></span>
          <span
            className={`transition-opacity duration-500 ${
              showBlinkingText ? "opacity-100" : "opacity-0"
            }`}
          >
            Press Start
          </span>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
