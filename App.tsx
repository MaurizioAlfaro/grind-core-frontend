import React, { useState } from "react";
import { useGameLoop } from "./hooks/useGameLoop";
import { useAuthState } from "./hooks/useAuthState";
import { LoginScreen } from "./components/common/LoginScreen";
import { walletAuthService } from "./services/walletAuthService";
import { PlayerStats } from "./features/player/PlayerStats";
import { RewardModal } from "./components/common/RewardModal";
import { RewardsInfoModal } from "./components/common/RewardsInfoModal";
import { ItemInfoModal } from "./components/common/ItemInfoModal";
import { MissionsView } from "./features/missions/MissionsView";
import { Collection } from "./features/collection/Collection";
import { StoreView } from "./features/store/StoreView";
import { FooterNav, AppView } from "./features/navigation/FooterNav";
import { ConfirmationModal } from "./components/common/ConfirmationModal";
import { GlobalMissionProgress } from "./features/navigation/GlobalMissionProgress";
import { ActiveBuffs } from "./features/player/ActiveBuffs";
import { CacheContentsModal } from "./features/store/CacheContentsModal";
import { ForgeView } from "./features/forge/ForgeView";
import { LoreModal } from "./features/missions/LoreModal";
import { LeaderboardView } from "./features/leaderboard/LeaderboardView";
import { BadgesView } from "./features/badges/BadgesView";
import { BadgeUnlockModal } from "./features/badges/BadgeUnlockModal";
import { ProfileModal } from "./features/leaderboard/ProfileModal";
import { UnlockZoneModal } from "./features/missions/UnlockZoneModal";
import { BossesView } from "./features/bosses/BossesView";
import { BossLoreModal } from "./features/bosses/BossLoreModal";
import { BossRewardsInfoModal } from "./features/bosses/BossRewardsInfoModal";
import { LabView } from "./features/lab/LabView";
import { FeedingModal } from "./features/lab/FeedingModal";
import { WorkplaceModal } from "./features/lab/WorkplaceModal";
import { HomunculusEquipmentModal } from "./features/lab/HomunculusEquipmentModal";
import { WikiView } from "./features/wiki/WikiView";
import { InitialBoostModal } from "./features/rewards/InitialBoostModal";

import { SettingsView } from "./features/settings/SettingsView";
import { BuffInfoModal } from "./components/common/BuffInfoModal";
import { Tutorial } from "./features/tutorial/Tutorial";
import { ServerErrorModal } from "./components/common/ServerErrorModal";

import { BossIcon } from "./features/navigation/icons/BossIcon";
import { LabIcon } from "./features/navigation/icons/LabIcon";
import { BadgeIcon } from "./features/navigation/icons/BadgeIcon";
import { WikiIcon } from "./features/wiki/icons/WikiIcon";
import { MissionIcon } from "./features/navigation/icons/MissionIcon";
import { CollectionIcon } from "./features/navigation/icons/CollectionIcon";
import { ForgeIcon } from "./features/navigation/icons/ForgeIcon";
import { StoreIcon } from "./features/navigation/icons/StoreIcon";
import { SettingsIcon } from "./features/navigation/icons/SettingsIcon";

import { ZONES } from "./constants/index";

