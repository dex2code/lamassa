import { IContractReadOperationResponse, IReadData, MAX_GAS_CALL, bytesToU64 } from '@massalabs/massa-web3';
import { ownerClient, ownerAddress, scAddress } from "./main";


const currentMintPrice: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
    {
        maxGas: MAX_GAS_CALL,
        targetAddress: scAddress,
        targetFunction: "mintPrice",
        parameter: [],
        callerAddress: ownerAddress
    } as IReadData
);


console.log(
    "Current MINT price: '" + bytesToU64(currentMintPrice.returnValue) + "'"
);
