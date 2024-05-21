import { IContractReadOperationResponse, IReadData, bytesToStr, MAX_GAS_CALL } from '@massalabs/massa-web3';
import { ownerClient, ownerAddress, scAddress } from "./main";

const currentBaseURI: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
    {
        maxGas: MAX_GAS_CALL,
        targetAddress: scAddress,
        targetFunction: "baseURI",
        parameter: [],
        callerAddress: ownerAddress
    } as IReadData
);

console.log(
    "Current Base URI address: '" + bytesToStr(currentBaseURI.returnValue) + "'"
);
