import React from 'react';
import { Card as CardType, Suit } from '../types';

interface CardProps {
  card: CardType;
  faceDown?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({ card, faceDown = false, className = '' }) => {
  const isRed = card.suit === Suit.Hearts || card.suit === Suit.Diamonds;
  const textColor = isRed ? 'text-red-600' : 'text-black';

  return (
    <div className={`w-24 h-36 card-flipper-container ${className}`}>
      <div className={`card-flipper ${faceDown ? '' : 'is-flipped'}`}>
        <div className="card-face">
          <div className="w-full h-full bg-blue-700 rounded-lg shadow-card border-4 border-white flex items-center justify-center">
            <div className="w-20 h-32 rounded-md bg-blue-800 border-2 border-blue-500"></div>
          </div>
        </div>
        <div className="card-face card-back">
          <div className={`w-full h-full bg-card-white rounded-lg shadow-card p-2 flex flex-col justify-between relative ${textColor}`}>
            <div className="text-2xl font-bold leading-none">{card.rank}</div>
            <div className="text-xl leading-none">{card.suit}</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl opacity-60">{card.suit}</div>
            <div className="text-2xl font-bold leading-none self-end rotate-180">{card.rank}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;