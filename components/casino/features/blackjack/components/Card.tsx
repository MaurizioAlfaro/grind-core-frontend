import React from "react";
import { Card as CardType, Suit } from "../types";

interface CardProps {
  card: CardType;
  faceDown?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  card,
  faceDown = false,
  className = "",
}) => {
  const isRed = card.suit === Suit.Hearts || card.suit === Suit.Diamonds;
  const textColor = isRed ? "#d9534f" : "#000000";

  // Responsive dimensions
  const isSmallScreen =
    typeof window !== "undefined" && window.innerWidth < 640;
  const cardWidth = isSmallScreen ? "4rem" : "4.375rem";
  const cardHeight = isSmallScreen ? "6rem" : "6.5625rem";

  if (faceDown) {
    return (
      <div
        style={{
          width: cardWidth,
          height: cardHeight,
          background: "linear-gradient(45deg, #9333ea, #7c3aed)",
          border: "2px solid #9333ea",
          borderRadius: "8px",
          display: "inline-block",
          margin: "0 0.25rem",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          position: "relative",
        }}
      ></div>
    );
  }

  return (
    <div
      style={{
        width: cardWidth,
        height: cardHeight,
        background: "#f8f8f8",
        border: "2px solid #374151",
        borderRadius: "8px",
        display: "inline-block",
        margin: "0 0.25rem",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0.25rem",
          left: "0.25rem",
          fontSize: "0.875rem",
          fontWeight: "700",
          color: textColor,
        }}
      >
        {card.rank}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "0.25rem",
          right: "0.25rem",
          fontSize: "1.25rem",
          color: textColor,
        }}
      >
        {card.suit}
      </div>
    </div>
  );
};

export default Card;
