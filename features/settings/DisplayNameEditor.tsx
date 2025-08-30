import React, { useState, useEffect } from "react";
import { StyledButton } from "../../components/common/StyledButton";
import { apiService } from "../../services/apiService";
import type { PlayerState } from "../../types";

interface DisplayNameEditorProps {
  currentDisplayName?: string;
  onUpdate: (newPlayerState: PlayerState) => void;
}

export const DisplayNameEditor: React.FC<DisplayNameEditorProps> = ({
  currentDisplayName,
  onUpdate,
}) => {
  const [newDisplayName, setNewDisplayName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [localDisplayName, setLocalDisplayName] = useState(currentDisplayName);
  const [isExpanded, setIsExpanded] = useState(false);

  // Update local display name when prop changes
  useEffect(() => {
    setLocalDisplayName(currentDisplayName);
  }, [currentDisplayName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisplayName.trim()) return;

    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await apiService.updateDisplayName({
        displayName: newDisplayName.trim(),
      });

      if (result.success && result.newPlayerState) {
        // Update localStorage with the new player state
        localStorage.setItem(
          "playerData",
          JSON.stringify(result.newPlayerState)
        );

        // Update local state immediately
        setLocalDisplayName(result.newPlayerState.displayName);

        setSuccess("Display name updated successfully!");
        onUpdate(result.newPlayerState);
        setNewDisplayName("");
        setIsExpanded(false); // Collapse after successful update
      } else {
        setError(result.message || "Failed to update display name");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setError(null);
      setSuccess(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-orbitron text-cyan-400">
          Display Name:{" "}
          {localDisplayName ? (
            <span className="text-white font-semibold ml-2">
              {localDisplayName}
            </span>
          ) : (
            <span className="text-gray-500 font-normal ml-2">Not set</span>
          )}
        </h3>
        <button
          onClick={toggleExpanded}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label={
            isExpanded
              ? "Collapse display name editor"
              : "Expand display name editor"
          }
        >
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {!localDisplayName && (
        <p className="text-sm text-gray-400">
          Set a display name to appear in casino chat!
        </p>
      )}

      {isExpanded && (
        <div className="space-y-3 pt-2 border-t border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="Enter new display name (3-10 characters)"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                minLength={3}
                maxLength={10}
                pattern="[a-zA-Z0-9_-]+"
                title="Only letters, numbers, underscores, and hyphens allowed"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  Only letters, numbers, underscores (_), and hyphens (-)
                  allowed
                </p>
                <p
                  className={`text-xs ${
                    newDisplayName.length >= 3 && newDisplayName.length <= 10
                      ? "text-green-400"
                      : "text-gray-500"
                  }`}
                >
                  {newDisplayName.length}/10
                </p>
              </div>
            </div>

            <StyledButton
              type="submit"
              disabled={!newDisplayName.trim() || isUpdating}
              className="w-full"
            >
              {isUpdating ? "Updating..." : "Update Display Name"}
            </StyledButton>
          </form>

          {error && (
            <div className="p-3 bg-red-900/50 border border-red-600 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-900/50 border border-green-600 rounded-lg">
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
