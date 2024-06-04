import { Args, ICallData, MAX_GAS_CALL, fromMAS } from '@massalabs/massa-web3';
import { ownerClient, scAddress } from "./main";

import { Console } from "console";
const localConsole = new Console(process.stdout, process.stderr);

const mintPrice = 50_000_000_000n;

const setMintPriceOp: string = await ownerClient.smartContracts().callSmartContract(
  {
    fee: fromMAS(0.1),
    maxGas: MAX_GAS_CALL,
    coins: fromMAS(505),
    targetAddress: scAddress,
    functionName: "setMintPrice",
    parameter: new Args().addU64(mintPrice).serialize()
  } as ICallData );

localConsole.log("setMintPrice OP: '" + setMintPriceOp.toString() + "'");
