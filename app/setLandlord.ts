import { getEnvVariable } from "./utils";
import { Args, ICallData, MAX_GAS_CALL, fromMAS } from '@massalabs/massa-web3';
import { ownerClient, scAddress } from "./main";

const landlordAddress: string = getEnvVariable("LANDLORD_ADDRESS");
const landlordFee: bigint = BigInt(
    getEnvVariable("LANDLORD_FEE")
);

const setLandlordAddressOP: string = await ownerClient.smartContracts().callSmartContract(
    {
        fee: fromMAS(0.1),
        maxGas: MAX_GAS_CALL,
        coins: fromMAS(0),
        targetAddress: scAddress,
        functionName: "setLandlordAddress",
        parameter: new Args().addString(landlordAddress).serialize()
    } as ICallData,
);

const setLandlordFeeOP: string = await ownerClient.smartContracts().callSmartContract(
    {
        fee: fromMAS(0.1),
        maxGas: MAX_GAS_CALL,
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
