import _ from 'lodash';
import { Args, IReadData, IContractReadOperationResponse, fromMAS, toMAS, bytesToStr, MAX_GAS_CALL } from '@massalabs/massa-web3';
import { ownerAddress, ownerClient, scAddress } from "./main";
import { withdrawFunds } from "./withdraw";
import { getCurrentSupply } from "./supply";
import { exit } from 'process';


async function getTokenOwner(tokenNumber: bigint): Promise<string> {
    const tokenOwner: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
        {
            maxGas: MAX_GAS_CALL,
            targetAddress: scAddress,
            targetFunction: "ownerOf",
            parameter: new Args().addU256(tokenNumber).serialize(),
            callerAddress: ownerAddress
        } as IReadData
    );

    return bytesToStr(tokenOwner.returnValue);
}


console.log("*** Now: " + new Date().toUTCString() + " ***\n");


const tokenStart = 0;       // START TOKEN
const tokenFinish = 0;    // FINISH TOKEN
const winnersNumber = 0;   // WINNERS NUMBER

const rewardAmount: bigint = fromMAS(150);


let tokenList: number[] = [];
let ownerList: string[] = []

const currentSupply = await getCurrentSupply();
if (tokenFinish > currentSupply) {
    console.error("Current supply (" + currentSupply + ") is less than 'tokenFinish' (" + tokenFinish + ") value. Exiting...");
    exit(1);
}

console.log("* Initial tokens participating in the lottery: '" + tokenStart + " ... " + tokenFinish + "'");
for (let i = tokenStart; i <= tokenFinish; i++) tokenList.push(i);

const winnerList: number[] = _.sampleSize(tokenList, winnersNumber);
console.log("* Calculated list of winner numbers: " + winnerList);
console.log();

winnerList.forEach(async function (tokenNumber) {
    let tokenOwner = await getTokenOwner(BigInt(tokenNumber));

    if (!tokenOwner) {
        console.error(
            "Token #" + tokenNumber + " does not have an owner!"
        );
        exit(1);
    }

    console.log("Token #" + tokenNumber + " has an owner: '" + tokenOwner + "'");
    ownerList.push(tokenOwner);
});

while (ownerList.length < winnersNumber) await new Promise(f => setTimeout(f, 1000));

console.log();

ownerList.forEach(async function (ownerAddress) {
    let op: string = await withdrawFunds(ownerAddress, rewardAmount);
    console.log("Sent " + toMAS(rewardAmount) + " MAS to: '" + ownerAddress + "'\n -> Operation ID: '" + op + "'\n");
});

console.log("\nCongrats to all winners!!! 🎉🎉🎉\n");
