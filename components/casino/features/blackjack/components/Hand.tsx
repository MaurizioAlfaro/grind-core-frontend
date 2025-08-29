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

  // Responsive dimensions
  const isSmallScreen =
    typeof window !== "undefined" && window.innerWidth < 640;
  const handHeight = isSmallScreen ? "10rem" : "10rem";
  const emptyCardWidth = isSmallScreen ? "6rem" : "6rem";
  const emptyCardHeight = isSmallScreen ? "9rem" : "9rem";

  return (
    <div
      style={{
        height: handHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        minWidth: "200px",
      }}
    >
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
        <div
          style={{
            width: emptyCardWidth,
            height: emptyCardHeight,
            borderRadius: "0.5rem",
            background: "rgba(0, 0, 0, 0.2)",
            border: "2px dashed rgba(255, 255, 255, 0.3)",
          }}
        ></div>
      )}
    </div>
  );
};

export default Hand;
