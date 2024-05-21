import { IContractReadOperationResponse, IReadData, bytesToU64, bytesToStr, MAX_GAS_CALL } from '@massalabs/massa-web3';
import { ownerClient, ownerAddress, scAddress } from "./main";


const currentLandlordAddress: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
    {
        maxGas: MAX_GAS_CALL,
        targetAddress: scAddress,
        targetFunction: "landlordAddress",
        parameter: [],
        callerAddress: ownerAddress
    } as IReadData
);

const currentLandlordFee: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
    {
        maxGas: MAX_GAS_CALL,
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
