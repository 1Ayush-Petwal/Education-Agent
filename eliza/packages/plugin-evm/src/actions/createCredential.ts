import type {
    Plugin,
    Action,
    IAgentRuntime,
    Memory,
    State,
} from "@elizaos/core";
import {
    composeContext,
    generateObjectDeprecated,
    ModelClass,
} from "@elizaos/core";

// Comprehensive type definitions
export interface CredentialCollectionParams {
    institutionName: string;
    credentialType: string;
    maxSupply: number;
    validityPeriod: number;
}

export interface CredentialMintParams {
    recipientAddress: string;
    credentialDocument: File;
    metadata: {
        studentName: string;
        issueDate: string;
        programName: string;
        achievements: string[];
        grade: string;
        institutionId?: string;
        verificationHash?: string;
    };
}

export interface VerificationParams {
    tokenId: string;
    verificationHash: string;
}

export interface MetadataUpdateParams {
    tokenId: string;
    updatedFields: Record<string, any>;
    verificationProof: string;
}

// Credential Provider Interface
interface CredentialProvider {
    createCollection: (params: CredentialCollectionParams) => Promise<string>;
    mintCredential: (params: CredentialMintParams) => Promise<string>;
    verifyCredential: (tokenId: string, hash: string) => Promise<boolean>;
    updateMetadata: (
        tokenId: string,
        updates: Record<string, any>,
        proof: string
    ) => Promise<boolean>;
}

// Credential Action Handler
class CredentialActionHandler {
    private credentialProvider: CredentialProvider;

    constructor(runtime: IAgentRuntime) {
        this.credentialProvider = this.initCredentialProvider(runtime);
    }

    private initCredentialProvider(runtime: IAgentRuntime): CredentialProvider {
        return {
            createCollection: async (params) => {
                console.log("Creating credential collection:", params);
                return `collection_${Date.now()}`;
            },
            mintCredential: async (params) => {
                console.log("Minting credential:", params);
                return `token_${Date.now()}`;
            },
            verifyCredential: async (tokenId, hash) => {
                console.log(`Verifying credential: ${tokenId}`);
                return true;
            },
            updateMetadata: async (tokenId, updates, proof) => {
                console.log(`Updating metadata for: ${tokenId}`, updates);
                return true;
            },
        };
    }

    async handleAction(actionType: string, content: any): Promise<any> {
        switch (actionType) {
            case "create_collection":
                return this.createCredentialCollection(content);
            case "mint_credential":
                return this.mintCredential(content);
            case "verify_credential":
                return this.verifyCredential(content);
            case "update_metadata":
                return this.updateCredentialMetadata(content);
            default:
                throw new Error("Invalid credential management action");
        }
    }

    private async createCredentialCollection(
        params: CredentialCollectionParams
    ): Promise<string> {
        return this.credentialProvider.createCollection(params);
    }

    private async mintCredential(
        params: CredentialMintParams
    ): Promise<string> {
        return this.credentialProvider.mintCredential(params);
    }

    private async verifyCredential(
        params: VerificationParams
    ): Promise<boolean> {
        return this.credentialProvider.verifyCredential(
            params.tokenId,
            params.verificationHash
        );
    }

    private async updateCredentialMetadata(
        params: MetadataUpdateParams
    ): Promise<boolean> {
        return this.credentialProvider.updateMetadata(
            params.tokenId,
            params.updatedFields,
            params.verificationProof
        );
    }
}

// Credential Management Action
export const createCredit: Action = {
    name: "CREDENTIAL_ACTION",
    description: "Perform various credential management operations",
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        state: State,
        _options: any,
        callback?: any
    ) => {
        const actionHandler = new CredentialActionHandler(runtime);

        const credentialContext = composeContext({
            state,
            template: `
            Extract credential management details from context.
            Return structured JSON with action type and relevant parameters.
            Possible action types: create_collection, mint_credential, verify_credential, update_metadata
            `,
        });

        try {
            const content = await generateObjectDeprecated({
                runtime,
                context: credentialContext,
                modelClass: ModelClass.LARGE,
            });

            const result = await actionHandler.handleAction(
                content.actionType,
                content
            );

            if (callback) {
                callback({
                    text: `Successfully performed ${content.actionType}`,
                    content: { success: true, result },
                });
            }
            return true;
        } catch (error) {
            console.error("Credential management error:", error.message);
            if (callback) {
                callback({ text: `Error: ${error.message}` });
            }
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Create an NFT collection for university degrees",
                },
            },
            {
                user: "{{system}}",
                content: {
                    text: "Created the NFT Successfully, link to the NFT is https://devnet.irys.xyz/A914Bx5wX7myCy4DWFpkFU4SKeJmXH7GeUHEvHxDWJED/1.png",
                    action: "CREATE_CREDENTIAL_COLLECTION",
                },
            },
        ],
        [
            {
                user: "{{user2}}",
                content: {
                    text: "Mint a new academic credential for a student",
                },
            },
            {
                user: "{{system}}",
                content: {
                    text: "Created the NFT Successfully, link to the NFT is https://devnet.irys.xyz/A914Bx5wX7myCy4DWFpkFU4SKeJmXH7GeUHEvHxDWJED/1.png",
                    action: "MINT_CREDENTIAL",
                },
            },
        ],
    ],
    similes: ["CREDENTIAL_NFT", "ACADEMIC_RECORD", "DEGREE_MANAGEMENT"],
    validate: async (runtime: IAgentRuntime) => {
        const apiKey = runtime.getSetting("CREDENTIAL_PROVIDER_API_KEY");
        const providerEndpoint = runtime.getSetting(
            "CREDENTIAL_PROVIDER_ENDPOINT"
        );

        return (
            typeof apiKey === "string" &&
            apiKey.length > 0 &&
            typeof providerEndpoint === "string" &&
            providerEndpoint.length > 0
        );
    },
};

// Credential Management Plugin
export const createCredential: Plugin = {
    name: "credential_management",
    description: "Manage educational credentials as NFTs",
    actions: [createCredit],
};
