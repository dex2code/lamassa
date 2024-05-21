import { IContractReadOperationResponse, IReadData, bytesToU64, bytesToStr, fromMAS } from '@massalabs/massa-web3';
import { ownerClient, ownerAddress, scAddress } from "./main";


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
