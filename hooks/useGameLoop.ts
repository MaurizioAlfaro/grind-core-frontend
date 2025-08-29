import { useState, useEffect, useCallback } from "react";
import type {
  GameState,
  Rewards,
  MissionDurationKey,
  Badge,
  SlottedParts,
  Homunculus,
  HomunculusEquipmentSlot,
  ActiveBoost,
  PlayerState,
  HomunculusEquipmentSlot as HomunculusSlot,
  ActiveMission,
} from "../types";

// Helper function to validate if an activeMission is complete and valid
const isValidActiveMission = (
  activeMission: any
): activeMission is ActiveMission => {
  return (
    activeMission &&
    typeof activeMission === "object" &&
    activeMission.zoneId &&
    typeof activeMission.startTime === "number" &&
    typeof activeMission.endTime === "number" &&
    activeMission.durationKey
  );
};
import { ItemType, EquipmentSlot } from "../types";
import { persistenceService } from "../services/persistenceService";
import { apiService } from "../services/apiService";
import { clockService } from "../services/clockService";
import type { LeaderboardEntry } from "../constants/leaderboard";
import type { TutorialConfig } from "../features/tutorial/Tutorial";
import type { AppView } from "../features/navigation/FooterNav";

// Helper function to get wallet provider
const getProvider = () => {
  if ("solana" in window) {
    const provider = (window as any).solana;
    if (provider && provider.isPhantom) {
      return provider;
    }
  }
  return undefined;
};

const useRealBackEnd = true;

type ModalContent = {
  title: string;
  rewards: Rewards;
};

export type UpgradeResult = {
  itemId: string;
  outcome: "success" | "stay" | "downgrade";
} | null;

