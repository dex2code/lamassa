import { Args, ICallData, fromMAS } from '@massalabs/massa-web3';
import { ownerAddress, ownerClient, scAddress } from "./main";

export async function withdrawFunds(to: string, q: bigint): Promise<string> {
    console.log("Withdrawing " + q + "MAS to '" + to + "' address...");

    const withdrawOP: string = await ownerClient.smartContracts().callSmartContract(
        {
            fee: fromMAS(0.01),
            maxGas: fromMAS(0.01),
            coins: fromMAS(0),
            targetAddress: scAddress,
            functionName: "withdrawFunds",
            parameter: new Args().addString(to).addU64(q).serialize()
        } as ICallData,
    );
    
    return withdrawOP.toString();
}

const op: string = await withdrawFunds(ownerAddress, fromMAS(11));
console.log(op);