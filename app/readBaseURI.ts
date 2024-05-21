import { IContractReadOperationResponse, IReadData, bytesToStr, fromMAS } from '@massalabs/massa-web3';
import { ownerClient, ownerAddress, scAddress } from "./main";

const currentBaseURI: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
    {
        maxGas: fromMAS(0.01),
        targetAddress: scAddress,
        targetFunction: "baseURI",
        parameter: [],
        callerAddress: ownerAddress
    } as IReadData
);

console.log(
    "Current Base URI address: '" + bytesToStr(currentBaseURI.returnValue) + "'"
);