export const useGameLoop = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [globalBossTimer, setGlobalBossTimer] = useState<number>(0);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  const [rewardsInfoModalZoneId, setRewardsInfoModalZoneId] = useState<
    string | null
  >(null);
  const [itemInfoModalId, setItemInfoModalId] = useState<string | null>(null);
  const [loreModalZoneId, setLoreModalZoneId] = useState<string | null>(null);
  const [isCancelConfirmModalOpen, setIsCancelConfirmModalOpen] =
    useState(false);
  const [unlockZoneModalId, setUnlockZoneModalId] = useState<string | null>(
    null
  );
  const [cacheContentsModalId, setCacheContentsModalId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showServerErrorModal, setShowServerErrorModal] = useState(false);
  const [forgeUpgradeResult, setForgeUpgradeResult] =
    useState<UpgradeResult>(null);
  const [unlockedBadgesModal, setUnlockedBadgesModal] = useState<Badge[]>([]);
  const [viewingProfile, setViewingProfile] = useState<LeaderboardEntry | null>(
    null
  );
  const [feedingHomunculus, setFeedingHomunculus] = useState<Homunculus | null>(
    null
  );
  const [workplaceHomunculus, setWorkplaceHomunculus] =
    useState<Homunculus | null>(null);
  const [equippingHomunculus, setEquippingHomunculus] =
    useState<Homunculus | null>(null);
  const [resetConfirmation, setResetConfirmation] = useState<number | null>(
    null
  );
  const [isInitialBoostModalOpen, setIsInitialBoostModalOpen] = useState(false);
  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false);

  const [pendingMissionRewards, setPendingMissionRewards] =
    useState<Rewards | null>(null);

  // Casino state
  const [showCasino, setShowCasino] = useState(false);

  // Wallet linking modal state
  const [walletChoiceModal, setWalletChoiceModal] = useState<{
    isOpen: boolean;
    walletPlayerData: any;
    jwtToken: string | null;
  }>({
    isOpen: false,
    walletPlayerData: null,
    jwtToken: null,
  });
  const [viewingBuffInfo, setViewingBuffInfo] = useState<ActiveBoost | null>(
    null
  );
  const [tutorialConfig, setTutorialConfig] = useState<TutorialConfig | null>(
    null
  );
  const [activeView, _setActiveView] = useState<AppView>("missions");
  const [selectedForgeSlot, setSelectedForgeSlot] =
    useState<EquipmentSlot | null>(null);

  useEffect(() => {
    if (forgeUpgradeResult) {
      const timer = setTimeout(() => {
        setForgeUpgradeResult(null);
      }, 800); // Animation duration is 0.8s
      return () => clearTimeout(timer);
    }
  }, [forgeUpgradeResult]);

  // Load game state from backend on initial mount
  useEffect(() => {
    const initialize = async () => {
      try {
        // Check if we have stored player data first
        const storedPlayerData = localStorage.getItem("playerData");
        const authToken = localStorage.getItem("authToken");

        if (storedPlayerData && authToken) {
          // OPTIMISTIC LOADING: Show game immediately from localStorage
          const playerState = JSON.parse(storedPlayerData);

          // Restore activeMission from localStorage if it exists and is valid
          const activeMission = isValidActiveMission(playerState.activeMission)
            ? playerState.activeMission
            : null;

          setGameState({ player: playerState, activeMission });
          setIsInitialized(true);
          setIsLoading(false);

          // BACKGROUND REFRESH: Fetch fresh data from server
          try {
            const freshPlayerState = await apiService.getPlayer();
            // Update with fresh data if successful, preserving activeMission if it exists and is valid
            const activeMission = isValidActiveMission(
              freshPlayerState.activeMission
            )
              ? freshPlayerState.activeMission
              : null;
            setGameState({ player: freshPlayerState, activeMission });
            localStorage.setItem(
              "playerData",
              JSON.stringify(freshPlayerState)
            );
            console.log("✅ Fresh player data loaded from server");
          } catch (refreshError) {
            console.warn(
              "⚠️ Failed to refresh player data from server:",
              refreshError
            );
            // Show error modal for server fetch failures
            setServerError(
              refreshError instanceof Error
                ? refreshError.message
                : "Unknown server error"
            );
            setShowServerErrorModal(true);
          }
          return;
        }

        // No stored data, try to load from backend
        const playerState = await apiService.getPlayer();
        // The API returns a PlayerState, but the game loop manages a GameState
        const activeMission = isValidActiveMission(playerState.activeMission)
          ? playerState.activeMission
          : null;
        setGameState({ player: playerState, activeMission });
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to load game from server:", error);
        // You might want to show an error screen here
      } finally {
        setIsLoading(false);
      }
    };
    initialize();

    // Listen for recovery authentication events
    const handleRecoveryAuth = (event: CustomEvent) => {
      console.log(
        "🎮 [useGameLoop] Recovery authentication detected, updating gameState"
      );
      const { player } = event.detail;
      const activeMission = isValidActiveMission(player.activeMission)
        ? player.activeMission
        : null;
      setGameState({ player, activeMission });
      setIsInitialized(true);
      setIsLoading(false);
    };

    window.addEventListener(
      "recoveryAuthenticated",
      handleRecoveryAuth as EventListener
    );

    // Listen for wallet modal trigger events
    const handleShowWalletModal = () => {
      console.log("🎮 [useGameLoop] Show wallet modal event received");
      setTimeout(() => {
        setIsConnectWalletModalOpen(true);
      }, 1000);
    };

    window.addEventListener("showWalletModal", handleShowWalletModal);

    return () => {
      window.removeEventListener(
        "recoveryAuthenticated",
        handleRecoveryAuth as EventListener
      );
      window.removeEventListener("showWalletModal", handleShowWalletModal);
    };
  }, []);

  const advanceTutorial = useCallback(async () => {
    if (!gameState || gameState.player.tutorialCompleted) return;

    // Total steps are now 39
    const newStep = (gameState.player.tutorialStep || 1) + 1;
    const shouldComplete = newStep > 39;

    try {
      // Call backend to update tutorial step
      const result = await apiService.updateTutorialStep({
        tutorialStep: newStep,
        tutorialCompleted: shouldComplete,
      });

      if (result.success && result.newPlayerState) {
        // Update local state with backend response
        setGameState((prevState) => {
          const newState = {
            ...prevState!,
            player: result.newPlayerState,
          };

          // Update localStorage with the new player state
          localStorage.setItem(
            "playerData",
            JSON.stringify(result.newPlayerState)
          );

          return newState;
        });
      } else {
        console.error("Failed to update tutorial step:", result.message);
      }
    } catch (error) {
      console.error("Error updating tutorial step:", error);
      // Fallback to client-side update if backend fails
      setGameState((prevState) => {
        if (!prevState || prevState.player.tutorialCompleted) return prevState;
        const newPlayerState = {
          ...prevState.player,
          tutorialStep: newStep,
          tutorialCompleted: shouldComplete,
        };

        // Update localStorage with the new player state
        localStorage.setItem("playerData", JSON.stringify(newPlayerState));

        return {
          ...prevState,
          player: newPlayerState,
        };
      });
    }
  }, [gameState]);

  // Helper function to safely call advanceTutorial without blocking
  const safeAdvanceTutorial = useCallback(() => {
    advanceTutorial().catch(console.error);
  }, [advanceTutorial]);

  const handleApiResponse = useCallback(
    (result: any) => {
      console.log("🔍 [Frontend] handleApiResponse called with:", result);

      if (result.success) {
        if (result.newPlayerState) {
          console.log(
            "🔍 [Frontend] Updating player state with:",
            result.newPlayerState
          );
          setGameState((prevState) => {
            if (!prevState) return prevState;
            console.log(
              "🔍 [Frontend] handleApiResponse: prevState.player before update:",
              prevState.player
            );

            // Update both player state and activeMission if it exists in the new player state and is valid
            const newActiveMission = isValidActiveMission(
              result.newPlayerState.activeMission
            )
              ? result.newPlayerState.activeMission
              : null;
            const newState = {
              ...prevState!,
              player: result.newPlayerState,
              activeMission: newActiveMission,
            };

            console.log(
              "🔍 [Frontend] handleApiResponse: newState.player after update:",
              newState.player
            );

            // Update stored player data in localStorage
            localStorage.setItem(
              "playerData",
              JSON.stringify(result.newPlayerState)
            );

            return newState;
          });
        }
        if (
          result.newlyUnlockedBadges &&
          result.newlyUnlockedBadges.length > 0
        ) {
          setUnlockedBadgesModal(result.newlyUnlockedBadges);
        }
        if (result.message) {
          setLastMessage(result.message);
        }
        // Handle specific success side-effects
        if (result.rewards) {
          const title =
            result.outcome === "win"
              ? `Victory!`
              : result.message.includes("Cache")
              ? "Cache Opened!"
              : "Mission Complete!";
          setModalContent({ title, rewards: result.rewards });
        }
        if (result.outcome && result.slot) {
          setForgeUpgradeResult({ slot: result.slot, outcome: result.outcome });
        }
        if (
          result.isInitialBoost &&
          (gameState?.player.tutorialCompleted ||
            gameState?.player.tutorialStep >= 39)
        ) {
          setIsInitialBoostModalOpen(true);
        }
      } else {
        setLastMessage(result.message);
      }
      return result.success;
    },
    [gameState]
  );

  const setActiveView = useCallback(
    (view: AppView) => {
      if (!gameState) return;
      const { tutorialStep, tutorialCompleted } = gameState.player;

      if (!tutorialCompleted) {
        if (tutorialStep === 11 && view === "collection") {
          safeAdvanceTutorial();
        } else if (tutorialStep === 14 && view === "missions") {
          safeAdvanceTutorial();
        } else if (tutorialStep === 24 && view === "forge") {
          safeAdvanceTutorial();
        } else if (tutorialStep === 34 && view === "missions") {
          safeAdvanceTutorial();
        }
      }
      _setActiveView(view);
    },
    [gameState, safeAdvanceTutorial]
  );

  // Main game loop (mission timer & buff checker)
  useEffect(() => {
    if (!gameState) return;

    const gameTick = () => {
      const now = clockService.getCurrentTime();

      // Mission Timer
      if (gameState.activeMission) {
        const missionEndTime = gameState.activeMission?.endTime || 0;
        const remaining = Math.max(0, Math.ceil((missionEndTime - now) / 1000));
        setTimeLeft(remaining);
      } else {
        setTimeLeft(0);
      }

      // Boss Cooldown
      const bossCooldownEndTime =
        gameState.player.globalBossCooldownEndTime || 0;
      const bossRemaining = Math.max(
        0,
        Math.ceil((bossCooldownEndTime - now) / 1000)
      );
      setGlobalBossTimer(bossRemaining);

      // Buff Expiry Check
      const activeBuffs = gameState.player.activeBoosts;
      const expiredBuffs = activeBuffs.filter((buff) => buff.endTime <= now);

      if (expiredBuffs.length > 0) {
        // Since buff expiry is purely time-based, we can predict this on the client
        // and then sync with the server on the next action. A more robust system
        // might have a dedicated API call to check and remove expired buffs.
        setGameState((prevState) => {
          if (!prevState) return null;
          const unexpiredBuffs = prevState.player.activeBoosts.filter(
            (buff) => buff.endTime > now
          );
          const newPlayerState = {
            ...prevState.player,
            activeBoosts: unexpiredBuffs,
          };
          // A real implementation might call `apiService.recalculatePower()` or similar here.
          // For now, we'll let the next action handle the power update.
          return { ...prevState, player: newPlayerState };
        });
      }
    };

    const intervalId = setInterval(gameTick, 1000);
    return () => clearInterval(intervalId);
  }, [gameState]);

  // Tutorial state machine
  useEffect(() => {
    if (!gameState) return;
    if (gameState.player.tutorialCompleted) {
      setTutorialConfig(null);
      return;
    }

    const { tutorialStep, missionsCompleted, equipment, gold } =
      gameState.player;
    let config: TutorialConfig | null = null;

    switch (tutorialStep) {
      case 1:
        config = {
          step: 1,
          targetSelector: "#mission-btn-short-caffeteria",
          title: "First Mission",
          text: "Welcome, Agent. Your first task is to gather intel in 'The Cafeteria'. Start with a 'Short' mission.",
          hasNextButton: false,
          position: "right",
        };
        break;
      case 2:
        if (gameState.activeMission && missionsCompleted === 0) {
          config = {
            step: 2,
            targetSelector: null,
            title: "While You Wait...",
            text: "Your mission is underway. Your goal is to grow stronger by completing missions to find loot, earn Gold and XP to level up, and unlock powerful gear.",
            hasNextButton: true,
            position: "center",
          };
        }
        break;
      case 3:
        config = {
          step: 3,
          targetSelector: "#player-stats-level",
          title: "Your Level",
          text: "This is your Level. As you gain XP, you'll level up, increasing your base Power.",
          hasNextButton: true,
          position: "right",
        };
        break;
      case 4:
        config = {
          step: 4,
          targetSelector: "#player-stats-xp-bar",
          title: "XP Bar",
          text: "This bar shows your progress to the next level.",
          hasNextButton: true,
          position: "bottom",
        };
        break;
      case 5:
        config = {
          step: 5,
          targetSelector: "#player-stats-power",
          title: "Power",
          text: "This is your Power. It's the key to unlocking new zones and defeating powerful bosses.",
          hasNextButton: true,
          position: "right",
        };
        break;
      case 6:
        config = {
          step: 6,
          targetSelector: "#player-stats-gold",
          title: "Gold",
          text: "Gold is used to upgrade your equipment in the Forge and buy items from the Store.",
          hasNextButton: true,
          position: "bottom",
        };
        break;
      case 7:
        config = {
          step: 7,
          targetSelector: "#player-stats-xp",
          title: "Experience Points",
          text: "XP is mainly for leveling up, but later you can invest it in the Bio-Forge for powerful bonuses.",
          hasNextButton: true,
          position: "bottom",
        };
        break;
      case 8:
        config = {
          step: 8,
          targetSelector: "#player-stats-usd",
          title: "USD",
          text: "This currency is earned by your creations in the Bio-Forge. It's used to buy exclusive gear in the Marketplace.",
          hasNextButton: true,
          position: "left",
        };
        break;
      case 9:
        if (
          timeLeft <= 0 &&
          gameState.activeMission &&
          missionsCompleted === 0
        ) {
          config = {
            step: 9,
            targetSelector: "#global-claim-btn",
            title: "Claim Rewards",
            text: "Your mission is complete! Click here to claim your rewards and finish the operation.",
            hasNextButton: false,
            position: "left",
          };
        }
        break;
      case 10:
        if (modalContent) {
          config = {
            step: 10,
            targetSelector: "#reward-modal-close-btn",
            title: "Your First Loot!",
            text: "Excellent work. You've found a Stirbicks Mug! Items are key to increasing your Power. Click 'Awesome!' to continue.",
            hasNextButton: false,
            position: "top",
          };
        }
        break;
      case 11:
        if (!modalContent) {
          config = {
            step: 11,
            targetSelector: "#footer-nav-collection",
            title: "View Your Gear",
            text: "All your equipment and discovered items are stored in your Collection. Click here to view it.",
            hasNextButton: false,
            position: "top",
          };
        }
        break;
      case 12:
        if (activeView === "collection" && !equipment.Weapon) {
          config = {
            step: 12,
            targetSelector: "#collection-item-cafeteria_spork",
            title: "Equip Your Mug",
            text: "This is your collection. You can view all items you've found. Click on the Stirbicks Mug to equip it as your weapon.",
            hasNextButton: false,
            position: "right",
          };
        }
        break;
      case 13:
        if (equipment.Weapon === "cafeteria_spork") {
          config = {
            step: 13,
            targetSelector: "#player-stats-power",
            title: "Power Up!",
            text: "Notice your Power increased! Equipping gear is the primary way to get stronger.",
            hasNextButton: true,
            position: "right",
          };
        }
        break;
      case 14:
        if (activeView === "collection") {
          config = {
            step: 14,
            targetSelector: "#footer-nav-missions",
            title: "Back to Business",
            text: "Great. Now that you're stronger, let's head back to the missions screen.",
            hasNextButton: false,
            position: "right",
          };
        }
        break;
      case 15:
        if (activeView === "missions") {
          config = {
            step: 15,
            targetSelector: "#lore-btn-caffeteria",
            title: "Gathering Intel",
            text: "Each zone has a story. You can click the book icon to read the lore and understand your objectives.",
            hasNextButton: false,
            position: "right",
          };
        }
        break;
      case 16:
        if (loreModalZoneId === "caffeteria") {
          config = {
            step: 16,
            targetSelector: "#lore-modal-close-btn",
            title: "Read the Lore",
            text: "Take a moment to read the lore, then click Close to continue.",
            hasNextButton: false,
            position: "top",
          };
        }
        break;
      case 17:
        if (activeView === "missions" && !loreModalZoneId) {
          config = {
            step: 17,
            targetSelector: "#power-req-supermarket",
            title: "Not Strong Enough... Yet",
            text: "The next zone requires more Power. You need to get stronger before you can proceed.",
            hasNextButton: true,
            position: "bottom",
          };
        }
        break;
      case 18:
        config = {
          step: 18,
          targetSelector: "#mission-btn-short-caffeteria",
          title: "Time to Grind",
          text: "Run another mission in The Cafeteria to get stronger.",
          hasNextButton: false,
          position: "right",
        };
        break;
      case 19:
        if (
          timeLeft <= 0 &&
          gameState.activeMission &&
          missionsCompleted === 1
        ) {
          config = {
            step: 19,
            targetSelector: "#global-claim-btn",
            title: "Claim Again",
            text: "Let's see what you found this time. Claim your rewards.",
            hasNextButton: false,
            position: "left",
          };
        }
        break;
      case 20:
        if (modalContent && missionsCompleted === 2) {
          config = {
            step: 20,
            targetSelector: null,
            title: "Loot Chance",
            text: "This time, no items. Item drops are based on chance. Longer missions have a higher chance to drop items and may even have exclusive loot!",
            hasNextButton: true,
            position: "center",
          };
        }
        break;
      case 21:
        if (!modalContent) {
          config = {
            step: 21,
            targetSelector: "#rewards-info-btn-caffeteria",
            title: "Check Potential Loot",
            text: "You can see all possible drops for a zone by clicking the 'i' icon.",
            hasNextButton: false,
            position: "left",
          };
        }
        break;
      case 22:
        if (rewardsInfoModalZoneId === "caffeteria") {
          config = {
            step: 22,
            targetSelector: "#info-btn-cafeteria_spork",
            title: "Item Details",
            text: "From this screen, you can click the 'i' on any item to see its details and where it drops. Close the windows when you're done.",
            hasNextButton: false,
            position: "horizontal-auto",
          };
        }
        break;
      case 23:
        if (itemInfoModalId && rewardsInfoModalZoneId) {
          config = {
            step: 23,
            targetSelector: "#item-info-modal-close-btn",
            title: "Item Info",
            text: "Good. Now close these windows to continue.",
            hasNextButton: false,
            position: "top",
          };
        } else if (rewardsInfoModalZoneId) {
          config = {
            step: 23,
            targetSelector: "#rewards-info-modal-close-btn",
            title: "One More...",
            text: "Now close this window to continue.",
            hasNextButton: false,
            position: "top",
          };
        }
        break;
      case 24:
        if (!itemInfoModalId && !rewardsInfoModalZoneId) {
          config = {
            step: 24,
            targetSelector: "#footer-nav-forge",
            title: "To the Forge!",
            text: "I've sent you 100 Gold. Let's go to the Forge to upgrade your mug.",
            hasNextButton: false,
            position: "top",
          };
        }
        break;
      case 25:
        if (activeView === "forge") {
          config = {
            step: 25,
            targetSelector: `[data-slotid='${EquipmentSlot.Weapon}']`,
            title: "Select Item",
            text: "First, select your equipped Stirbicks Mug.",
            hasNextButton: false,
            position: "right",
          };
        }
        break;
      case 26:
        if (
          activeView === "forge" &&
          selectedForgeSlot === EquipmentSlot.Weapon
        ) {
          config = {
            step: 26,
            targetSelector: "#forge-upgrade-panel",
            title: "The Upgrade Panel",
            text: "This is where the magic happens. Here you can see the item's current level and the potential power boost from the next upgrade.",
            hasNextButton: true,
            position: "top",
          };
        }
        break;
      case 27:
        if (
          activeView === "forge" &&
          selectedForgeSlot === EquipmentSlot.Weapon
        ) {
          config = {
            step: 27,
            targetSelector: "#forge-chance-bar",
            title: "Risk vs. Reward",
            text: "This is the risk-reward bar. Green is your chance to succeed. As you upgrade, yellow (level stays the same) and red (downgrade) sections will appear. Risky business!",
            hasNextButton: true,
            position: "top",
          };
        }
        break;
      case 28:
        if (
          activeView === "forge" &&
          selectedForgeSlot === EquipmentSlot.Weapon
        ) {
          config = {
            step: 28,
            targetSelector: "#forge-perks-section",
            title: "Forge Perks",
            text: "These are Forge Perks. Reaching levels +5, +10, and +15 unlocks powerful bonuses. The +15 perk is permanent across your entire account!",
            hasNextButton: true,
            position: "bottom",
          };
        }
        break;
      case 29:
        if (
          activeView === "forge" &&
          selectedForgeSlot === EquipmentSlot.Weapon &&
          (gameState.player.equipmentUpgrades[
            gameState.player.equipment.Weapon
          ] || 0) === 0
        ) {
          config = {
            step: 29,
            targetSelector: "#forge-upgrade-button",
            title: "First Upgrade",
            text: "Time to spend that Gold. Your first upgrade is guaranteed to succeed. Click 'Upgrade'!",
            hasNextButton: false,
            position: "top",
          };
        }
        break;
      case 30:
        if (unlockedBadgesModal.length > 0 && tutorialStep === 30) {
          config = {
            step: 30,
            targetSelector: "#badge-unlock-modal-close-btn",
            title: "Badge Unlocked!",
            text: "You've earned your first Badge! Badges are permanent achievements that grant small bonuses. Close this to continue.",
            hasNextButton: false,
            position: "top",
          };
        }
        break;
      case 31:
        if (
          activeView === "forge" &&
          selectedForgeSlot === EquipmentSlot.Weapon &&
          (gameState.player.equipmentUpgrades[
            gameState.player.equipment.Weapon
          ] || 0) === 1
        ) {
          config = {
            step: 31,
            targetSelector: "#forge-upgrade-button",
            title: "Keep Going!",
            text: "Great! Your mug is now +1. Let's do it again. This one is also a sure thing.",
            hasNextButton: false,
            position: "top",
          };
        }
        break;
      case 32:
        if (
          activeView === "forge" &&
          selectedForgeSlot === EquipmentSlot.Weapon &&
          (gameState.player.equipmentUpgrades[
            gameState.player.equipment.Weapon
          ] || 0) === 2
        ) {
          config = {
            step: 32,
            targetSelector: "#forge-upgrade-button",
            title: "One More Time",
            text: "Excellent, it's +2. One more upgrade to go! This last one is also guaranteed.",
            hasNextButton: false,
            position: "top",
          };
        }
        break;
      case 33:
        if (
          activeView === "forge" &&
          equipment.Weapon === "cafeteria_spork" &&
          (gameState.player.equipmentUpgrades[
            gameState.player.equipment.Weapon
          ] || 0) >= 3
        ) {
          config = {
            step: 33,
            targetSelector: null,
            title: "Well Forged!",
            text: "Excellent! Your mug is much stronger, boosting your Power. With this new strength, a new target is available.",
            hasNextButton: true,
            position: "center",
          };
        }
        break;
      case 34:
        config = {
          step: 34,
          targetSelector: "#footer-nav-missions",
          title: "Next Target",
          text: "With your newfound power, you can now access the next zone. Let's head back to Missions.",
          hasNextButton: false,
          position: "right",
        };
        break;
      case 35:
        if (
          activeView === "missions" &&
          !gameState.player.unlockedZoneIds.includes("supermarket")
        ) {
          config = {
            step: 35,
            targetSelector: "#unlock-btn-supermarket",
            title: "Unlock Zone",
            text: "The Supermarket is now within your reach. Click 'Unlock' to spend your Power and gain access.",
            hasNextButton: false,
            position: "top",
          };
        }
        break;
      case 36:
        if (unlockZoneModalId === "supermarket") {
          config = {
            step: 36,
            targetSelector: "#unlock-zone-confirm-btn",
            title: "Confirm Access",
            text: "This confirms you want to unlock the zone. Go ahead and confirm.",
            hasNextButton: false,
            position: "top",
          };
        }
        break;
      case 37:
        if (
          activeView === "missions" &&
          gameState.player.unlockedZoneIds.includes("supermarket")
        ) {
          config = {
            step: 37,
            targetSelector: "#mission-btn-short-supermarket",
            title: "Infiltrate",
            text: "Excellent. The zone is open. Now, start your first infiltration with a 'Short' mission.",
            hasNextButton: false,
            position: "right",
          };
        }
        break;
      case 38:
        if (gameState.activeMission?.zoneId === "supermarket") {
          config = {
            step: 38,
            targetSelector: null,
            title: "The Future is Yours",
            text: "Your journey is just beginning. Soon you'll face powerful Bosses, compete on the Leaderboard, and build an army in the Bio-Forge. We have big plans, including a Casino, Enchanting, and more. This game is for the community—its future is in your hands. Good luck, Agent.",
            hasNextButton: true,
            position: "center",
          };
        }
        break;
      case 39:
        if (!gameState.activeMission && missionsCompleted === 3) {
          config = {
            step: 39,
            targetSelector: null,
            title: "Tutorial Complete!",
            text: "You've mastered the basics. As a reward, you've been granted 'Initial Insight' - a powerful 15x speed boost for 10 minutes. Go face the Bosses, climb the Leaderboard, and build your army in the Bio-Forge. The world is yours to conquer. We'll be watching.",
            hasNextButton: true,
            position: "center",
          };
        }
        break;
    }

    setTutorialConfig(config);
  }, [
    gameState,
    timeLeft,
    modalContent,
    activeView,
    rewardsInfoModalZoneId,
    itemInfoModalId,
    loreModalZoneId,
    selectedForgeSlot,
    unlockedBadgesModal,
    unlockZoneModalId,
  ]);

  // This is a subset of all actions, expanded to include tutorial logic
  const actions = {
    advanceTutorial,
    setActiveView,
    startMission: useCallback(
      async (zoneId: string, durationKey: MissionDurationKey) => {
        if (!gameState || gameState.activeMission) return;
        const { tutorialStep, tutorialCompleted } = gameState.player;

        const result = await apiService.startMission({
          zoneId,
          durationKey,
          isDevMode,
        });

        if (result.success) {
          const missionDurationSeconds =
            (result.activeMission!.endTime - result.activeMission!.startTime) /
            1000;
          setTimeLeft(missionDurationSeconds);
          setGameState((prevState) => {
            const newState = {
              ...prevState!,
              activeMission: result.activeMission!,
              player: {
                ...prevState!.player,
                activeMission: result.activeMission!, // Update player's activeMission
              },
            };

            // Save complete state to localStorage
            localStorage.setItem("playerData", JSON.stringify(newState.player));

            return newState;
          });
          if (!tutorialCompleted) {
            if (tutorialStep === 1 || tutorialStep === 18)
              safeAdvanceTutorial();
            else if (tutorialStep === 37 && zoneId === "supermarket")
              safeAdvanceTutorial();
          }
        } else {
          setLastMessage(result.message);
        }
      },
      [gameState, isDevMode, safeAdvanceTutorial]
    ),
    claimMission: useCallback(async () => {
      if (!gameState || !gameState.activeMission) return;
      const { tutorialStep, tutorialCompleted } = gameState.player;

      console.log(
        "🔍 [Frontend] claimMission called with activeMission:",
        gameState.activeMission
      );
      console.log(
        "🔍 [Frontend] Current player state before API call:",
        gameState.player
      );

      const result = await apiService.claimMission({
        activeMission: gameState.activeMission,
      });

      console.log("🔍 [Frontend] API response received:", result);

      if (handleApiResponse(result)) {
        console.log(
          "🔍 [Frontend] handleApiResponse succeeded, updating mission state"
        );
        setTimeLeft(0);
        // Update only the activeMission part, preserving the player state update from handleApiResponse
        setGameState((prevState) => {
          if (!prevState) return prevState;
          console.log(
            "🔍 [Frontend] Updating game state, prevState.player:",
            prevState.player
          );
          console.log(
            "🔍 [Frontend] Using result.newPlayerState:",
            result.newPlayerState
          );

          // Ensure the new player state has activeMission cleared
          const updatedPlayerState = {
            ...(result.newPlayerState || prevState.player),
            activeMission: null,
          };

          const newState = {
            ...prevState,
            activeMission: null,
            player: updatedPlayerState,
          };

          // Update localStorage with the cleared activeMission
          localStorage.setItem(
            "playerData",
            JSON.stringify(updatedPlayerState)
          );

          console.log("🔍 [Frontend] Final newState after update:", newState);
          return newState;
        });
        if (!tutorialCompleted) {
          if (tutorialStep === 9 || tutorialStep === 19) safeAdvanceTutorial();
          if (tutorialStep === 38) safeAdvanceTutorial();
        }
      } else {
        console.log("🔍 [Frontend] handleApiResponse failed");
      }
    }, [gameState, handleApiResponse, safeAdvanceTutorial]),
    // Other actions
    requestCancelMission: () => setIsCancelConfirmModalOpen(true),
    closeCancelConfirmModal: () => setIsCancelConfirmModalOpen(false),
    confirmCancelMission: useCallback(async () => {
      if (!gameState || !gameState.player.tutorialCompleted) {
        setLastMessage("Cannot cancel missions during the tutorial.");
        setIsCancelConfirmModalOpen(false);
        return;
      }
      const result = await apiService.cancelMission({});

      if (handleApiResponse(result)) {
        // Update only the activeMission part, preserving the player state update from handleApiResponse
        setGameState((prevState) => {
          if (!prevState) return prevState;

          // Ensure the new player state has activeMission cleared
          const updatedPlayerState = {
            ...(result.newPlayerState || prevState.player),
            activeMission: null,
          };

          const newState = {
            ...prevState,
            activeMission: null,
            player: updatedPlayerState,
          };

          // Update localStorage with the cleared activeMission
          localStorage.setItem(
            "playerData",
            JSON.stringify(updatedPlayerState)
          );

          return newState;
        });
      }
      setIsCancelConfirmModalOpen(false);
    }, [gameState, handleApiResponse]),
    closeModal: () => {
      if (!gameState) return;
      const { tutorialStep, tutorialCompleted } = gameState.player;
      if (!tutorialCompleted) {
        if (tutorialStep === 10) {
          safeAdvanceTutorial();
        }
        if (tutorialStep === 20) {
          safeAdvanceTutorial();
        }
      }
      setModalContent(null);
    },
    openRewardsInfoModal: (zoneId: string) => {
      if (!gameState) return;
      const { tutorialStep, tutorialCompleted } = gameState.player;
      if (!tutorialCompleted && tutorialStep === 21) {
        safeAdvanceTutorial();
      }
      setRewardsInfoModalZoneId(zoneId);
    },
    closeRewardsInfoModal: () => {
      if (!gameState) return;
      const { tutorialStep, tutorialCompleted } = gameState.player;
      if (!tutorialCompleted && tutorialStep === 23) {
        safeAdvanceTutorial();
        setLastMessage("A 100 Gold stipend has been added to your funds.");
        setGameState((prevState) => {
          const newPlayerState = {
            ...prevState!.player,
            gold: prevState!.player.gold + 100,
          };

          // Update localStorage with the new player state
          localStorage.setItem("playerData", JSON.stringify(newPlayerState));

          return {
            ...prevState!,
            player: newPlayerState,
          };
        });
      }
      setRewardsInfoModalZoneId(null);
    },
    openItemInfoModal: (itemId: string) => {
      if (!gameState) return;
      const { tutorialStep, tutorialCompleted } = gameState.player;
      if (!tutorialCompleted && tutorialStep === 22) {
        safeAdvanceTutorial();
      }
      setItemInfoModalId(itemId);
    },
    closeItemInfoModal: () => setItemInfoModalId(null),
    openLoreModal: (zoneId: string) => {
      if (!gameState) return;
      const { tutorialStep, tutorialCompleted } = gameState.player;
      if (!tutorialCompleted && tutorialStep === 15) {
        safeAdvanceTutorial();
      }
      setLoreModalZoneId(zoneId);
    },
    closeLoreModal: () => {
      if (!gameState) return;
      const { tutorialStep, tutorialCompleted } = gameState.player;
      if (!tutorialCompleted && tutorialStep === 16) {
        advanceTutorial();
      }
      setLoreModalZoneId(null);
    },
    requestUnlockZone: useCallback(
      (zoneId: string) => {
        if (!gameState) return;
        const { tutorialStep, tutorialCompleted } = gameState.player;
        if (
          !tutorialCompleted &&
          tutorialStep === 35 &&
          zoneId === "supermarket"
        ) {
          safeAdvanceTutorial();
        }
        setUnlockZoneModalId(zoneId);
      },
      [gameState, safeAdvanceTutorial]
    ),
    closeUnlockZoneModal: () => setUnlockZoneModalId(null),
    confirmUnlockZone: useCallback(async () => {
      if (!gameState) return;
      const { tutorialStep, tutorialCompleted } = gameState.player;
      if (!tutorialCompleted && tutorialStep !== 36) {
        setLastMessage("Please follow the tutorial instructions.");
        setUnlockZoneModalId(null);
        return;
      }
      if (unlockZoneModalId) {
        const result = await apiService.unlockZone({
          zoneId: unlockZoneModalId,
        });
        handleApiResponse(result);
        if (
          !tutorialCompleted &&
          tutorialStep === 36 &&
          unlockZoneModalId === "supermarket"
        ) {
          safeAdvanceTutorial();
        }
      }
      setUnlockZoneModalId(null);
    }, [unlockZoneModalId, gameState, handleApiResponse, safeAdvanceTutorial]),
    equipItem: useCallback(
      async (itemId: string) => {
        if (!gameState) return;
        const { tutorialStep, tutorialCompleted } = gameState.player;
        const result = await apiService.equipItem({ itemId });
        if (
          handleApiResponse(result) &&
          !tutorialCompleted &&
          tutorialStep === 12
        ) {
          safeAdvanceTutorial();
        }
      },
      [gameState, handleApiResponse, safeAdvanceTutorial]
    ),
    unequipItem: useCallback(
      async (slot: EquipmentSlot) => {
        if (!gameState || !gameState.player.tutorialCompleted) {
          setLastMessage("Action disabled during tutorial.");
          return;
        }
        const result = await apiService.unequipItem({ slot });
        handleApiResponse(result);
      },
      [gameState, handleApiResponse]
    ),
    purchaseStoreItem: useCallback(
      async (itemId: string) => {
        if (!gameState || !gameState.player.tutorialCompleted) {
          setLastMessage("Please complete the tutorial first.");
          return;
        }
        const result = await apiService.purchaseStoreItem({ itemId });
        handleApiResponse(result);
      },
      [gameState, handleApiResponse]
    ),
    useConsumableItem: useCallback(
      async (itemId: string) => {
        if (!gameState || !gameState.player.tutorialCompleted) {
          setLastMessage("Please complete the tutorial first.");
          return;
        }
        const result = await apiService.useConsumableItem({ itemId });
        handleApiResponse(result);
      },
      [gameState, handleApiResponse]
    ),
    openCacheContentsModal: (cacheId: string) =>
      setCacheContentsModalId(cacheId),
    closeCacheContentsModal: () => setCacheContentsModalId(null),
    upgradeItem: useCallback(
      async (slot: EquipmentSlot, isSafe: boolean) => {
        if (!gameState) return;
        const {
          tutorialStep,
          tutorialCompleted,
          equipmentUpgrades,
          equipment,
        } = gameState.player;
        if (!tutorialCompleted && tutorialStep < 29) {
          setLastMessage("Follow the tutorial to learn how to upgrade.");
          return;
        }

        // Get the itemId from the selected slot
        const itemId = equipment[slot];
        if (!itemId) {
          setLastMessage("No item equipped in this slot.");
          return;
        }

        // Read upgrade level from itemId instead of slot
        const currentLevel = equipmentUpgrades[itemId] || 0;

        // Send itemId instead of slot to the backend
        const result = await apiService.upgradeItem({ itemId, isSafe });

        if (
          handleApiResponse(result) &&
          !tutorialCompleted &&
          result.outcome === "success"
        ) {
          if (
            (tutorialStep === 29 && currentLevel === 0) ||
            (tutorialStep === 31 && currentLevel === 1) ||
            (tutorialStep === 32 && currentLevel === 2)
          ) {
            safeAdvanceTutorial();
          }
        }
      },
      [gameState, handleApiResponse, safeAdvanceTutorial]
    ),
    fightBoss: useCallback(
      async (bossId: string) => {
        if (!gameState || !gameState.player.tutorialCompleted) {
          setLastMessage("Please complete the tutorial first.");
          return;
        }
        const result = await apiService.fightBoss({ bossId, isDevMode });
        handleApiResponse(result);
      },
      [gameState, isDevMode, handleApiResponse]
    ),
    selectForgeSlot: (slot: EquipmentSlot) => {
      if (!gameState) return;
      const { tutorialStep, tutorialCompleted } = gameState.player;
      if (!tutorialCompleted && tutorialStep === 25) {
        safeAdvanceTutorial();
      }
      setSelectedForgeSlot(slot);
    },
    toggleDevMode: () => setIsDevMode((prev) => !prev),
    closeBadgeUnlockModal: () => {
      if (!gameState) return;
      const { tutorialStep, tutorialCompleted } = gameState.player;
      if (!tutorialCompleted && tutorialStep === 30) {
        safeAdvanceTutorial();
      }
      setUnlockedBadgesModal([]);
    },
    openProfileModal: (profile: LeaderboardEntry) => setViewingProfile(profile),
    closeProfileModal: () => setViewingProfile(null),
    requestResetToMode: (i: number) => setResetConfirmation(i),
    confirmResetToMode: async () => {
      if (resetConfirmation !== null) {
        const newPlayerState = await apiService.resetPlayer({
          modeIndex: resetConfirmation,
        });
        setGameState((p) => {
          const newState = {
            ...p!,
            player: newPlayerState,
            activeMission: null,
          };

          // Update localStorage with the new player state
          localStorage.setItem("playerData", JSON.stringify(newPlayerState));

          return newState;
        });
      }
      setResetConfirmation(null);
    },
    cancelResetToMode: () => setResetConfirmation(null),
    investLabXp: useCallback(
      async (amount: number) => {
        if (!gameState) return;
        const result = await apiService.investLabXp({ amount });
        handleApiResponse(result);
      },
      [gameState, handleApiResponse]
    ),
    createHomunculus: useCallback(
      async (slottedParts: SlottedParts) => {
        if (!gameState) return;
        const result = await apiService.createHomunculus({ slottedParts });
        handleApiResponse(result);
      },
      [gameState, handleApiResponse]
    ),
    purchaseLabEquipment: useCallback(
      async (equipmentId: string) => {
        if (!gameState) return;
        const result = await apiService.purchaseLabEquipment({ equipmentId });
        handleApiResponse(result);
      },
      [gameState, handleApiResponse]
    ),
    startHibernation: useCallback(
      async (homunculusId: number) => {
        if (!gameState) return;
        const result = await apiService.startHibernation({
          homunculusId,
          isDevMode,
        });
        handleApiResponse(result);
      },
      [gameState, isDevMode, handleApiResponse]
    ),
    claimHibernation: useCallback(
      async (homunculusId: number) => {
        if (!gameState) return;
        const result = await apiService.claimHibernation({ homunculusId });
        handleApiResponse(result);
      },
      [gameState, handleApiResponse]
    ),
    openFeedingModal: (h: Homunculus) => setFeedingHomunculus(h),
    closeFeedingModal: () => setFeedingHomunculus(null),
    feedHomunculus: useCallback(
      async (homunculusId: number, foodItemId: string) => {
        if (!gameState) return;
        const result = await apiService.feedHomunculus({
          homunculusId,
          foodItemId,
        });
        if (handleApiResponse(result)) {
          setFeedingHomunculus(
            result.newPlayerState!.homunculi.find((h) => h.id === homunculusId)!
          );
        }
      },
      [gameState, handleApiResponse]
    ),
    openWorkplaceModal: (h: Homunculus) => setWorkplaceHomunculus(h),
    closeWorkplaceModal: () => setWorkplaceHomunculus(null),
    assignToWork: useCallback(
      async (homunculusId: number, zoneId: string) => {
        if (!gameState) return;
        const result = await apiService.assignToWork({ homunculusId, zoneId });
        if (handleApiResponse(result)) {
          setWorkplaceHomunculus(null);
        }
      },
      [gameState, handleApiResponse]
    ),
    collectPay: useCallback(
      async (homunculusId: number) => {
        if (!gameState) return;
        const result = await apiService.collectPay({ homunculusId });
        handleApiResponse(result);
      },
      [gameState, handleApiResponse]
    ),
    openEquippingModal: (h: Homunculus) => setEquippingHomunculus(h),
    closeEquippingModal: () => setEquippingHomunculus(null),
    equipHomunculusItem: useCallback(
      async (homunculusId: number, itemId: string) => {
        if (!gameState) return;
        const result = await apiService.equipHomunculusItem({
          homunculusId,
          itemId,
        });
        if (handleApiResponse(result)) {
          setEquippingHomunculus(
            result.newPlayerState!.homunculi.find((h) => h.id === homunculusId)!
          );
        }
      },
      [gameState, handleApiResponse]
    ),
    unequipHomunculusItem: useCallback(
      async (homunculusId: number, slot: HomunculusSlot) => {
        if (!gameState) return;
        const result = await apiService.unequipHomunculusItem({
          homunculusId,
          slot,
        });
        if (handleApiResponse(result)) {
          setEquippingHomunculus(
            result.newPlayerState!.homunculi.find((h) => h.id === homunculusId)!
          );
        }
      },
      [gameState, handleApiResponse]
    ),
    closeInitialBoostModal: () => {
      setIsInitialBoostModalOpen(false);
      if (!gameState?.player.hasSeenWalletConnectPrompt) {
        setTimeout(() => {
          setIsConnectWalletModalOpen(true);
        }, 300);
      }
    },
    // Show wallet connect modal for all players
    showWalletConnectPrompt: () => {
      console.log(
        "🎮 [useGameLoop] showWalletConnectPrompt called, setting modal to true"
      );
      setIsConnectWalletModalOpen(true);
    },
    openBuffInfoModal: (buff: ActiveBoost) => setViewingBuffInfo(buff),
    closeBuffInfoModal: () => setViewingBuffInfo(null),
    enchantItem: useCallback(
      async (slot: EquipmentSlot, costMultiplier: number) => {
        if (!gameState) return;
        const result = await apiService.enchantItem({ slot, costMultiplier });
        handleApiResponse(result);
      },
      [gameState, handleApiResponse]
    ),
    rerollEnchantment: useCallback(
      async (
        slot: EquipmentSlot,
        enchantmentIndex: number,
        costMultiplier: number
      ) => {
        if (!gameState) return;
        const result = await apiService.rerollEnchantment({
          slot,
          enchantmentIndex,
          costMultiplier,
        });
        handleApiResponse(result);
      },
      [gameState, handleApiResponse]
    ),
    closeConnectWalletModal: () => {
      setIsConnectWalletModalOpen(false);
      setGameState((prev) => {
        const newPlayerState = {
          ...prev!.player,
          hasSeenWalletConnectPrompt: true,
        };

        // Update localStorage with the new player state
        localStorage.setItem("playerData", JSON.stringify(newPlayerState));

        return {
          ...prev!,
          player: newPlayerState,
        };
      });
    },
    connectWallet: async () => {
      try {
        setLastMessage("Connecting to wallet...");

        // 1. Get wallet provider
        const provider = getProvider();
        if (!provider) {
          alert("Phantom wallet not found! Please install it.");
          window.open("https://phantom.app/", "_blank");
          return;
        }

        // 2. Connect wallet (shows native wallet dialog)
        const { publicKey } = await provider.connect();
        console.log("✅ Wallet connected:", publicKey.toString());

        // 3. Request nonce from backend
        console.log("🔄 Requesting nonce from backend...");
        const nonceResponse = await fetch(
          "http://localhost:5001/api/auth/nonce",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              walletAddress: publicKey.toString(),
            }),
          }
        );

        if (!nonceResponse.ok) {
          throw new Error("Failed to get nonce from server");
        }

        const { message } = await nonceResponse.json();
        console.log("📝 Message to sign:", message);

        // 4. Sign the message with nonce (shows native wallet dialog)
        const messageBytes = new TextEncoder().encode(message);
        const { signature } = await provider.signMessage(messageBytes);

        // 5. Log success
        console.log("✅ Message signed successfully");
        console.log("🔐 Signature:", Array.from(signature));
        console.log("📍 Wallet Address:", publicKey.toString());

        // 6. Authenticate with backend using signature
        console.log("🔄 Authenticating with backend...");
        const authResponse = await fetch(
          "http://localhost:5001/api/auth/authenticate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              walletAddress: publicKey.toString(),
              signature: Array.from(signature),
              message: message,
            }),
          }
        );

        if (!authResponse.ok) {
          const errorData = await authResponse.json();
          throw new Error(errorData.error || "Authentication failed");
        }

        const authData = await authResponse.json();
        console.log("✅ Authentication successful:", authData);

        // 7. Check if this is a new wallet or existing wallet
        if (
          authData.player.walletAddress &&
          authData.player.walletAddress === publicKey.toString()
        ) {
          // This is an existing wallet account - show choice modal
          actions.showWalletChoiceModal(authData.player, authData.token);
        } else {
          // This is a new wallet - link it to the current local player
          await actions.linkWalletToLocalPlayer(publicKey.toString());
        }

        setIsConnectWalletModalOpen(false);
      } catch (error: any) {
        console.error("Wallet connection failed:", error);

        // Clear any existing wallet choice modal state
        setWalletChoiceModal({
          isOpen: false,
          walletPlayerData: null,
          jwtToken: null,
        });

        if (error.code === 4001) {
          setLastMessage("Wallet connection was rejected by user.");
        } else {
          setLastMessage(`Failed to connect wallet: ${error.message}`);
        }
      }
    },
    disconnectWallet: () => {
      setGameState((prev) => {
        if (!prev) return null;
        const newPlayerState = {
          ...prev.player,
          isWalletConnected: false,
          ownsReptilianzNFT: false,
        };

        // Update localStorage with the new player state
        localStorage.setItem("playerData", JSON.stringify(newPlayerState));

        return {
          ...prev,
          player: newPlayerState,
        };
      });
      setLastMessage("Wallet disconnected.");
    },
    toggleNFTOwnership: () => {
      // Dev only
      if (!isDevMode || !gameState) return;
      setGameState((prev) => {
        if (!prev) return null;
        const newPlayerState = {
          ...prev.player,
          ownsReptilianzNFT: !prev.player.ownsReptilianzNFT,
        };

        // Update localStorage with the new player state
        localStorage.setItem("playerData", JSON.stringify(newPlayerState));

        return {
          ...prev,
          player: newPlayerState,
        };
      });
    },

    // Casino actions
    openCasino: () => setShowCasino(true),
    closeCasino: () => setShowCasino(false),

    // Helper functions for wallet linking
    showWalletChoiceModal: (walletPlayerData: any, jwtToken: string) => {
      setWalletChoiceModal({
        isOpen: true,
        walletPlayerData,
        jwtToken,
      });
    },

    closeWalletChoiceModal: () => {
      setWalletChoiceModal({
        isOpen: false,
        walletPlayerData: null,
        jwtToken: null,
      });
    },

    linkWalletToLocalPlayer: async (walletAddress: string) => {
      try {
        setLastMessage("Linking wallet to local account...");

        // Get current local player data
        const localPlayerData = gameState?.player;
        if (!localPlayerData) {
          throw new Error("No local player data found");
        }

        // Call the link-wallet endpoint
        const response = await fetch(
          "http://localhost:5001/api/auth/link-wallet",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              walletAddress,
              playerData: localPlayerData,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to link wallet");
        }

        const authData = await response.json();

        // Update localStorage with new token and player data
        localStorage.setItem("authToken", authData.token);
        localStorage.setItem("playerData", JSON.stringify(authData.player));

        // Update game state
        setGameState((prev) => {
          if (!prev) return null;
          const activeMission = isValidActiveMission(
            authData.player.activeMission
          )
            ? authData.player.activeMission
            : null;
          return {
            ...prev,
            player: authData.player,
            activeMission,
          };
        });

        setLastMessage(
          "Wallet linked successfully! Progress is now securely backed up."
        );
      } catch (error: any) {
        console.error("Wallet linking failed:", error);
        setLastMessage(`Failed to link wallet: ${error.message}`);
      }
    },

    continueWithWalletData: async () => {
      try {
        setLastMessage("Switching to wallet account...");

        // Get the wallet player data and JWT token from the modal state
        const { walletPlayerData, jwtToken } = walletChoiceModal;
        if (!walletPlayerData || !jwtToken) {
          throw new Error(
            "Wallet data or JWT token not found. Please try connecting your wallet again."
          );
        }

        // Update localStorage with wallet player data AND JWT token
        localStorage.setItem("playerData", JSON.stringify(walletPlayerData));
        localStorage.setItem("authToken", jwtToken);

        // Also store guestId separately for consistency
        if (walletPlayerData.guestId) {
          localStorage.setItem("guestId", walletPlayerData.guestId);
        }

        // Update game state with wallet player data
        setGameState((prev) => {
          if (!prev) return null;
          const activeMission = isValidActiveMission(
            walletPlayerData.activeMission
          )
            ? walletPlayerData.activeMission
            : null;
          return {
            ...prev,
            player: walletPlayerData,
            activeMission,
          };
        });

        setLastMessage("Switched to wallet account successfully!");
        setWalletChoiceModal({
          isOpen: false,
          walletPlayerData: null,
          jwtToken: null,
        });
      } catch (error: any) {
        console.error("Failed to switch to wallet account:", error);
        setLastMessage(`Failed to switch account: ${error.message}`);
      }
    },
  };

  if (isLoading || !isInitialized || !gameState) {
    return {
      gameState: null,
      timeLeft,
      lastMessage,
      modalContent,
      isLoading: true,
      isInitialized,
      isDevMode,
      rewardsInfoModalZoneId,
      itemInfoModalId,
      loreModalZoneId,
      isCancelConfirmModalOpen,
      unlockZoneModalId,
      cacheContentsModalId,
      forgeUpgradeResult,
      unlockedBadgesModal,
      viewingProfile,
      globalBossTimer,
      feedingHomunculus,
      workplaceHomunculus,
      equippingHomunculus,
      resetConfirmation,
      isInitialBoostModalOpen,
      isConnectWalletModalOpen,
      walletChoiceModal,
      pendingMissionRewards,
      showCasino,
      viewingBuffInfo,
      tutorialConfig,
      activeView,
      selectedForgeSlot,
      actions,
      serverError,
      showServerErrorModal,
      setShowServerErrorModal,
    };
  }

  return {
    gameState,
    timeLeft,
    lastMessage,
    modalContent,
    isLoading,
    isInitialized,
    isDevMode,
    rewardsInfoModalZoneId,
    itemInfoModalId,
    loreModalZoneId,
    isCancelConfirmModalOpen,
    unlockZoneModalId,
    cacheContentsModalId,
    forgeUpgradeResult,
    unlockedBadgesModal,
    viewingProfile,
    globalBossTimer,
    feedingHomunculus,
    workplaceHomunculus,
    equippingHomunculus,
    resetConfirmation,
    isInitialBoostModalOpen,
    isConnectWalletModalOpen,
    walletChoiceModal,
    pendingMissionRewards,
    showCasino,
    viewingBuffInfo,
    tutorialConfig,
    activeView,
    selectedForgeSlot,
    actions,
    serverError,
    showServerErrorModal,
    setShowServerErrorModal,
  };
};
