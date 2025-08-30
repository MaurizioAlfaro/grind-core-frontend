import { useState, useCallback, useEffect } from "react";
import { useGameLogger } from "./useGameLogger";
import { GameSettings, GameState, Card, GameResult } from "../types";
import * as blackjackApi from "../../../mockApi/routes/blackjack.routes";

export const useGameLogic = () => {
  const [settings, setSettings] = useState<GameSettings>({} as GameSettings);
  const [deck, setDeck] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.BETTING);
  const [chips, setChips] = useState<number>(0);

  const [playerHands, setPlayerHands] = useState<Card[][]>([]);
  const [bets, setBets] = useState<number[]>([]);
  const [activeHandIndex, setActiveHandIndex] = useState(0);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);

  const [mainBet, setMainBet] = useState<number>(0);
  const [lastBet, setLastBet] = useState<number>(0);
  const [netRoundWinnings, setNetRoundWinnings] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [tableMessage, setTableMessage] = useState<string | null>(null);

  const { log, addLogEntry, clearLog } = useGameLogger();

  const updateStateFromApi = (apiState: any) => {
    setSettings(apiState.settings);
    setDeck(apiState.deck);
    setDealerHand(apiState.dealerHand);
    setGameState(apiState.gameState);
    setChips(apiState.chips);
    setPlayerHands(apiState.playerHands);
    setBets(apiState.bets);
    setActiveHandIndex(apiState.activeHandIndex);
    setGameResults(apiState.gameResults);
    setMainBet(apiState.mainBet);
    setLastBet(apiState.lastBet);
    setNetRoundWinnings(apiState.netRoundWinnings);
    setTableMessage(apiState.message || null);
    if (apiState.log) {
      addLogEntry(apiState.log.type, apiState.log.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const initialState = await blackjackApi.initGame();

      // Check localStorage for chips and override if available
      let storedChips = localStorage.getItem("blackjack_chips");
      if (!storedChips) {
        // Set initial chips if none exist
        const initialChips = 100000;
        localStorage.setItem("blackjack_chips", initialChips.toString());
        storedChips = initialChips.toString();
      }

      initialState.chips = parseInt(storedChips);
      updateStateFromApi(initialState);
      addLogEntry(
        "info",
        `Game loaded. Shuffling ${initialState.settings.deckCount} decks.`
      );
      setIsLoading(false);
    };
    init();
  }, [addLogEntry]);

  // Add effect to sync chips with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedChips = localStorage.getItem("blackjack_chips");
      if (storedChips) {
        setChips(parseInt(storedChips));
      }
    };

    const handleChipsUpdated = (event: CustomEvent) => {
      setChips(event.detail.chips);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "chipsUpdated",
      handleChipsUpdated as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "chipsUpdated",
        handleChipsUpdated as EventListener
      );
    };
  }, []);

  // Sync chips back to localStorage whenever chips state changes
  useEffect(() => {
    if (chips > 0) {
      localStorage.setItem("blackjack_chips", chips.toString());
    }
  }, [chips]);

  const performAction = useCallback(
    async (action: Promise<any>) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const newState = await action;
        updateStateFromApi(newState);
      } catch (error) {
        console.error("API Error:", error);
        addLogEntry("error", "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, addLogEntry]
  );

  const placeBet = (amount: number) =>
    performAction(blackjackApi.placeBet(amount));
  const clearBet = () => performAction(blackjackApi.clearBet());
  const repeatBet = () => performAction(blackjackApi.repeatBet());
  const maxBet = () => performAction(blackjackApi.maxBet());
  const deal = () => performAction(blackjackApi.deal());
  const decideInsurance = (accepted: boolean) =>
    performAction(blackjackApi.decideInsurance(accepted));
  const decideEvenMoney = (accepted: boolean) =>
    performAction(blackjackApi.decideEvenMoney(accepted));
  const nextRound = () => performAction(blackjackApi.nextRound());
  const hit = () => performAction(blackjackApi.hit());
  const stand = () => performAction(blackjackApi.stand());
  const double = () => performAction(blackjackApi.double());
  const split = () => performAction(blackjackApi.split());
  const surrender = () => performAction(blackjackApi.surrender());
  const handleSaveSettings = (newSettings: GameSettings) =>
    performAction(blackjackApi.updateSettings(newSettings));

  return {
    settings,
    deck,
    dealerHand,
    gameState,
    chips,
    playerHands,
    bets,
    activeHandIndex,
    gameResults,
    mainBet,
    lastBet,
    netRoundWinnings,
    tableMessage,
    log,
    isLoading,
    actions: {
      placeBet,
      clearBet,
      repeatBet,
      maxBet,
      deal,
      decideInsurance,
      decideEvenMoney,
      nextRound,
      hit,
      stand,
      double,
      split,
      surrender,
      clearLog,
      handleSaveSettings,
    },
  };
};
