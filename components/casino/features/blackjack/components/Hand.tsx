import React from "react";
import { Card as CardType } from "../types";
import Card from "./Card";
import { usePrevious } from "../hooks/usePrevious";

interface HandProps {
  hand: CardType[];
  isDealer?: boolean;
  hideHoleCard?: boolean;
  isPeeking?: boolean;
}

const Hand: React.FC<HandProps> = ({
  hand,
  isDealer = false,
  hideHoleCard = false,
  isPeeking = false,
}) => {
  const isHoleCardHidden = isDealer && hideHoleCard;
  const prevHandLength = usePrevious(hand.length) ?? 0;

  return (
    <div className="h-40 flex items-center justify-center relative min-w-[200px]">
      {hand.map((card, index) => {
        const isNewCard = index >= prevHandLength;
        const animationClass = isNewCard
          ? isDealer
            ? "animate-deal-dealer"
            : "animate-deal-player"
          : "opacity-100";

        const isHoleCard = isDealer && index === 0;
        const peekAnimationClass =
          isHoleCard && isPeeking ? "animate-peek" : "";

        return (
          <div
            key={`${index}-${card.suit}-${card.rank}`}
            className={`absolute transition-transform duration-300 ease-out ${
              isNewCard ? "opacity-0" : ""
            } ${animationClass} ${peekAnimationClass}`}
            style={{
              left: `calc(50% - 48px + ${index * 30}px)`,
              animationDelay: `${isNewCard ? index * 150 : 0}ms`,
              transform: `rotate(${
                index * 4 - (hand.length > 1 ? (hand.length - 1) * 2 : 0)
              }deg)`,
            }}
          >
            <Card
              card={card}
              faceDown={isDealer && index === 0 && isHoleCardHidden}
            />
          </div>
        );
      })}
      {hand.length === 0 && (
        <div className="w-24 h-36 rounded-lg bg-black/20 border-2 border-dashed border-white/30"></div>
      )}
    </div>
  );
};

export default Hand;
