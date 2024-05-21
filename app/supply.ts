import { IContractReadOperationResponse, IReadData, fromMAS, bytesToU256 } from '@massalabs/massa-web3';
import { scAddress, ownerAddress, ownerClient } from "./main"


export async function getCurrentSupply(): Promise<bigint> {    
    const currentSupply: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
        {
            maxGas: fromMAS(0.01),
            targetAddress: scAddress,
            targetFunction: "currentSupply",
            parameter: [],
            callerAddress: ownerAddress
        } as IReadData
    );

    return bytesToU256(currentSupply.returnValue);
}

export async function getMaxSupply(): Promise<bigint> {    
    const maxSupply: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
        {
            maxGas: fromMAS(0.01),
            targetAddress: scAddress,
            targetFunction: "maxSupply",
            parameter: [],
            callerAddress: ownerAddress
        } as IReadData
    );

    return bytesToU256(maxSupply.returnValue)
}


console.log(
    "maxSupply: '" + await getMaxSupply() + "'" + "\n" +
    "currentSupply: '" + await getCurrentSupply() + "'"
);
