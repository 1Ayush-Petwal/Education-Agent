import { Action, ActionExample, Handler, Validator } from '@elizaos/core';

export const MintRoomAction: Action = {
    name: "mint_room",
    similes: [
        "like creating a new room key",
        "similar to activating a hotel room",
        "comparable to registering a new room"
    ],
    description: "Mint a new hotel room NFT from an existing collection",
    examples: [
        [
            {
                role: "user",
                content: "Mint 2 rooms from Luxury Suites collection"
            },
            {
                role: "assistant",
                content: "I'll help you mint 2 new rooms from the Luxury Suites collection. Please confirm the transaction when prompted."
            }
        ]
    ],
    handler: async (context, params) => {
        try {
            const result = await context.moduleClient.submitTransaction({
                function: "launchpad::mint_nft",
                arguments: [params.collectionObjectId, params.amount]
            });
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    validate: (params) => {
        if (!params.collectionObjectId || !params.amount || params.amount <= 0) {
            return { isValid: false, error: "Invalid parameters" };
        }
        return { isValid: true };
    }
};
