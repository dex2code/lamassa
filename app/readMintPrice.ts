import { IContractReadOperationResponse, IReadData, bytesToU64, fromMAS } from '@massalabs/massa-web3';
import { ownerClient, ownerAddress, scAddress } from "./main";


const currentMintPrice: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
    {
        maxGas: fromMAS(0.01),
        targetAddress: scAddress,
        targetFunction: "mintPrice",
        parameter: [],
        callerAddress: ownerAddress
    } as IReadData
);


console.log(
    "Current MINT price: '" + bytesToU64(currentMintPrice.returnValue) + "'"
);
