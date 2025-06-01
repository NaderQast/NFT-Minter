export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  // Scroll Sepolia (chainId: 534351)
  534351: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_Scroll as `0x${string}`,

  // Ethereum Sepolia (chainId: 11155111)
  11155111: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_Sepolia as `0x${string}`,
};
