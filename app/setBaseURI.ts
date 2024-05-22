import { getEnvVariable } from "./utils";
import { Args, ICallData, MAX_GAS_CALL, fromMAS } from '@massalabs/massa-web3';
import { ownerClient, scAddress } from "./main";

const baseURI: string = getEnvVariable("BASE_URI");

const setBaseURI: string = await ownerClient.smartContracts().callSmartContract(
    {
        fee: fromMAS(0.1),
        maxGas: MAX_GAS_CALL,
        coins: fromMAS(0),
        targetAddress: scAddress,
        functionName: "setBaseURI",
        parameter: new Args().addString(baseURI).serialize()
    } as ICallData,
);

console.log("setBaseURI OP: '" + setBaseURI.toString() + "'");
