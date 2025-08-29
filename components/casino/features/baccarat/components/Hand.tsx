import React from 'react';
import { Card as CardType } from '../types';
import Card from './Card';
import { usePrevious } from '../hooks/usePrevious';

interface HandProps {
  hand: CardType[];
  revealedStates: boolean[];
  isBanker?: boolean;
}

const Hand: React.FC<HandProps> = ({ hand, revealedStates, isBanker = false }) => {
  const prevHandLength = usePrevious(hand.length) ?? 0;

  return (
    <div className="h-40 flex items-center justify-center relative min-w-[200px]">
      {hand.map((card, index) => {
        const isNewCard = index >= prevHandLength;
        // Use different animations for player and banker, just like in blackjack
        const animationClass = isNewCard ? (isBanker ? 'animate-deal-dealer' : 'animate-deal-player') : 'opacity-100';

        return (
          <div
            key={`${index}-${card.suit}-${card.rank}`}
            className={`absolute transition-transform duration-300 ease-out ${isNewCard ? 'opacity-0' : ''} ${animationClass}`}
            style={{
              left: `calc(50% - 48px + ${index * 30}px)`,
              animationDelay: `${isNewCard ? 50 : 0}ms`,
              transform: `rotate(${index * 4 - (hand.length > 1 ? (hand.length - 1) * 2 : 0)}deg)`
            }}
          >
            <Card card={card} faceDown={!revealedStates[index]} />
          </div>
        );
      })}
      {hand.length === 0 && <div className="w-24 h-36 rounded-lg bg-black/20 border-2 border-dashed border-white/30"></div>}
    </div>
  );
};

export default Hand;