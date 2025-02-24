import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY, 
    network: Network.ETH_MAINNET, 
}

const alchemy = new Alchemy(settings);

export default alchemy;