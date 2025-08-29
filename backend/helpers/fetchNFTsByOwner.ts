// local import of the connection wrapper, to help with using the ReadApi
import { WrapperConnection } from "./WrapperConnection";

// imports from other libraries
import { PublicKey, clusterApiUrl } from "@solana/web3.js";

import dotenv from "dotenv";
dotenv.config();

// Interface for Reptilianz NFT data
export interface ReptilianzNFT {
  name: string;
  tokenNumber: number | null;
  json_uri: string | null;
  image: string | null;
  assetId: string;
  error?: string;
}

/**
 * Fetches all Reptilianz NFTs owned by a specific wallet address
 * @param walletAddress - The wallet address to check (string or PublicKey)
 * @returns Promise<ReptilianzNFT[]> - Array of Reptilianz NFTs with metadata
 */
export async function fetchReptilianzNFTsByOwner(
  walletAddress: string | PublicKey
): Promise<ReptilianzNFT[]> {
  const CLUSTER_URL = clusterApiUrl("mainnet-beta");
  const connection = new WrapperConnection(CLUSTER_URL);

  // Parse wallet address to PublicKey
  let publicKey: PublicKey;
  try {
    publicKey =
      typeof walletAddress === "string"
        ? new PublicKey(walletAddress)
        : walletAddress;
  } catch (error) {
    throw new Error(`Invalid wallet address: ${error.message}`);
  }

  const reptilianz: ReptilianzNFT[] = [];

  try {
    const res = await connection.getAssetsByOwner({
      ownerAddress: publicKey.toString(),
      sortBy: {
        sortBy: "recent_action",
        sortDirection: "asc",
      },
    });

    console.log(
      `Found ${
        res.items?.length || 0
      } total assets for wallet: ${publicKey.toString()}`
    );

    // search for NFTs from the same tree (Reptilianz collection)
    const reptilianzAssets =
      res.items?.filter(
        (asset) =>
          asset.compression.tree ===
          "REPZm4pfBGRytFkcz4fkrcgdch4PJrPYAC747SFR3mn"
      ) || [];

    console.log(`Found ${reptilianzAssets.length} Reptilianz NFTs`);

    // Process each asset sequentially to avoid rate limiting
    for (const asset of reptilianzAssets) {
      try {
        console.log("Processing assetId:", asset.id);
        const assetInfo = await connection.getAsset(new PublicKey(asset.id));

        // Extract data with fallbacks
        const name = assetInfo.content.metadata.name || "Unknown NFT";
        const json_uri = assetInfo.content.json_uri || null;
        const image =
          (assetInfo.content as any).links?.image ||
          (assetInfo.content.metadata as any)?.image ||
          null;

        // Extract token number from name (e.g., "Reptilianz #620" -> 620)
        let tokenNumber: number | null = null;
        if (name && name.includes("#")) {
          const match = name.match(/#(\d+)/);
          if (match) {
            tokenNumber = parseInt(match[1], 10);
          }
        }

        console.log("Extracted:", { name, tokenNumber, json_uri, image });

        reptilianz.push({
          name,
          tokenNumber,
          json_uri,
          image,
          assetId: asset.id,
        });
      } catch (error) {
        console.error(`Error processing asset ${asset.id}:`, error);
        reptilianz.push({
          name: "Error Processing NFT",
          tokenNumber: null,
          json_uri: null,
          image: null,
          assetId: asset.id,
          error: error.message,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }

  return reptilianz;
}

// Example usage and testing
if (require.main === module) {
  (async () => {
    try {
      const testWallet = "HLHy1kKma6pnoCc9u2WiES4kmRunY12wRKwK42d4uW6w";
      console.log(`Testing with wallet: ${testWallet}`);

      const result = await fetchReptilianzNFTsByOwner(testWallet);
      console.log("REPZ Result:", JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("Test failed:", error);
    }
  })();
}
