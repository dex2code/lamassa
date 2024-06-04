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


const tokenStart    = 101;
const tokenFinish   = 200;
const winnersNumber = 10;
const rewardAmount  = fromMAS(0);


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
    "  ⚠   Current supply ("
    + currentSupply
    + ") is less than 'tokenFinish' ("
    + tokenFinish
    + ") value!\n");
  exit(1);
}

localConsole.log("  🤼  Tokens participating in this round: [ " + tokenStart + " ... " + tokenFinish + " ]");
for (let i = tokenStart; i <= tokenFinish; i++) tokenList.push(i);

const winnerList: number[] = _.sampleSize(tokenList, winnersNumber).sort();

localConsole.log();
localConsole.log();
localConsole.log("                      🏆  🏆  🏆    WINNERS   🏆  🏆  🏆");
localConsole.log("         ┌─────────────────────────────────────────────────────────────┐");
localConsole.log("         │                                                             │");
localConsole.log("         │  " + winnerList.toString().replaceAll(',', ' ◦ ')    +   "  │");
localConsole.log("         │                                                             │");
localConsole.log("         └─────────────────────────────────────────────────────────────┘");
localConsole.log();


for (let tokenNumber of winnerList) {
  try {
    let tokenOwner = await getTokenOwner(BigInt(tokenNumber));
    localConsole.log(" 🎟   NFT #" + tokenNumber + " owned by:\t" + tokenOwner);
    ownerList.push(tokenOwner);  
  } catch (err) {
    localConsole.error(" 🎟  NFT #" + tokenNumber + " does not have an owner!");
    exit(1);
  }
}

localConsole.log();

for (let ownerAddress of ownerList) {
  try {
    let bounce = BigInt(Math.floor(Math.random() * 1_000));
    let finalReward = rewardAmount + bounce;
    localConsole.log(" 💸  Sent " + toMAS(rewardAmount) + "MAS to: " + ownerAddress); 
    let opNumber = await withdrawFunds(ownerAddress, finalReward);
    localConsole.log("     Operation ID: " + opNumber);
    localConsole.log();
  } catch (err) {
    localConsole.error("Cannot send operation (" + err + ")");
    exit(1);
  }
}
