import React, { useState, useEffect } from "react";
import { StyledButton } from "./StyledButton";

interface WalletAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (walletAddress: string) => void;
  walletAddress: string;
}

type AuthStep =
  | "requesting-nonce"
  | "signing-message"
  | "verifying"
  | "success"
  | "error";

export const WalletAuthModal: React.FC<WalletAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  walletAddress,
}) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>("requesting-nonce");
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startAuthFlow();
    }
  }, [isOpen]);

  const startAuthFlow = async () => {
    try {
      setCurrentStep("requesting-nonce");
      setError(null);

      // Step 1: Request nonce from backend
      const nonceResponse = await fetch(
        "http://localhost:5001/api/auth/nonce",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ walletAddress }),
        }
      );

      if (!nonceResponse.ok) {
        throw new Error("Failed to get nonce from server");
      }

      const nonceData = await nonceResponse.json();
      setNonce(nonceData.nonce);
      console.log("✅ Nonce received:", nonceData.nonce);

      // Step 2: Sign message with wallet
      setCurrentStep("signing-message");
      const provider = getProvider();
      if (!provider) {
        throw new Error("Wallet provider not found");
      }

      const messageBytes = new TextEncoder().encode(nonceData.nonce);
      const { signature } = await provider.signMessage(messageBytes);

      console.log("✅ Message signed successfully");
      console.log("🔐 Signature:", Array.from(signature));

      // Step 3: Verify signature with backend
      setCurrentStep("verifying");
      const authResponse = await fetch(
        "http://localhost:5001/api/auth/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress,
            signature: Array.from(signature),
            nonce: nonceData.nonce,
          }),
        }
      );

      if (!authResponse.ok) {
        throw new Error("Authentication failed");
      }

      const authData = await authResponse.json();
      console.log("✅ Authentication successful:", authData);

      // Step 4: Success
      setCurrentStep("success");

      // Store the JWT token
      localStorage.setItem("authToken", authData.token);
      localStorage.setItem("walletAddress", walletAddress);

      // Call success callback
      onSuccess(walletAddress);

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("Authentication failed:", err);
      setError(err.message || "Authentication failed");
      setCurrentStep("error");
    }
  };

  const getProvider = () => {
    if ("solana" in window) {
      const provider = (window as any).solana;
      if (provider && provider.isPhantom) {
        return provider;
      }
    }
    return undefined;
  };

  const getStepContent = () => {
    switch (currentStep) {
      case "requesting-nonce":
        return {
          title: "Requesting Authentication",
          description: "Getting a unique challenge from the server...",
          icon: "🔄",
        };
      case "signing-message":
        return {
          title: "Sign Message",
          description:
            "Please sign the message in your wallet to prove ownership...",
          icon: "✍️",
        };
      case "verifying":
        return {
          title: "Verifying Signature",
          description: "Checking your signature with the server...",
          icon: "🔍",
        };
      case "success":
        return {
          title: "Authentication Successful!",
          description: "Welcome to Grind Core!",
          icon: "✅",
        };
      case "error":
        return {
          title: "Authentication Failed",
          description: error || "Something went wrong",
          icon: "❌",
        };
    }
  };

  const stepContent = getStepContent();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-4xl mb-4">{stepContent.icon}</div>
          <h2 className="text-xl font-bold mb-2">{stepContent.title}</h2>
          <p className="text-gray-600 mb-6">{stepContent.description}</p>

          {currentStep === "requesting-nonce" && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          )}

          {currentStep === "signing-message" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Message to sign:</strong>
                <br />
                <code className="break-all">{nonce}</code>
              </p>
            </div>
          )}

          {currentStep === "verifying" && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          )}

          {currentStep === "error" && (
            <div className="mb-4">
              <StyledButton onClick={startAuthFlow} className="mr-2">
                Try Again
              </StyledButton>
              <StyledButton onClick={onClose} variant="secondary">
                Cancel
              </StyledButton>
            </div>
          )}

          {currentStep === "success" && (
            <div className="text-green-600 font-semibold">
              Redirecting to game...
            </div>
          )}

          {currentStep !== "success" && currentStep !== "error" && (
            <StyledButton onClick={onClose} variant="secondary">
              Cancel
            </StyledButton>
          )}
        </div>
      </div>
    </div>
  );
};
