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
      } else {
        setError(result.message || "Failed to update display name");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-orbitron text-cyan-400 mb-2">
          Display Name
        </h3>
        {localDisplayName ? (
          <p className="text-sm text-gray-400 mb-3">
            Current:{" "}
            <span className="text-white font-semibold">{localDisplayName}</span>
          </p>
        ) : (
          <p className="text-sm text-gray-400 mb-3">
            No display name set. Set one to appear in casino chat!
          </p>
        )}
      </div>

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
              Only letters, numbers, underscores (_), and hyphens (-) allowed
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
  );
};
