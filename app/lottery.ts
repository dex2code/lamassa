import _ from 'lodash';

import {
  Args, IReadData, IContractReadOperationResponse,
  fromMAS, toMAS, bytesToStr, MAX_GAS_CALL
} from '@massalabs/massa-web3';

import { ownerAddress, ownerClient, scAddress } from "./main";
import { withdrawFunds } from "./withdraw";
import { getCurrentSupply } from "./supply";
import { exit } from 'process';

import { Console } from "console";
const localConsole = new Console(process.stdout, process.stderr);

const debugMode = true;

const tokenStart    = 101;            // START TOKEN
const tokenFinish   = 150;            // FINISH TOKEN
const winnersNumber = 10;             // WINNERS NUMBER
const rewardAmount  = fromMAS(0);     // REWARD AMOUNT


let tokenList: number[] = [];
let ownerList: string[] = [];


async function getTokenOwner(tokenNumber: bigint): Promise<string> {
  const tokenOwner: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
    {
      maxGas: MAX_GAS_CALL,
      targetAddress: scAddress,
      targetFunction: "ownerOf",
      parameter: new Args().addU256(tokenNumber).serialize(),
      callerAddress: ownerAddress
    } as IReadData);

  return bytesToStr(tokenOwner.returnValue);
}

localConsole.clear();
localConsole.log();
localConsole.log();
localConsole.log("                 🌟 🌟 🌟   LAMAssa NFT GRAND LOTTERY 🌟 🌟 🌟");
localConsole.log("                ─────────────────────────────────────────────────");
localConsole.log();
localConsole.log("  🕑  Now: " + new Date().toUTCString());
localConsole.log("  📋  Interacting to SC: " + scAddress);
localConsole.log();


const currentSupply = await getCurrentSupply();
if (tokenFinish > currentSupply) {
  localConsole.error(
    " ⚠  Current supply ("
    + currentSupply
    + ") is less than 'tokenFinish' ("
    + tokenFinish
    + ") value!\n");
  exit(1);
}


localConsole.log("  🤼  Tokens participating in this round: [ " + tokenStart + " ... " + tokenFinish + " ]");
for (let i = tokenStart; i <= tokenFinish; i++) {
  tokenList.push(i);
}

const winnerList: number[] = _.sampleSize(tokenList, winnersNumber).sort();

localConsole.log();
localConsole.log("         ┌─────────────────────────────────────────────────────────────┐");
localConsole.log("         │                        Winners:                             │");
localConsole.log("         │                                                             │");
localConsole.log("         │  " + winnerList.toString().replaceAll(',', ' ◦ ')    +   "  │");
localConsole.log("         └─────────────────────────────────────────────────────────────┘");
localConsole.log();

if (winnerList.length) {

  winnerList.forEach(async function (tokenNumber) {
    await new Promise(f => setTimeout(f, 1_000));
    let tokenOwner = await getTokenOwner(BigInt(tokenNumber));
    if (!tokenOwner) {
      localConsole.error(" 🎟  NFT #" + tokenNumber + " does not have an owner!");
      exit(1);
    }
    
    localConsole.log(" 🎟   NFT #" + tokenNumber + " owned by:\t" + tokenOwner);
    ownerList.push(tokenOwner);
  });
  
  while (ownerList.length < winnersNumber) await new Promise(f => setTimeout(f, 1000));
  
  
  ownerList.forEach(async function (ownerAddress) {
    await new Promise(f => setTimeout(f, 1_000));
    let op = "";

    (debugMode) ?
      op = "AU12M3bAjCQWyBze2jDvnGPTx3JgSSy6uj3xZoxEHmE1a5tGzfbBD" :
      op = await withdrawFunds(ownerAddress, rewardAmount);

    localConsole.log(
      " 💸  Sent " + toMAS(rewardAmount) + "MAS to: " + ownerAddress + 
      "\n     Operation ID: " + op + "\n"
    );
  });

}

localConsole.log();
localConsole.log();