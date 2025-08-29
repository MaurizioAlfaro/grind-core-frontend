import React from "react";
import { ChatMessage } from "../types";

const Message: React.FC<{ message: ChatMessage; currentPlayerId?: string }> = ({
  message,
  currentPlayerId,
}) => {
  const isCurrentUser = currentPlayerId && message.userId === currentPlayerId;
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-start gap-3 ${
        isCurrentUser ? "flex-row-reverse" : ""
      }`}
    >
      <img
        src={message.avatar}
        alt={message.username}
        className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400/50"
      />
      <div
        className={`flex flex-col ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`p-3 rounded-xl max-w-xs md:max-w-md ${
            isCurrentUser
              ? "bg-blue-600 rounded-br-none"
              : "bg-gray-700 rounded-bl-none"
          }`}
        >
          <p className="text-white text-sm">{message.text}</p>
        </div>
        <div className="flex items-center gap-2 mt-1 px-1">
          <span className="text-xs font-bold text-gray-300">
            {message.username}
          </span>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default Message;
