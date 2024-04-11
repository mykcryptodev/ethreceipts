import { createPublicClient, http, Chain, extractChain } from 'viem';
import { SupportedChainId, supportedChains, supportedChainNames } from '../types';

/** Get chain name in Alchemy format for API. */
function getAlchemyNetworkById(chainId: Number): string | null {
  return supportedChainNames[chainId as SupportedChainId] || null;
}

/** Get Viem chain from chain ID for Viem client creation. */
function getViemChainById(chainId: SupportedChainId): Chain {
  return extractChain({ chains: supportedChains, id: chainId });
}

/**
 * Create Viem client connected to chainID.
 * Uses private Alchemy API key.
 */
export function createViemClient(chainId: string) {
  const network = getAlchemyNetworkById(Number(chainId));
  if (!network) {
    throw new Error(`Invalid chainId: ${chainId}`);
  }
  const ALCHEMY_RPC_URL: string = `https://${network}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
  const chain: Chain = getViemChainById(Number(chainId) as SupportedChainId);

  // Create Viem client with correct chain and RPC.
  return createPublicClient({
    chain: chain,
    transport: http(ALCHEMY_RPC_URL),
    cacheTime: 3600,
  });
}
