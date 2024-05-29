import * as dotenv from 'dotenv';
import { getEnvVariable } from './utils';
import { CHAIN_ID, Client, ClientFactory, IAccount, IProvider, ProviderType } from '@massalabs/massa-web3';

dotenv.config();

const rpcURL: string = getEnvVariable("JSON_RPC_URL_PUBLIC");

export const scAddress: string = getEnvVariable("SC_ADDRESS");

export const ownerAddress: string = getEnvVariable("WALLET_ADDRESS");
const ownerPublicKey: string = getEnvVariable("WALLET_PUBLIC_KEY");
const ownerSecretKey: string = getEnvVariable("WALLET_SECRET_KEY");

const ownerBaseAccount: IAccount = {
  address: ownerAddress,
  publicKey: ownerPublicKey,
  secretKey: ownerSecretKey
} as IAccount;

const customProvider: Array<IProvider> = [
  {
    url: rpcURL,
    type: ProviderType.PUBLIC
  } as IProvider ];

export const ownerClient: Client = await ClientFactory.createCustomClient(
  customProvider,
  CHAIN_ID.MainNet,
  false,
  ownerBaseAccount
);
