export const signMessage = async (message: string, wallet: any): Promise<string> => {
  if (!wallet) {
    throw new Error("No wallet found");
  }

  const connector = wallet?.connector;

  if (!connector) {
    throw new Error("No connector found");
  }

  return await connector.signMessage(message);
};
