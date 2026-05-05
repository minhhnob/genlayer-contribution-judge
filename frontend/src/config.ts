type Network = 'localnet' | 'studionet' | 'testnet-bradbury' | string;

export const contractAddress = import.meta.env.VITE_GENLAYER_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
export const network: Network = import.meta.env.VITE_GENLAYER_NETWORK || 'studionet';

export function isConfigured(address = contractAddress): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address) && !/^0x0{40}$/.test(address);
}
