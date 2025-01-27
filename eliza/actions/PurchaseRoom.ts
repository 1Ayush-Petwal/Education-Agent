import { Action, ActionExample, Handler, Validator } from '@elizaos/core';

export const PurchaseRoomAction: Action = {
    name: "purchase_room",
    similes: [
        "like booking a hotel room",
        "similar to reserving accommodation",
        "comparable to securing a stay"
    ],
    description: "Purchase a hotel room NFT from a fixed price listing",
    examples: [
        [
            {
                role: "user",
                content: "Purchase room 101"
            },
            {
                role: "assistant",
                content: "I'll help you purchase room 101. Please confirm the transaction to complete your booking."
            }
        ]
    ],
    handler: async (context, params) => {
        try {
            const result = await context.moduleClient.submitTransaction({
                function: "launchpad::purchase",
                arguments: [params.objectId]
            });
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    validate: (params) => {
        if (!params.objectId) {
            return { isValid: false, error: "Missing object ID" };
        }
        return { isValid: true };
    }
};
