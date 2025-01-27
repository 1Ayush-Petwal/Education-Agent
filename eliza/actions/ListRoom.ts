import { Action, ActionExample, Handler, Validator } from '@elizaos/core';

export const ListRoomAction: Action = {
    name: "list_room",
    similes: [
        "like putting a room up for booking",
        "similar to advertising room availability",
        "comparable to opening a room for reservations"
    ],
    description: "List a hotel room NFT for sale at a fixed price",
    examples: [
        [
            {
                role: "user",
                content: "List room 101 for 200 APT"
            },
            {
                role: "assistant",
                content: "I'll help you list room 101 for 200 APT. The room will be available for purchase once the transaction is confirmed."
            }
        ]
    ],
    handler: async (context, params) => {
        try {
            const result = await context.moduleClient.submitTransaction({
                function: "launchpad::list_with_fixed_price",
                arguments: [params.objectId, params.price]
            });
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    validate: (params) => {
        if (!params.objectId || !params.price || params.price <= 0) {
            return { isValid: false, error: "Invalid parameters" };
        }
        return { isValid: true };
    }
};
