import React from "react";
import { StyledButton } from "./StyledButton";

interface WelcomeModalProps {
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border-2 border-cyan-500/80 shadow-2xl shadow-cyan-500/20 w-full max-w-4xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="text-center mb-8">
            {/* Bouncing Logo */}
            <div className="my-6 animate-bounce">
              <img
                src="/reptilianz_logo.png"
                alt="Repz Logo"
                className="w-24 h-24 md:w-32 md:h-32 mx-auto"
              />
            </div>
            <h1 className="text-4xl font-orbitron font-bold text-cyan-400 mb-2">
              Welcome to Repz RPG
            </h1>
            <p className="text-xl text-gray-300">
              Your journey into the conspiracy begins now, Agent.
            </p>
          </div>

          <div className="space-y-8">
            {/* Game Overview */}
            <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-orbitron font-bold text-yellow-400 mb-4">
                🎯 What is Repz RPG?
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Repz RPG is an incremental RPG where you infiltrate various
                zones, complete missions, collect powerful equipment, and
                uncover a vast conspiracy. As you progress, you'll unlock new
                areas, face challenging bosses, and discover the truth behind
                the reptilian invasion.
              </p>
            </section>

            {/* Future Rewards */}
            <section className="bg-gray-900/50 p-6 rounded-xl border border-purple-600">
              <h2 className="text-2xl font-orbitron font-bold text-purple-400 mb-4">
                🚀 Future Rewards for Top Players
              </h2>
              <div className="space-y-3">
                <p className="text-gray-300">
                  <span className="text-purple-400 font-bold">Important:</span>{" "}
                  Top players will receive exclusive drops that unlock
                  additional features and content. These rewards will be
                  distributed based on player rankings and achievements.
                </p>
                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/50">
                  <p className="text-purple-200 font-semibold">
                    💎 Stay active and climb the leaderboards to ensure you
                    don't miss out on these exclusive rewards!
                  </p>
                </div>
              </div>
            </section>

            {/* Core Gameplay */}
            <section className="bg-gray-900/50 p-6 rounded-xl border border-green-600">
              <h2 className="text-2xl font-orbitron font-bold text-green-400 mb-4">
                ⚔️ Core Gameplay Systems
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-green-300">
                    🎯 Missions
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Complete missions in different zones to earn XP, gold, and
                    discover items. Each zone has unique loot tables and
                    completion bonuses.
                  </p>

                  <h3 className="text-lg font-bold text-green-300">🔨 Forge</h3>
                  <p className="text-gray-300 text-sm">
                    Upgrade your equipment to increase power and unlock new
                    abilities. The forge is essential for progression.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-green-300">🏪 Store</h3>
                  <p className="text-gray-300 text-sm">
                    Purchase consumables and special items to boost your
                    performance and unlock new gameplay options.
                  </p>

                  <h3 className="text-lg font-bold text-green-300">🧪 Lab</h3>
                  <p className="text-gray-300 text-sm">
                    Manage your homunculi, assign them to work, and generate
                    passive income while you're away.
                  </p>
                </div>
              </div>
            </section>

            {/* Speed Bonus - More Mysterious */}
            <section className="bg-gray-900/50 p-6 rounded-xl border border-orange-600">
              <h2 className="text-2xl font-orbitron font-bold text-orange-400 mb-4">
                ⚡ Hidden Potential
              </h2>
              <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-500/50">
                <p className="text-orange-200 font-semibold">
                  Complete your third mission to unlock something{" "}
                  <span className="text-yellow-400 font-bold">
                    extraordinary
                  </span>
                  ... A hidden mechanism that will dramatically accelerate your
                  infiltration capabilities.
                </p>
                <p className="text-orange-300 text-sm mt-2 italic">
                  "The third time is the charm, they say. In this case, it's the
                  key to unlocking your true potential."
                </p>
              </div>
            </section>

            {/* Getting Started */}
            <section className="bg-gray-900/50 p-6 rounded-xl border border-blue-600">
              <h2 className="text-2xl font-orbitron font-bold text-blue-400 mb-4">
                🚀 Getting Started
              </h2>
              <div className="space-y-3">
                <p className="text-gray-300">
                  1.{" "}
                  <span className="text-blue-300 font-semibold">
                    Start with missions
                  </span>{" "}
                  - Begin in the Cafeteria zone
                </p>
                <p className="text-gray-300">
                  2.{" "}
                  <span className="text-blue-300 font-semibold">
                    Collect equipment
                  </span>{" "}
                  - Discover and equip items to increase power
                </p>
                <p className="text-gray-300">
                  3.{" "}
                  <span className="text-blue-300 font-semibold">
                    Complete zones
                  </span>{" "}
                  - Unlock new areas and face stronger challenges
                </p>
                <p className="text-gray-300">
                  4.{" "}
                  <span className="text-blue-300 font-semibold">
                    Build your collection
                  </span>{" "}
                  - Find rare items and complete sets
                </p>
              </div>
            </section>
          </div>

          <div className="text-center mt-8">
            <StyledButton
              onClick={onClose}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 text-lg font-bold"
            >
              Let's Begin the Infiltration! 🎯
            </StyledButton>
          </div>
        </div>
      </div>
    </div>
  );
};
