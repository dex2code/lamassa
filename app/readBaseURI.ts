import { IContractReadOperationResponse, IReadData, bytesToStr, MAX_GAS_CALL } from '@massalabs/massa-web3';
import { ownerClient, ownerAddress, scAddress } from "./main";

import { Console } from "console";
const localConsole = new Console(process.stdout, process.stderr);

const currentBaseURI: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
  {
    maxGas: MAX_GAS_CALL,
    targetAddress: scAddress,
    targetFunction: "baseURI",
    parameter: [],
    callerAddress: ownerAddress
  } as IReadData );

localConsole.log(
  "Current Base URI address: '" + bytesToStr(currentBaseURI.returnValue) + "'"
);
