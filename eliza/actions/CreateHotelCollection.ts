import { testActions } from "viem";
import {
    type Action,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    type State,
    elizaLogger,
    ModelClass,
    composeContext,
}


export const CreateHotelCollectionAction: Action = {
    name: "create_hotel_collection",
    similes: [
        "like setting up a new hotel property",
        "similar to establishing a new hotel branch",
        "comparable to creating a hotel chain"
    ],
    description: "Create a new hotel room collection with specified parameters",
    examples: [
        [
            {
                user: "user",
                content: { text: "Create a new hotel collection called 'Luxury Suites' with 100 rooms" }
            },
            {
                user: "assistant",
                content: {text : "I'll help you create a new hotel collection with the following parameters:\nName: Luxury Suites\nMax Supply: 100\nWould you like to proceed with setting up the collection?"}
            }
        ]
    ],
    handler: async (context, params) => {
        try {
            // Implementation for creating hotel collection
            const result = await context.moduleClient.submitTransaction({
                function: "launchpad::create_collection",
                arguments: [
                    params.description,
                    params.name,
                    params.uri,
                    params.maxSupply,
                    params.royaltyPercentage || null,
                    params.preMintAmount || null,
                    params.allowlistAddresses || null,
                    params.allowlistStartTime || null,
                    params.allowlistEndTime || null,
                    params.allowlistMintLimitPerAddr || null,
                    params.allowlistMintFeePerNft || null,
                    params.publicMintStartTime || null,
                    params.publicMintEndTime || null,
                    params.publicMintLimitPerAddr || null,
                    params.publicMintFeePerNft || null
                ]
            });
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    validate: (params) => {
        if (!params.name || !params.description || !params.uri || !params.maxSupply) {
            return { isValid: false, error: "Missing required parameters" };
        }
        return { isValid: true };
    }
};
