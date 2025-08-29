import React from "react";
import Hand from "./Hand";
import BetDisplay from "./BetDisplay";
import { BlackjackResultDisplay, GameResultDisplay } from "./ResultDisplays";
import { GameState, Card, GameResult, Rank } from "../types";
import { calculateHandValue } from "../utils/hand";
import { RANK_VALUES } from "../constants";

interface TableUIProps {
  dealerHand: Card[];
  gameState: GameState;
  gameResults: GameResult[];
  netRoundWinnings: number;
  totalBet: number;
  isDealing: boolean;
  isPeeking?: boolean;
  tableMessage?: string | null;
}

const getDealerScore = (hand: Card[], gameState: GameState): number => {
  const cardShouldBeHidden = [
    GameState.PLAYER_TURN,
    GameState.INSURANCE_BETTING,
    GameState.EVEN_MONEY_CHOICE,
  ].includes(gameState);

  if (cardShouldBeHidden && hand.length > 1 && hand[1]) {
    if (hand[1].rank === Rank.HIDDEN) return 0;
    return RANK_VALUES[hand[1].rank];
  }
  return calculateHandValue(hand).value;
};

const ResultArea: React.FC<
  Pick<TableUIProps, "gameResults" | "netRoundWinnings">
> = ({ gameResults, netRoundWinnings }) => {
  const mainResult = gameResults[0];
  if (mainResult === GameResult.PLAYER_BLACKJACK)
    return (
      <BlackjackResultDisplay isPlayer={true} netWinnings={netRoundWinnings} />
    );
  if (mainResult === GameResult.DEALER_BLACKJACK)
    return (
      <BlackjackResultDisplay isPlayer={false} netWinnings={netRoundWinnings} />
    );
  if (mainResult === GameResult.SURRENDER)
    return (
      <h2
        style={{
          fontSize: "2.25rem",
          fontWeight: "700",
          margin: "1rem 0",
          textAlign: "center",
          color: "#d1d5db",
        }}
      >
        You Surrendered
      </h2>
    );
  return <GameResultDisplay netWinnings={netRoundWinnings} />;
};

export const TableUI: React.FC<TableUIProps> = (props) => {
  const hideHoleCard = [
    GameState.PLAYER_TURN,
    GameState.INSURANCE_BETTING,
    GameState.EVEN_MONEY_CHOICE,
  ].includes(props.gameState);

  // Responsive dimensions
  const isSmallScreen =
    typeof window !== "undefined" && window.innerWidth < 640;
  const tableMinHeight = isSmallScreen ? "280px" : "380px";

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: tableMinHeight,
        justifyContent: "space-between",
      }}
    >
      {props.tableMessage && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 30,
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "700",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
        >
          {props.tableMessage}
        </div>
      )}
      <div>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "700",
            color: "white",
            marginBottom: "0.5rem",
            textAlign: "center",
            filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))",
          }}
        >
          Dealer - Score: {getDealerScore(props.dealerHand, props.gameState)}
        </h2>
        <Hand
          hand={props.dealerHand}
          isDealer={true}
          hideHoleCard={hideHoleCard}
          isPeeking={props.isPeeking}
        />
      </div>

      <div
        style={{
          textAlign: "center",
          height: "6rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {props.gameState === GameState.ROUND_OVER ? (
          <ResultArea
            gameResults={props.gameResults}
            netRoundWinnings={props.netRoundWinnings}
          />
        ) : (
          <BetDisplay totalBet={props.totalBet} isDealing={props.isDealing} />
        )}
      </div>
    </div>
  );
};
