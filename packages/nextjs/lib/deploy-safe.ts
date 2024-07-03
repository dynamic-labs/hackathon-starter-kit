import { SafeFactory } from "@safe-global/protocol-kit";
import { SafeAccountConfig } from "@safe-global/protocol-kit";

interface SafeDeploymentParams {
  provider: string; // Assuming provider is a URL string
  signer: string; // Assuming signer is a private key string
  userAddress: string; // Assuming userAddress is an Ethereum address string
}

export async function deploySafe({ provider, signer, userAddress }: SafeDeploymentParams): Promise<string> {
  console.log("Deploying Safe...");
  try {
    // Initialize SafeFactory with the provided provider and signer
    const safeFactory = await SafeFactory.init({
      provider: provider,
      signer: signer,
      safeVersion: "1.4.1",
    });
    console.log("SafeFactory initialized", safeFactory);

    // Define SafeAccountConfig for the deployment
    const safeAccountConfig: SafeAccountConfig = {
      owners: [userAddress],
      threshold: 1,
      // Optional parameters can be added here if needed
    };

    // Deploy Safe using SafeFactory
    const protocolKitOwner1 = await safeFactory.deploySafe({ safeAccountConfig });

    // Retrieve the deployed Safe address
    const safeAddress = await protocolKitOwner1.getAddress();

    // Output deployment information
    console.log("Your Safe has been deployed:");

    // Return the deployed Safe address or any other necessary information
    return safeAddress;
  } catch (error) {
    // Handle any errors that occur during deployment
    console.error("Error deploying Safe:", error);
    throw error; // Re-throwing the error for higher-level error handling
  }
}
