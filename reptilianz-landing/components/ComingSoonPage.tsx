import React, { useState, useEffect } from "react";
import { ReptileSpriteIcon } from "./Icons";
import GlitchText from "./GlitchText";

// Monday, 16 Aug 2025 18:00:00 UTC
const TARGET_UTC_MS = Date.UTC(2025, 7, 27, 8, 0, 0);
// Minigame countdown - August 29, 2025 06:00:00 UTC
const MINIGAME_UTC_MS = Date.UTC(2025, 7, 29, 6, 0, 0);
const BACKGROUND_URL = new URL(
  "../../reptilianz-landing/assets/images/dessert.jpg",
  import.meta.url
).href;

// Airdrop data constants
const AIRDROP_DATA = {
  totalWallets: "33k+",
  finalWinners: "10k",
  collections: 11,
  commitmentHash:
    "1f215061884427311f5a3d7f8a5153d48732d2248c239429a4875b9086c3ca3e",
  commitmentTx:
    "3wvABN4VeMyNTXWumYsWnsMFkSCngeSfAVbzVPe8PzJFhG9M3UAAMRnFdPhcjHdyGziX9TiL6UQK6BjEkmXR1K4C",
  snapshotSlot: 362521011,
  timestamp: "2025-08-26T00:42:29.173Z",
  eligibleCollections: [
    { address: "eAeeYRC6J9e8v95QvWvgAWHz3ko7u5BR7wEqzPmYNnE", name: "Entropy" },
    {
      address: "GokAiStXz2Kqbxwz2oqzfEXuUhE7aXySmBGEP7uejKXF",
      name: "Saga Monkes",
    },
    {
      address: "J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w",
      name: "Mad Lads",
    },
    {
      address: "3saAedkM9o5g1u5DCqsuMZuC4GRqPB4TuMkvSsSVvGQ3",
      name: "Okay Bears",
    },
    {
      address: "4mKSoDDqApmF1DqXvVTSL6tu2zixrSSNjqMxUnwvVzy2",
      name: "y00ts (Solana)",
    },
    {
      address: "BUjZjAS2vbbb65g7Z1Ca9ZRVYoJscURG5L3AkVvHP9ac",
      name: "Famous Fox Federation",
    },
    {
      address: "69k55dCTwiUPNgaTZ8FVMADorTvEGJEGuAGEB7m1qB1S",
      name: "BoDoggos",
    },
    {
      address: "6mszaj17KSfVqADrQj3o4W3zoLMTykgmV37W4QadCczK",
      name: "Claynosaurz",
    },
    {
      address: "J6RJFQfLgBTcoAt3KoZFiTFW9AbufsztBNDgZ7Znrp1Q",
      name: "Galactic Geckos",
    },
    {
      address: "SMBtHCCC6RYRutFEPb4gZqeBLUZbMNhRKaMKZZLHi7W",
      name: "SMB Gen 2",
    },
    { address: "6XxjKYFbcndh2gDcsUrmZgVEsoDxXMnfsaGY6fpTJzNr", name: "DeGods" },
  ],
};

