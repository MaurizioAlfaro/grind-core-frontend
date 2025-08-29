import React, { useState } from "react";
import { PREDEFINED_MESSAGES } from "../constants";

interface MessageSelectorProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  currentUserId?: string;
}

const BackArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const MessageSelector: React.FC<MessageSelectorProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const bubbleClasses =
    "px-4 py-2 rounded-full bg-gray-800/80 text-white text-sm font-semibold hover:bg-gray-700/80 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-900 disabled:text-gray-500 disabled:cursor-wait disabled:scale-100";

  const CategoryView = () => (
    <div className="flex flex-wrap justify-center gap-3 p-2">
      {Object.keys(PREDEFINED_MESSAGES).map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={bubbleClasses}
          aria-label={`Select category: ${category}`}
        >
          {category}
        </button>
      ))}
    </div>
  );

  const MessageView = () => {
    if (!selectedCategory) return null;
    const messages = PREDEFINED_MESSAGES[selectedCategory] || [];

    return (
      <div className="flex flex-col">
        <div className="flex-shrink-0 mb-3 px-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-1 text-yellow-300 font-bold hover:text-yellow-400 transition-colors"
            aria-label="Back to message categories"
          >
            <BackArrowIcon />
            Back to Categories
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-3 px-2">
          {messages.map((msg) => (
            <button
              key={msg}
              onClick={() => onSendMessage(msg)}
              disabled={isLoading}
              className={bubbleClasses}
            >
              {msg}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" key={selectedCategory || "categories"}>
      {selectedCategory ? <MessageView /> : <CategoryView />}
    </div>
  );
};

export default MessageSelector;