const App: React.FC = () => {
  const {
    gameState,
    timeLeft,
    lastMessage,
    modalContent,
    isLoading,
    isInitialized,
    isDevMode,
    rewardsInfoModalZoneId,
    isCancelConfirmModalOpen,
    itemInfoModalId,
    cacheContentsModalId,
    forgeUpgradeResult,
    loreModalZoneId,
    unlockedBadgesModal,
    viewingProfile,
    unlockZoneModalId,
    globalBossTimer,
    feedingHomunculus,
    workplaceHomunculus,
    equippingHomunculus,
    resetConfirmation,
    isInitialBoostModalOpen,
    isConnectWalletModalOpen,
    viewingBuffInfo,
    tutorialConfig,
    activeView,
    selectedForgeSlot,
    actions,
    serverError,
    showServerErrorModal,
    setShowServerErrorModal,
  } = useGameLoop();

  // Authentication state
  const {
    authState,
    showLoginScreen,
    handleNewAccount,
    handleWalletLogin,
    handleRecoveryLogin,
  } = useAuthState();

  // States for new modals
  const [bossLoreModalId, setBossLoreModalId] = useState<string | null>(null);
  const [bossRewardsModalId, setBossRewardsModalId] = useState<string | null>(
    null
  );

  const openBossLoreModal = (bossId: string) => setBossLoreModalId(bossId);
  const closeBossLoreModal = () => setBossLoreModalId(null);
  const openBossRewardsModal = (bossId: string) =>
    setBossRewardsModalId(bossId);
  const closeBossRewardsModal = () => setBossRewardsModalId(null);

  // Show login screen if user is not authenticated
  if (showLoginScreen) {
    return (
      <LoginScreen
        onNewAccount={handleNewAccount}
        onWalletLogin={handleWalletLogin}
        onRecoveryLogin={handleRecoveryLogin}
      />
    );
  }

  // If authenticated but game is still loading, show loading screen
  if (isLoading || !isInitialized || !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-400 font-orbitron text-2xl">
        Loading Game Data...
      </div>
    );
  }

  const isLabUnlocked = gameState.player.level >= 20;
  const fifthZoneId = ZONES[4].id; // post_office
  const isBossesUnlocked =
    gameState.player.unlockedZoneIds.includes(fifthZoneId);
  const isMissionActive = !!gameState.activeMission;

  const ContextualNavButton: React.FC<{
    activeView: AppView;
    onNavigate: (view: AppView) => void;
  }> = ({ activeView, onNavigate }) => {
    const viewPairs: { [key in AppView]?: AppView } = {
      missions: "bosses",
      bosses: "missions",
      collection: "badges",
      badges: "collection",
      store: "wiki",
      wiki: "store",
      settings: "leaderboard",
      leaderboard: "settings",
    };

    const viewDetails: {
      [key in AppView]?: { icon: React.ReactNode; label: string };
    } = {
      missions: { icon: <MissionIcon />, label: "Missions" },
      bosses: { icon: <BossIcon />, label: "Bosses" },
      collection: { icon: <CollectionIcon />, label: "Collection" },
      badges: { icon: <BadgeIcon />, label: "Badges" },
      forge: { icon: <ForgeIcon />, label: "Forge" },
      lab: { icon: <LabIcon />, label: "Lab" },
      store: { icon: <StoreIcon />, label: "Store" },
      wiki: { icon: <WikiIcon />, label: "Wiki" },
      settings: { icon: <SettingsIcon />, label: "Account" },
    };

    const targetView = viewPairs[activeView];
    if (!targetView) {
      return null;
    }

    const action = viewDetails[targetView];
    if (!action) {
      return null;
    }

    let isLocked = false;
    let lockMessage = "";

    if (targetView === "bosses" && !isBossesUnlocked) {
      isLocked = true;
      lockMessage = "Get to the fifth area";
    }

    return (
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => !isLocked && onNavigate(targetView)}
          disabled={isLocked}
          className={`group pointer-events-auto flex items-center gap-3 bg-gray-800/90 backdrop-blur-sm border-2 rounded-full py-2 pl-4 pr-5 text-white transition-all shadow-lg ${
            isLocked
              ? "border-gray-600 cursor-not-allowed"
              : "border-cyan-500/50 hover:bg-cyan-900/80 hover:border-cyan-400 transform hover:scale-105"
          }`}
        >
          <div
            className={`transition-transform ${
              isLocked ? "text-gray-500" : "text-cyan-400 group-hover:scale-110"
            }`}
          >
            {action.icon}
          </div>
          <span
            className={`text-sm font-bold ${isLocked ? "text-gray-500" : ""}`}
          >
            {isLocked ? lockMessage : action.label}
          </span>
        </button>
      </div>
    );
  };

  const LockedView: React.FC<{
    icon: React.ReactNode;
    title: string;
    message: string;
  }> = ({ icon, title, message }) => (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 rounded-lg h-96 animate-fade-in-up">
      <div className="text-6xl text-gray-600 mb-4">{icon}</div>
      <h2 className="text-2xl font-orbitron text-gray-500">{title} Locked</h2>
      <p className="text-gray-400 mt-2">{message}</p>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case "missions":
        return (
          <MissionsView
            gameState={gameState}
            actions={actions}
            isMissionActive={isMissionActive}
            activeMission={gameState.activeMission}
            timeLeft={timeLeft}
          />
        );
      case "bosses":
        if (!isBossesUnlocked) {
          return (
            <LockedView
              icon={<BossIcon />}
              title="Bosses"
              message={`Unlock the ${ZONES[4].name} zone to face this threat.`}
            />
          );
        }
        return (
          <BossesView
            player={gameState.player}
            globalBossTimer={globalBossTimer}
            onFightBoss={actions.fightBoss}
            onShowLore={openBossLoreModal}
            onShowRewards={openBossRewardsModal}
            isDevMode={isDevMode}
          />
        );
      case "collection":
        return (
          <Collection
            player={gameState.player}
            onEquip={actions.equipItem}
            onUnequip={actions.unequipItem}
            onShowItemInfo={actions.openItemInfoModal}
          />
        );
      case "lab":
        return (
          <LabView
            player={gameState.player}
            onInvestXp={actions.investLabXp}
            onCreateHomunculus={actions.createHomunculus}
            onPurchaseEquipment={actions.purchaseLabEquipment}
            onShowItemInfo={actions.openItemInfoModal}
            onStartHibernation={actions.startHibernation}
            onClaimHibernation={actions.claimHibernation}
            onOpenFeedingModal={actions.openFeedingModal}
            onOpenWorkplaceModal={actions.openWorkplaceModal}
            onOpenEquippingModal={actions.openEquippingModal}
            onCollectPay={actions.collectPay}
          />
        );
      case "forge":
        return (
          <ForgeView
            gameState={gameState}
            onUpgrade={actions.upgradeItem}
            upgradeResult={forgeUpgradeResult}
            onEnchant={actions.enchantItem}
            onReroll={actions.rerollEnchantment}
            selectedSlot={selectedForgeSlot}
            onSelectSlot={actions.selectForgeSlot}
          />
        );
      case "badges":
        return (
          <BadgesView
            player={gameState.player}
            onNavigate={actions.setActiveView}
          />
        );
      case "leaderboard":
        return (
          <LeaderboardView
            player={gameState.player}
            onOpenProfile={actions.openProfileModal}
          />
        );
      case "store":
        return (
          <StoreView
            player={gameState.player}
            onPurchase={actions.purchaseStoreItem}
            onUse={actions.useConsumableItem}
            onShowCacheContents={actions.openCacheContentsModal}
          />
        );
      case "wiki":
        return <WikiView />;
      case "settings":
        return (
          <SettingsView
            player={gameState.player}
            onConnect={actions.connectWallet}
            onDisconnect={actions.disconnectWallet}
            onToggleNFT={actions.toggleNFTOwnership}
            onLogout={() => {
              // Clear auth and show login screen
              walletAuthService.clearAuth();
              window.location.reload(); // Simple way to reset the app state
            }}
            isDevMode={isDevMode}
          />
        );
      default:
        return (
          <MissionsView
            gameState={gameState}
            actions={actions}
            isMissionActive={isMissionActive}
            activeMission={gameState.activeMission}
            timeLeft={timeLeft}
          />
        );
    }
  };

  return (
    <>
      {tutorialConfig && (
        <Tutorial config={tutorialConfig} onNext={actions.advanceTutorial} />
      )}
      {isDevMode && tutorialConfig && (
        <div className="fixed top-2 left-2 z-[10000] bg-gray-900/80 p-2 rounded-lg border border-red-500/50 backdrop-blur-sm text-red-300 text-xs font-mono">
          Tutorial Step: {tutorialConfig.step} / 39
        </div>
      )}
      <div className="fixed top-2 right-2 z-50 flex flex-col items-end gap-2">
        <div className="bg-gray-900/80 p-2 rounded-lg border border-yellow-500/50 backdrop-blur-sm">
          <label className="flex items-center gap-2 text-yellow-300 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isDevMode}
              onChange={actions.toggleDevMode}
              className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-600"
              style={{ accentColor: "#eab308" }}
            />
            Developer Mode
          </label>
        </div>
        {isDevMode && (
          <div className="bg-gray-900/80 p-2 rounded-lg border border-cyan-500/50 backdrop-blur-sm text-xs text-cyan-300 space-y-2 w-48 animate-fade-in-up">
            <p className="text-center font-bold">Load Save State</p>
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 11 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => actions.requestResetToMode(i)}
                  className="w-full text-center px-2 py-1 bg-cyan-800 hover:bg-cyan-700 rounded transition-colors"
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-xl mx-auto flex flex-col min-h-screen">
        {isInitialBoostModalOpen && (
          <InitialBoostModal onClose={actions.closeInitialBoostModal} />
        )}
        {isConnectWalletModalOpen && (
          <ConnectWalletModal
            onConnect={actions.connectWallet}
            onClose={actions.closeConnectWalletModal}
          />
        )}
        {viewingBuffInfo && (
          <BuffInfoModal
            buff={viewingBuffInfo}
            onClose={actions.closeBuffInfoModal}
          />
        )}
        {modalContent && (
          <RewardModal
            title={modalContent.title}
            rewards={modalContent.rewards}
            onClose={actions.closeModal}
          />
        )}
        {rewardsInfoModalZoneId && (
          <RewardsInfoModal
            zoneId={rewardsInfoModalZoneId}
            discoveredItemIds={gameState.player.discoveredItemIds}
            onClose={actions.closeRewardsInfoModal}
            onShowItemInfo={actions.openItemInfoModal}
          />
        )}
        {itemInfoModalId && (
          <ItemInfoModal
            itemId={itemInfoModalId}
            onClose={actions.closeItemInfoModal}
          />
        )}
        {cacheContentsModalId && (
          <CacheContentsModal
            cacheId={cacheContentsModalId}
            onClose={actions.closeCacheContentsModal}
            onShowItemInfo={actions.openItemInfoModal}
          />
        )}
        {loreModalZoneId && (
          <LoreModal
            zoneId={loreModalZoneId}
            onClose={actions.closeLoreModal}
          />
        )}
        {unlockZoneModalId && (
          <UnlockZoneModal
            zoneId={unlockZoneModalId}
            onConfirm={actions.confirmUnlockZone}
            onCancel={actions.closeUnlockZoneModal}
          />
        )}
        {unlockedBadgesModal.length > 0 && (
          <BadgeUnlockModal
            badges={unlockedBadgesModal}
            onClose={actions.closeBadgeUnlockModal}
          />
        )}
        {viewingProfile && (
          <ProfileModal
            profile={viewingProfile}
            onClose={actions.closeProfileModal}
          />
        )}
        {feedingHomunculus && (
          <FeedingModal
            homunculus={feedingHomunculus}
            player={gameState.player}
            onFeed={actions.feedHomunculus}
            onClose={actions.closeFeedingModal}
          />
        )}
        {workplaceHomunculus && (
          <WorkplaceModal
            homunculus={workplaceHomunculus}
            player={gameState.player}
            onAssign={actions.assignToWork}
            onClose={actions.closeWorkplaceModal}
          />
        )}
        {equippingHomunculus && (
          <HomunculusEquipmentModal
            homunculus={equippingHomunculus}
            player={gameState.player}
            onEquip={actions.equipHomunculusItem}
            onUnequip={actions.unequipHomunculusItem}
            onClose={actions.closeEquippingModal}
            onShowItemInfo={actions.openItemInfoModal}
          />
        )}
        {resetConfirmation !== null && (
          <ConfirmationModal
            title="Reset Game State"
            message={`Are you sure you want to load 'Mode ${resetConfirmation}'? All current progress will be lost.`}
            onConfirm={actions.confirmResetToMode}
            onCancel={actions.cancelResetToMode}
            confirmText="Yes, Reset"
            cancelText="Cancel"
          />
        )}

        {isCancelConfirmModalOpen && (
          <ConfirmationModal
            title="Cancel Mission"
            message="Are you sure you want to cancel the active mission? All potential rewards and any applied boosts will be lost."
            onConfirm={actions.confirmCancelMission}
            onCancel={actions.closeCancelConfirmModal}
            confirmText="Yes, Cancel"
            cancelText="Go Back"
          />
        )}
        {bossLoreModalId && (
          <BossLoreModal
            bossId={bossLoreModalId}
            onClose={closeBossLoreModal}
          />
        )}
        {bossRewardsModalId && (
          <BossRewardsInfoModal
            bossId={bossRewardsModalId}
            onClose={closeBossRewardsModal}
            onShowItemInfo={actions.openItemInfoModal}
          />
        )}

        <header className="p-4 pt-12 sticky top-0 bg-gray-900 z-20">
          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg p-4 space-y-4">
            <PlayerStats player={gameState.player} />
            <ActiveBuffs
              activeBoosts={gameState.player.activeBoosts}
              onViewBuff={actions.openBuffInfoModal}
            />
            <ContextualNavButton
              activeView={activeView}
              onNavigate={actions.setActiveView}
            />
          </div>
        </header>

        <main className="flex-grow p-4 space-y-4 pb-40">
          {renderContent()}

          {lastMessage && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md p-4 z-30 text-center text-sm text-yellow-300 ">
              <span className="bg-yellow-900/80 backdrop-blur-sm p-3 rounded-md">
                {lastMessage}
              </span>
            </div>
          )}
        </main>

        <GlobalMissionProgress
          activeMission={gameState.activeMission}
          timeLeft={timeLeft}
          onClaim={actions.claimMission}
        />

        <FooterNav
          activeView={activeView}
          onNavigate={actions.setActiveView}
          missionActive={isMissionActive}
          isLabUnlocked={isLabUnlocked}
        />

        <ServerErrorModal
          isOpen={showServerErrorModal}
          onClose={() => setShowServerErrorModal(false)}
          error={serverError || ""}
        />
      </div>
    </>
  );
};

export default App;
