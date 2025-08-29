import React from "react";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-6xl font-orbitron font-bold text-cyan-400 mb-4">
            GRIND CORE
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Message */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-8">
          <h2 className="text-3xl font-orbitron text-white mb-6">
            🚧 UNDER CONSTRUCTION 🚧
          </h2>
          <p className="text-xl text-gray-300 mb-6 leading-relaxed">
            We're building something epic! The full Grind Core RPG experience is
            coming soon.
          </p>

          {/* Disclaimer */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-300 font-semibold">
              ⚡ BUILDING PRODUCTION - ANY TIME NOW! ⚡
            </p>
            <p className="text-yellow-200 text-sm mt-2">
              For the minigame and full experience
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="text-2xl mb-2">🎮</div>
              <div className="text-cyan-300 font-semibold">RPG Gameplay</div>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="text-2xl mb-2">🎰</div>
              <div className="text-purple-300 font-semibold">
                Casino Minigame
              </div>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <div className="text-2xl mb-2">⚔️</div>
              <div className="text-red-300 font-semibold">Epic Battles</div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="text-gray-400 text-sm">
          <p>Follow us for updates and sneak peeks!</p>
          <div className="flex justify-center gap-4 mt-4">
            <a
              href="#"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Discord
            </a>
            <a
              href="#"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              Website
            </a>
          </div>
        </div>

        {/* Animated Elements */}
        <div className="fixed top-10 left-10 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
        <div
          className="fixed top-20 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="fixed bottom-20 left-20 w-2 h-2 bg-green-400 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  );
};

export default App;