// Countdown hook driven by a UTC timestamp (in ms)
const useCountdown = (targetUtcMs: number) => {
  const [millisecondsRemaining, setMillisecondsRemaining] = useState(
    Math.max(0, targetUtcMs - Date.now())
  );

  useEffect(() => {
    if (targetUtcMs <= Date.now()) {
      setMillisecondsRemaining(0);
      return;
    }

    const intervalId = setInterval(() => {
      const next = Math.max(0, targetUtcMs - Date.now());
      setMillisecondsRemaining(next);
      if (next <= 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetUtcMs]);

  const days = Math.floor(millisecondsRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (millisecondsRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (millisecondsRemaining % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((millisecondsRemaining % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, raw: millisecondsRemaining };
};

const CountdownContent: React.FC = () => {
  const { days, hours, minutes, seconds } = useCountdown(TARGET_UTC_MS);

  const formatTime = (time: number) =>
    String(Math.max(0, time)).padStart(2, "0");

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full p-4">
      <div className="font-display text-3xl mb-4 ">
        <GlitchText className="text-fuchsia-400 text-shadow-neon-fuchsia">
          ARRIVAL IMMINENT
        </GlitchText>
      </div>
      <div className="my-4 animate-bounce">
        <ReptileSpriteIcon className="w-32 h-32 md:w-48 md:h-48" />
      </div>
      <div className="font-display text-xl md:text-2xl  animate-pulse mb-9">
        <GlitchText className="text-lime-400">
          HIBERNATION CYCLE ENDING...
        </GlitchText>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 justify-center items-center gap-4 mt-4 w-full lg:w-auto lg:gap-12 max-w-sm md:max-w-none">
        <div className="text-center p-1">
          <div className="font-display text-5xl md:text-7xl">
            <GlitchText className="text-lime-400">
              {formatTime(days)}
            </GlitchText>
          </div>
          <p className="font-display text-lg md:text-xl text-gray-400">DAYS</p>
        </div>
        <div className="text-center p-1">
          <div className="font-display text-5xl md:text-7xl">
            <GlitchText className="text-lime-400">
              {formatTime(hours)}
            </GlitchText>
          </div>
          <p className="font-display text-lg md:text-xl text-gray-400">HOURS</p>
        </div>
        <div className="text-center p-1">
          <div className="font-display text-5xl md:text-7xl">
            <GlitchText className="text-lime-400">
              {formatTime(minutes)}
            </GlitchText>
          </div>
          <p className="font-display text-lg md:text-xl text-gray-400">
            MINUTES
          </p>
        </div>
        <div className="text-center p-1">
          <div className="font-display text-5xl md:text-7xl ">
            <GlitchText className="text-lime-400">
              {formatTime(seconds)}
            </GlitchText>
          </div>
          <p className="font-display text-lg md:text-xl text-gray-400">
            SECONDS
          </p>
        </div>
      </div>
    </div>
  );
};

const MinigameCountdown: React.FC = () => {
  const [millisecondsRemaining, setMillisecondsRemaining] = useState(
    Math.max(0, MINIGAME_UTC_MS - Date.now())
  );

  useEffect(() => {
    if (MINIGAME_UTC_MS <= Date.now()) {
      setMillisecondsRemaining(0);
      return;
    }

    const intervalId = setInterval(() => {
      const next = Math.max(0, MINIGAME_UTC_MS - Date.now());
      setMillisecondsRemaining(next);
      if (next <= 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const days = Math.floor(millisecondsRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (millisecondsRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (millisecondsRemaining % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((millisecondsRemaining % (1000 * 60)) / 1000);

  const formatTime = (time: number) =>
    String(Math.max(0, time)).padStart(2, "0");

  return (
    <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
      <div className="text-center">
        <div className="font-display text-lg text-fuchsia-400">
          {formatTime(days)}
        </div>
        <p className="font-display text-xs text-gray-400">D</p>
      </div>
      <div className="text-center">
        <div className="font-display text-lg text-fuchsia-400">
          {formatTime(hours)}
        </div>
        <p className="font-display text-xs text-gray-400">H</p>
      </div>
      <div className="text-center">
        <div className="font-display text-lg text-fuchsia-400">
          {formatTime(minutes)}
        </div>
        <p className="font-display text-xs text-gray-400">M</p>
      </div>
      <div className="text-center">
        <div className="font-display text-lg text-fuchsia-400">
          {formatTime(seconds)}
        </div>
        <p className="font-display text-xs text-gray-400">S</p>
      </div>
    </div>
  );
};

const WalletSearch: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [searchResult, setSearchResult] = useState<
    "searching" | "winner" | "not-winner" | null
  >(null);
  const [isSearching, setIsSearching] = useState(false);

  const checkWinner = async () => {
    if (!walletAddress.trim()) return;

    setIsSearching(true);
    setSearchResult("searching");

    try {
      // Load winners data
      const response = await fetch("/winners.json");
      const winnersData = await response.json();

      // Check if wallet is in winners
      const isWinner = winnersData.winners.some(
        (winner: string) =>
          winner.toLowerCase() === walletAddress.toLowerCase() ||
          winner === walletAddress
      );

      setSearchResult(isWinner ? "winner" : "not-winner");
    } catch (error) {
      console.error("Error checking winner:", error);
      setSearchResult("not-winner");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkWinner();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your Solana wallet address..."
          className="flex-1 px-4 py-3 bg-black/30 border border-lime-400/30 rounded-lg text-white placeholder-gray-400 focus:border-lime-400/60 focus:outline-none transition-colors"
        />
        <button
          onClick={checkWinner}
          disabled={isSearching || !walletAddress.trim()}
          className="px-6 py-3 bg-lime-400/20 border border-lime-400/50 text-lime-400 rounded-lg hover:bg-lime-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-display"
        >
          {isSearching ? "🔍 Searching..." : "🔍 Check"}
        </button>
      </div>

      {/* Search Results */}
      {searchResult === "searching" && (
        <div className="text-center p-4 bg-black/20 rounded-lg border border-cyan-400/30">
          <div className="text-cyan-400 font-display text-lg mb-2">
            🔍 Searching...
          </div>
          <div className="text-gray-400 text-lg">
            Checking if your wallet is a winner...
          </div>
        </div>
      )}

      {searchResult === "winner" && (
        <div className="text-center p-6 bg-black/20 rounded-lg border border-lime-400/50 animate-pulse">
          <div className="text-lime-400 font-display text-2xl mb-2">
            🎉 CONGRATULATIONS! 🎉
          </div>
          <div className="text-lime-400 font-display text-lg mb-2">
            You're a winner!
          </div>
          <div className="text-gray-300 text-lg">
            Your Reptilianz should be dropping anytime soon! 🐉✨
          </div>
        </div>
      )}

      {searchResult === "not-winner" && (
        <div className="text-center p-4 bg-black/20 rounded-lg border border-gray-400/30">
          <div className="text-gray-400 font-display text-lg mb-2">
            😔 Not this time
          </div>
          <div className="text-gray-400 text-lg">
            This wallet wasn't selected in the airdrop. Better luck next time!
          </div>
        </div>
      )}
    </div>
  );
};

const AirdropStats: React.FC = () => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto p-4 mt-8">
      <div className="font-display text-4xl md:text-5xl mb-4">
        <GlitchText className="text-lime-400 text-shadow-neon-lime">
          REPTILIANZ
        </GlitchText>
      </div>
      <div className="font-display text-2xl md:text-3xl mb-6">
        <GlitchText className="text-fuchsia-400 text-shadow-neon-fuchsia">
          AIRDROPPING
        </GlitchText>
      </div>

      <div className="my-6 animate-bounce">
        <img
          src="/reptilianz_logo.png"
          alt="Reptilianz Logo"
          className="w-32 h-32 md:w-48 md:h-48 mx-auto"
        />
      </div>

      <div className="font-display text-xl md:text-2xl animate-pulse mb-8">
        <GlitchText className="text-lime-400">INFILTRATION COMPLETE</GlitchText>
      </div>

      {/* Missions Status */}
      <div className="font-display text-lg md:text-xl animate-pulse mb-6">
        <GlitchText className="text-fuchsia-400">
          🎯 MISSIONS: ACTIVE
        </GlitchText>
      </div>

      {/* Play Button */}
      <div className="mb-8">
        <button
          onClick={() => (window.location.href = "/minigame")}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-2xl font-display font-bold text-lime-400 bg-black/50 border-4 border-double border-lime-400 hover:bg-lime-400 hover:text-black transition-all duration-300 transform hover:scale-105"
        >
          <span className="absolute -top-2 -left-2 -right-2 -bottom-2 border-2 border-lime-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></span>
          <span className="relative z-10 tracking-widest">PLAY</span>
          <div className="absolute inset-0 bg-gradient-to-r from-lime-400/20 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
        </button>
      </div>

      {/* Airdrop Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full max-w-4xl">
        <div className="text-center p-4 bg-black/20 rounded-lg border border-lime-400/30">
          <div className="font-display text-4xl md:text-5xl mb-2">
            <GlitchText className="text-lime-400">
              {AIRDROP_DATA.totalWallets}
            </GlitchText>
          </div>
          <p className="font-display text-lg text-gray-300">PARTICIPANTS</p>
        </div>

        <div className="text-center p-4 bg-black/20 rounded-lg border border-fuchsia-400/30">
          <div className="font-display text-4xl md:text-5xl mb-2">
            <GlitchText className="text-fuchsia-400">
              {AIRDROP_DATA.finalWinners}
            </GlitchText>
          </div>
          <p className="font-display text-lg text-gray-300">FINAL WINNERS</p>
        </div>

        <div className="text-center p-4 bg-black/20 rounded-lg border border-cyan-400/30">
          <div className="font-display text-4xl md:text-5xl mb-2">
            <GlitchText className="text-cyan-400">
              {AIRDROP_DATA.collections}
            </GlitchText>
          </div>
          <p className="font-display text-lg text-gray-300">COLLECTIONS</p>
        </div>

        <div className="text-center p-4 bg-black/20 rounded-lg border border-purple-400/30">
          <div className="font-display text-4xl md:text-5xl mb-2">
            <GlitchText className="text-purple-400">VRF</GlitchText>
          </div>
          <p className="font-display text-lg text-gray-300">FAIR SELECTION</p>
        </div>
      </div>

      {/* Wallet Search */}
      <div className="w-full max-w-2xl mb-8">
        <h3 className="font-display text-xl text-lime-400 mb-4">
          🔍 CHECK IF YOU'RE A WINNER
        </h3>
        <WalletSearch />
      </div>

      {/* Eligible Collections */}
      <div className="w-full max-w-4xl mb-8">
        <h3 className="font-display text-xl text-fuchsia-400 mb-4">
          🎯 ELIGIBLE COLLECTIONS
        </h3>
        <p className="text-gray-400 text-xl mb-4">
          If you held an NFT from any of these collections on August 25, 2025 at
          06:11:11 PM CST, then check if your wallet is a winner below!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {AIRDROP_DATA.eligibleCollections.map((collection, index) => (
            <div
              key={index}
              className="p-3 bg-black/20 rounded-lg border border-fuchsia-400/20 hover:border-fuchsia-400/40 transition-colors"
            >
              <div className="text-fuchsia-400 font-display text-lg font-bold mb-1">
                {collection.name}
              </div>
              <div className="text-gray-400 font-mono text-base break-all">
                {collection.address}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commitment Details */}
      <div className="w-full max-w-3xl mb-8">
        <div className="text-center mb-4">
          <h3 className="font-display text-xl text-cyan-400 mb-2">
            COMMITMENT VERIFICATION
          </h3>
          <p className="text-gray-400 text-lg">
            Snapshot Slot: {AIRDROP_DATA.snapshotSlot}
          </p>
          <p className="text-gray-400 text-lg">
            Timestamp: {new Date(AIRDROP_DATA.timestamp).toLocaleString()}
          </p>
        </div>

        <div className="bg-black/30 rounded-lg p-4 border border-cyan-400/30">
          <div className="text-left space-y-2">
            <div>
              <span className="text-cyan-400 font-mono text-lg">Hash:</span>
              <p className="font-mono text-base text-gray-300 break-all">
                {AIRDROP_DATA.commitmentHash}
              </p>
            </div>
            <div>
              <span className="text-cyan-400 font-mono text-lg">
                Transaction:
              </span>
              <p className="font-mono text-base text-gray-300 break-all">
                {AIRDROP_DATA.commitmentTx}
              </p>
              <a
                href="https://explorer.solana.com/tx/3wvABN4VeMyNTXWumYsWnsMFkSCngeSfAVbzVPe8PzJFhG9M3UAAMRnFdPhcjHdyGziX9TiL6UQK6BjEkmXR1K4C"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span className="text-lg">🔗 View on Solana Explorer</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* IPFS Links */}
      <div className="w-full max-w-4xl">
        <h3 className="font-display text-xl text-lime-400 mb-4">
          TRANSPARENCY & VERIFICATION
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="https://gateway.lighthouse.storage/ipfs/bafybeihgnxteempagofzr2hg4qkwtxwm2qxrgkskgnmz3g2lhza6p6onrq/airdrop_summary_2025-08-26T02-09-59-149Z.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-black/20 rounded-lg border border-lime-400/30 hover:border-lime-400/60 transition-colors"
          >
            <div className="text-lime-400 font-display text-lg">
              📊 AIRDROP SUMMARY
            </div>
            <div className="text-gray-400 text-base">
              Complete airdrop details & statistics (36 kB)
            </div>
          </a>

          <a
            href="https://gateway.lighthouse.storage/ipfs/bafybeihgnxteempagofzr2hg4qkwtxwm2qxrgkskgnmz3g2lhza6p6onrq/winners.json"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-black/20 rounded-lg border border-fuchsia-400/30 hover:border-fuchsia-400/60 transition-colors"
          >
            <div className="text-fuchsia-400 font-display text-lg">
              🎯 WINNERS LIST
            </div>
            <div className="text-gray-400 text-base">
              VRF-verified winner selection (519 kB)
            </div>
          </a>

          <a
            href="https://gateway.lighthouse.storage/ipfs/bafybeihgnxteempagofzr2hg4qkwtxwm2qxrgkskgnmz3g2lhza6p6onrq/snapshot_slot_362521011_1756167246302.json"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-black/20 rounded-lg border border-cyan-400/30 hover:border-cyan-400/60 transition-colors"
          >
            <div className="text-cyan-400 font-display text-lg">
              📸 SNAPSHOT DATA
            </div>
            <div className="text-gray-400 text-base">
              Collection ownership verification (8.1 MB)
            </div>
          </a>

          <a
            href="https://gateway.lighthouse.storage/ipfs/bafybeihgnxteempagofzr2hg4qkwtxwm2qxrgkskgnmz3g2lhza6p6onrq/airdrop.log"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-black/20 rounded-lg border border-yellow-400/30 hover:border-yellow-400/60 transition-colors"
          >
            <div className="text-yellow-400 font-display text-lg">
              🔍 FULL LOGS
            </div>
            <div className="text-gray-400 text-base">
              Complete airdrop execution log (10 MB)
            </div>
          </a>

          <a
            href="https://gateway.lighthouse.storage/ipfs/bafybeihgnxteempagofzr2hg4qkwtxwm2qxrgkskgnmz3g2lhza6p6onrq/commitment_slot_362521011_1756168949173.json"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-black/20 rounded-lg border border-purple-400/30 hover:border-purple-400/60 transition-colors"
          >
            <div className="text-purple-400 font-display text-lg">
              🔐 COMMITMENT
            </div>
            <div className="text-gray-400 text-base">
              Commitment transaction details (600 B)
            </div>
          </a>

          <a
            href="https://gateway.lighthouse.storage/ipfs/bafybeihgnxteempagofzr2hg4qkwtxwm2qxrgkskgnmz3g2lhza6p6onrq/vrf_slot_362521011_1756171775030.json"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-black/20 rounded-lg border border-green-400/30 hover:border-green-400/60 transition-colors"
          >
            <div className="text-green-400 font-display text-lg">
              🎲 VRF PROOF
            </div>
            <div className="text-gray-400 text-base">
              Verifiable random function proof (1.2 kB)
            </div>
          </a>

          <a
            href="https://gateway.lighthouse.storage/ipfs/bafybeihgnxteempagofzr2hg4qkwtxwm2qxrgkskgnmz3g2lhza6p6onrq/assetIds.json"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-black/20 rounded-lg border border-orange-400/30 hover:border-orange-400/60 transition-colors"
          >
            <div className="text-orange-400 font-display text-lg">
              🆔 ASSET IDs
            </div>
            <div className="text-gray-400 text-base">
              Token asset identifiers (520 kB)
            </div>
          </a>

          <a
            href="https://gateway.lighthouse.storage/ipfs/bafybeihgnxteempagofzr2hg4qkwtxwm2qxrgkskgnmz3g2lhza6p6onrq/winners_slot_362521011_1756173844508.json"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-black/20 rounded-lg border border-red-400/30 hover:border-red-400/60 transition-colors"
          >
            <div className="text-red-400 font-display text-lg">
              🏆 FINAL WINNERS
            </div>
            <div className="text-gray-400 text-base">
              Final winner selection data (1.1 MB)
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

const ComingSoonPage: React.FC = () => {
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [spinnerGlitch, setSpinnerGlitch] = useState(false);

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

  return (
    <div className="relative w-full min-h-screen overflow-y-auto flex items-start justify-center text-center bg-[#0d0a1a] animate-fade-in py-8">
      {/* Local keyframes for fade in/out */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
        .animate-fade-in { animation: fadeIn 600ms ease-out forwards }
        .animate-fade-out { animation: fadeOut 600ms ease-in forwards }

      `}</style>
      {/* Background and overlays from App.tsx */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ${
          isBgLoaded ? "opacity-30" : "opacity-0"
        }`}
        style={{ backgroundImage: `url(${BACKGROUND_URL})` }}
      >
        <div className="w-full h-full bg-gradient-to-t from-[#0d0a1a] via-transparent to-black/30"></div>
      </div>
      <div className="fixed top-0 left-0 w-full h-full bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_4px)] pointer-events-none z-[100]"></div>
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
      <AirdropStats />
      {/* Back to Main Site Link - Fixed Position with Glitch Effect */}
      <a href="/" className="fixed top-6 left-6 z-[1001] group">
        <div className="relative inline-flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-sm border border-cyan-400/50 rounded-lg text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:border-cyan-300/70 hover:bg-black/90 hover:shadow-lg hover:shadow-cyan-400/25">
          <span className="text-lg group-hover:animate-pulse">←</span>
          <span className="font-display text-sm tracking-wider">BACK</span>
          <div className="absolute inset-0 bg-cyan-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
        </div>
      </a>
      <div className="h-16"></div> {/* Bottom spacing for mobile */}
    </div>
  );
};

export default ComingSoonPage;
