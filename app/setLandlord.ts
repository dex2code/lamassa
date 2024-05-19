import * as dotenv from 'dotenv';
import { getEnvVariable } from './utils';
import { Args, CHAIN_ID, Client, ClientFactory, IAccount, ICallData, fromMAS, IProvider, ProviderType } from '@massalabs/massa-web3';

dotenv.config();

const rpcURL: string = getEnvVariable("JSON_RPC_URL_PUBLIC");

const scAddress: string = getEnvVariable("SC_ADDRESS");

const ownerAddress: string = getEnvVariable("WALLET_ADDRESS");
const ownerPublicKey: string = getEnvVariable("WALLET_PUBLIC_KEY");
const ownerSecretKey: string = getEnvVariable("WALLET_SECRET_KEY");

const landlordAddress: string = getEnvVariable("LANDLORD_ADDRESS");
const landlordFee: bigint = BigInt(
    getEnvVariable("LANDLORD_FEE")
);

console.log("Using wallet: '" + ownerAddress + "'");
console.log("Interacting to SC: '" + scAddress + "'");
console.log();

console.log("landlordAddress -> '" + landlordAddress + "'");
console.log("landlordFee -> '" + landlordFee + "'");
console.log();

const ownerBaseAccount: IAccount = {
    address: ownerAddress,
    publicKey: ownerPublicKey,
    secretKey: ownerSecretKey,
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
    true,
    ownerBaseAccount
);


const setLandlordAddressOP: string = await ownerClient.smartContracts().callSmartContract(
    {
        fee: fromMAS(0.01),
        maxGas: fromMAS(0.01),
        coins: fromMAS(0),
        targetAddress: scAddress,
        functionName: "setLandlordAddress",
        parameter: new Args().addString(landlordAddress).serialize()
    } as ICallData,
);

const setLandlordFeeOP: string = await ownerClient.smartContracts().callSmartContract(
    {
        fee: fromMAS(0.01),
        maxGas: fromMAS(0.01),
        coins: fromMAS(0),
        targetAddress: scAddress,
        functionName: "setLandlordFee",
        parameter: new Args().addU64(landlordFee).serialize()
    } as ICallData,
);

console.log(
    "setLandlordAddressOP: '" + setLandlordAddressOP.toString() + "'\n" +
    "setLandlordFeeOP: '" + setLandlordFeeOP.toString() + "'"
);
