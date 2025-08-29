
import React from 'react';
import Hand from './Hand';
import BetDisplay from './BetDisplay';
import { BlackjackResultDisplay, GameResultDisplay } from './ResultDisplays';
import { GameState, Card, GameResult, Rank } from '../types';
import { calculateHandValue } from '../utils/hand';
import { RANK_VALUES } from '../constants';

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
        GameState.EVEN_MONEY_CHOICE
    ].includes(gameState);

    if (cardShouldBeHidden && hand.length > 1 && hand[1]) {
        if(hand[1].rank === Rank.HIDDEN) return 0;
        return RANK_VALUES[hand[1].rank];
    }
    return calculateHandValue(hand).value;
}

const ResultArea: React.FC<Pick<TableUIProps, 'gameResults' | 'netRoundWinnings'>> = ({ gameResults, netRoundWinnings }) => {
    const mainResult = gameResults[0];
    if (mainResult === GameResult.PLAYER_BLACKJACK) return <BlackjackResultDisplay isPlayer={true} netWinnings={netRoundWinnings} />;
    if (mainResult === GameResult.DEALER_BLACKJACK) return <BlackjackResultDisplay isPlayer={false} netWinnings={netRoundWinnings} />;
    if (mainResult === GameResult.SURRENDER) return <h2 className="text-4xl font-bold my-4 text-center text-gray-300">You Surrendered</h2>;
    return <GameResultDisplay netWinnings={netRoundWinnings} />;
}


export const TableUI: React.FC<TableUIProps> = (props) => {
  const hideHoleCard = [
    GameState.PLAYER_TURN, 
    GameState.INSURANCE_BETTING, 
    GameState.EVEN_MONEY_CHOICE
  ].includes(props.gameState);

  return (
    <div className="relative flex flex-col min-h-[280px] sm:min-h-[380px] justify-between">
       {props.tableMessage && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black/70 text-white text-2xl font-bold px-6 py-3 rounded-lg animate-fade-out shadow-lg">
                {props.tableMessage}
            </div>
        )}
      <div>
        <h2 className="text-xl font-bold text-white mb-2 text-center drop-shadow-lg">
          Dealer - Score: {getDealerScore(props.dealerHand, props.gameState)}
        </h2>
        <Hand hand={props.dealerHand} isDealer={true} hideHoleCard={hideHoleCard} isPeeking={props.isPeeking} />
      </div>

      <div className="text-center h-24 flex flex-col justify-center items-center">
        {props.gameState === GameState.ROUND_OVER ? (
          <ResultArea gameResults={props.gameResults} netRoundWinnings={props.netRoundWinnings} />
        ) : (
          <BetDisplay totalBet={props.totalBet} isDealing={props.isDealing} />
        )}
      </div>
    </div>
  );
};