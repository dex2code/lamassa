import _ from 'lodash';
import { Args, IReadData, IContractReadOperationResponse, fromMAS, toMAS, bytesToStr } from '@massalabs/massa-web3';
import { ownerAddress, ownerClient, scAddress } from "./main";
import { withdrawFunds } from "./withdraw";
import { getCurrentSupply } from "./supply";
import { exit } from 'process';


async function getTokenOwner(tokenNumber: bigint): Promise<string> {
    const tokenOwner: IContractReadOperationResponse = await ownerClient.smartContracts().readSmartContract(
        {
            maxGas: fromMAS(0.01),
            targetAddress: scAddress,
            targetFunction: "ownerOf",
            parameter: new Args().addU256(tokenNumber).serialize(),
            callerAddress: ownerAddress
        } as IReadData
    );

    return bytesToStr(tokenOwner.returnValue);
}


console.log("\n*** Now: " + new Date().toUTCString() + " ***\n");


const tokenStart = 1;       // START TOKEN
const tokenFinish = 100;    // FINISH TOKEN
const winnersNumber = 10;   // WINNERS NUMBER

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

    console.log("Token #" + tokenNumber + " has an owner '" + tokenOwner + "'");
    ownerList.push(tokenOwner);
});

while (ownerList.length < winnersNumber) await new Promise(f => setTimeout(f, 1000));

console.log("\n* Final list of winner addresses:");
console.log(ownerList);
console.log();

ownerList.forEach(async function (ownerAddress) {
    let op: string = await withdrawFunds(ownerAddress, rewardAmount);
    console.log("Sent " + toMAS(rewardAmount) + " MAS to address: '" + ownerAddress + "' with operation: '" + op + "'");
});

console.log("\nCongrats to all winners!!! 🎉🎉🎉\n");
