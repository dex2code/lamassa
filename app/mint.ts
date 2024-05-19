import * as dotenv from 'dotenv';
import { getEnvVariable } from './utils';
import { Args, CHAIN_ID, Client, ClientFactory, DefaultProviderUrls, IAccount, ICallData, fromMAS } from '@massalabs/massa-web3';

dotenv.config();

const scAddress: string = getEnvVariable("SC_ADDRESS");

const walletAddress: string = getEnvVariable("TEST01_ADDRESS");
const walletPublicKey: string = getEnvVariable("TEST01_PUBLIC_KEY");
const walletSecretKey: string = getEnvVariable("TEST01_SECRET_KEY");

const mintPrice: bigint = fromMAS(30);


console.log("Interacting to SC: '" + scAddress + "'");
console.log("Using wallet: '" + walletAddress + "'");
console.log("Mint price: '" + mintPrice + "'");


const ownerBaseAccount: IAccount = {
    address: walletAddress,
    publicKey: walletPublicKey,
    secretKey: walletSecretKey
} as IAccount;

const ownerClient: Client = await ClientFactory.createDefaultClient(
    DefaultProviderUrls.BUILDNET,
    CHAIN_ID.BuildNet,
    false,
    ownerBaseAccount
);


const mintOP: string = await ownerClient.smartContracts().callSmartContract(
    {
        fee: fromMAS(0.01),
        maxGas: fromMAS(0.01),
        coins: mintPrice,
        targetAddress: scAddress,
        functionName: "mint",
        parameter: new Args().addString(walletAddress).serialize()
    } as ICallData,
);


console.log(
    "mintOP: '" + mintOP.toString() + "'"
);
