import * as dotenv from 'dotenv';
import { getEnvVariable } from './utils';
import { CHAIN_ID, Client, ClientFactory, DefaultProviderUrls, IAccount, IContractReadOperationResponse, IReadData, bytesToU64, bytesToStr, fromMAS, bytesToU256 } from '@massalabs/massa-web3';

dotenv.config();

const scAddress: string = getEnvVariable("SC_ADDRESS");

const ownerAddress: string = getEnvVariable("WALLET_ADDRESS");
const ownerPublicKey: string = getEnvVariable("WALLET_PUBLIC_KEY");
const ownerSecretKey: string = getEnvVariable("WALLET_SECRET_KEY");

console.log("Using wallet: " + ownerAddress);
console.log("Interacting to SC: " + scAddress);
console.log();

const ownerBaseAccount: IAccount = {
    address: ownerAddress,
    publicKey: ownerPublicKey,
    secretKey: ownerSecretKey
} as IAccount;

const ownerClient: Client = await ClientFactory.createDefaultClient(
    DefaultProviderUrls.BUILDNET,
    CHAIN_ID.BuildNet,
    false,
    ownerBaseAccount
);

const maxSupply: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
    {
        maxGas: fromMAS(0.01),
        targetAddress: scAddress,
        targetFunction: "maxSupply",
        parameter: [],
        callerAddress: ownerAddress
    } as IReadData
);

const currentSupply: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
    {
        maxGas: 3_000_000n,
        targetAddress: scAddress,
        targetFunction: "currentSupply",
        parameter: [],
        callerAddress: ownerAddress
    } as IReadData
);


console.log(
    "maxSupply: '" + bytesToU256(maxSupply.returnValue) + "'" + "\n" +
    "currentSupply: '" + bytesToU256(currentSupply.returnValue) + "'"
);
