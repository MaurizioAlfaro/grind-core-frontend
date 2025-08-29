import React from "react";
import Chip from "./Chip";
import { getChipsForBet } from "../utils/betting";

interface BetDisplayProps {
  totalBet: number;
  isDealing: boolean;
}

const BetDisplay: React.FC<BetDisplayProps> = ({ totalBet, isDealing }) => {
  const betChips = getChipsForBet(totalBet);

  return (
    <div
      style={{
        position: "relative",
        width: "12rem",
        height: "6rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          height: "5rem",
          border: "4px dashed rgba(255, 255, 255, 0.2)",
          borderRadius: "9999px",
        }}
      ></div>
      {betChips.map((chipValue, index) => (
        <div
          key={index}
          style={{
            transform: `translateY(-${index * 8}px)`,
          }}
        >
          <Chip
            value={chipValue}
            onClick={() => {}}
            disabled={true}
            size="small"
          />
        </div>
      ))}
      {totalBet > 0 && !isDealing && (
        <div
          style={{
            position: "absolute",
            bottom: "-1.5rem",
            background: "rgba(0, 0, 0, 0.5)",
            color: "#facc15",
            fontWeight: "700",
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "1.125rem",
          }}
        >
          ${totalBet}
        </div>
      )}
    </div>
  );
};

export default BetDisplay;
