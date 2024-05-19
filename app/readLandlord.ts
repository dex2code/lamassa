import * as dotenv from 'dotenv';
import { getEnvVariable } from './utils';
import { CHAIN_ID, Client, ClientFactory, DefaultProviderUrls, IAccount, IContractReadOperationResponse, IReadData, bytesToU64, bytesToStr, fromMAS, IProvider, ProviderType } from '@massalabs/massa-web3';

dotenv.config();

const rpcURL: string = getEnvVariable("JSON_RPC_URL_PUBLIC");

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

const customProvider: Array<IProvider> = [
    {
        url: rpcURL,
        type: ProviderType.PUBLIC
    } as IProvider
];

const ownerClient: Client = await ClientFactory.createCustomClient(
    customProvider,
    CHAIN_ID.MainNet,
    false,
    ownerBaseAccount
);


const currentLandlordAddress: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
    {
        maxGas: fromMAS(0.01),
        targetAddress: scAddress,
        targetFunction: "landlordAddress",
        parameter: [],
        callerAddress: ownerAddress
    } as IReadData
);

const currentLandlordFee: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
    {
        maxGas: fromMAS(0.01),
        targetAddress: scAddress,
        targetFunction: "landlordFee",
        parameter: [],
        callerAddress: ownerAddress
    } as IReadData
);

console.log(
    "Current landlord address: '" + bytesToStr(currentLandlordAddress.returnValue) + "'" + "\n" +
    "Current landlord fee: '" + bytesToU64(currentLandlordFee.returnValue) + "'"
);
