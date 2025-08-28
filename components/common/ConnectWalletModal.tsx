import React, { useState } from "react";
import { StyledButton } from "./StyledButton";
import { PhantomIcon } from "../../features/navigation/icons/PhantomIcon";
import { useWallet } from "../../hooks/useWallet";

interface ConnectWalletModalProps {
  onConnect: () => void;
  onClose: () => void;
}

const Benefit: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="flex items-start gap-4 text-left">
    <div className="flex-shrink-0 w-12 h-12 bg-gray-900/50 rounded-lg flex items-center justify-center text-2xl text-cyan-400">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-white">{title}</h4>
      <p className="text-sm text-gray-400">{children}</p>
    </div>
  </div>
);

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  onConnect,
  onClose,
}) => {
  const {
    provider,
    publicKey,
    isConnected,
    isConnecting,
    isWalletAvailable,
    walletName,
    error,
    connectWallet,
    disconnectWallet,
    signMessage,
    installWallet,
    clearError,
  } = useWallet();

  const [isSigning, setIsSigning] = useState(false);
  const [signatureResult, setSignatureResult] = useState<any>(null);

  const handleConnect = async () => {
    if (!isWalletAvailable) {
      installWallet();
      return;
    }

    if (!isConnected) {
      await connectWallet();
    } else {
      // Wallet is connected, now sign a message
      await handleSignMessage();
    }
  };

  const handleSignMessage = async () => {
    if (!isConnected) return;

    setIsSigning(true);
    clearError();

    try {
      const message = "Sign this message to authenticate with Grind Core";
      const result = await signMessage(message);
      setSignatureResult(result);

      // Call the onConnect callback with the signature result
      onConnect();
    } catch (err: any) {
      console.error("Message signing failed:", err);
    } finally {
      setIsSigning(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setSignatureResult(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border-2 border-purple-500/80 shadow-2xl shadow-purple-500/20 w-full max-w-lg animate-fade-in-up">
        <div className="p-8 text-center">
          <img
            src="/assets/images/misc/reptilianz_nft.png"
            alt="Reptilianz NFT"
            className="w-32 h-32 mx-auto rounded-full border-4 border-purple-500 mb-4"
          />
          <h2 className="text-3xl font-orbitron font-bold text-purple-400 mb-2">
            Secure Your Progress
          </h2>
          <p className="text-gray-300 mb-8">
            Connect your Solana wallet to enable cloud saves and unlock
            exclusive bonuses for Reptilianz NFT holders.
          </p>

          <div className="space-y-6 mb-8">
            <Benefit icon="☁️" title="Cloud Save & Sync">
              Link your wallet to save your progress securely. Play on any
              device, anywhere, without losing a second of your grind.
            </Benefit>
            <Benefit icon="👑" title="Reptilianz Holder Bonuses">
              As a verified owner of a Reptilianz NFT, you are entitled to
              exclusive, permanent bonuses:
              <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                <li>
                  <span className="font-bold text-green-400">100% more XP</span>{" "}
                  from all sources.
                </li>
                <li>
                  <span className="font-bold text-yellow-400">
                    100% more Gold
                  </span>{" "}
                  from all sources.
                </li>
                <li>
                  <span className="font-bold text-blue-400">
                    50% more Item Drop Chance
                  </span>
                  .
                </li>
              </ul>
            </Benefit>
          </div>

          <div className="space-y-3">
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                {error}
                <button
                  onClick={clearError}
                  className="ml-2 text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            )}

            {!isWalletAvailable ? (
              <StyledButton
                onClick={handleConnect}
                variant="primary"
                className="w-full !bg-blue-600 hover:!bg-blue-700"
              >
                Install Solana Wallet
              </StyledButton>
            ) : !isConnected ? (
              <StyledButton
                onClick={handleConnect}
                variant="primary"
                className="w-full !bg-purple-600 hover:!bg-purple-700 !shadow-purple-500/30"
                disabled={isConnecting}
              >
                <div className="flex items-center justify-center gap-2">
                  <PhantomIcon />
                  <span>
                    {isConnecting
                      ? "Connecting..."
                      : `Connect ${walletName || "Wallet"}`}
                  </span>
                </div>
              </StyledButton>
            ) : (
              <div className="space-y-3">
                <div className="bg-green-900/50 border border-green-500/50 rounded-lg p-3 text-green-300 text-sm">
                  ✅ Connected: {publicKey?.toString().slice(0, 8)}...
                  {publicKey?.toString().slice(-8)}
                </div>

                {!signatureResult ? (
                  <StyledButton
                    onClick={handleSignMessage}
                    variant="primary"
                    className="w-full !bg-green-600 hover:!bg-green-700"
                    disabled={isSigning}
                  >
                    <span>
                      {isSigning
                        ? "Signing Message..."
                        : "Sign Message to Authenticate"}
                    </span>
                  </StyledButton>
                ) : (
                  <div className="bg-green-900/50 border border-green-500/50 rounded-lg p-3 text-green-300 text-sm">
                    ✅ Message signed successfully! Authentication complete.
                  </div>
                )}

                <StyledButton
                  onClick={handleDisconnect}
                  variant="secondary"
                  className="w-full"
                >
                  Disconnect Wallet
                </StyledButton>
              </div>
            )}

            <StyledButton
              onClick={onClose}
              variant="secondary"
              className="w-full"
            >
              {isConnected ? "Close" : "Maybe Later"}
            </StyledButton>
          </div>
        </div>
      </div>
    </div>
  );
};
