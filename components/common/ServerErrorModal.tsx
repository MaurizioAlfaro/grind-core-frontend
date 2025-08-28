import React from "react";
import { StyledButton } from "./StyledButton";

interface ServerErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: string;
}

export const ServerErrorModal: React.FC<ServerErrorModalProps> = ({
  isOpen,
  onClose,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-md mx-4">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-4">
            Server Connection Issue
          </h2>
          <p className="text-gray-300 mb-6">
            We couldn't fetch the latest data from the server. You can continue
            playing with your local data, but some features may be limited.
          </p>

          {error && (
            <div className="bg-gray-700 p-3 rounded mb-4 text-left">
              <p className="text-sm text-gray-300 font-mono break-words">
                {error}
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <StyledButton
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue Playing
            </StyledButton>
            <StyledButton
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Retry Connection
            </StyledButton>
          </div>
        </div>
      </div>
    </div>
  );
};
