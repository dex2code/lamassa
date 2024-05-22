import { Args, ICallData, MAX_GAS_CALL, fromMAS } from '@massalabs/massa-web3';
import { ownerClient, scAddress } from "./main";

export async function withdrawFunds(to: string, q: bigint): Promise<string> {
    const withdrawOP: string = await ownerClient.smartContracts().callSmartContract(
        {
            fee: fromMAS(0.1),
            maxGas: MAX_GAS_CALL,
            coins: fromMAS(0),
            targetAddress: scAddress,
            functionName: "withdrawFunds",
            parameter: new Args().addString(to).addU64(q).serialize()
        } as ICallData,
    );
    
    return withdrawOP.toString();
}
