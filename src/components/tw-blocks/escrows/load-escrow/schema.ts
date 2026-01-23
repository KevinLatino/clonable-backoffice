import { z } from "zod";

const STELLAR_CONTRACT_ID_REGEX = /^C[A-Z2-7]{55}$/;

export const loadEscrowSchema = z.object({
  contractId: z
    .string()
    .min(1, "Contract ID is required")
    .regex(STELLAR_CONTRACT_ID_REGEX, "Invalid Stellar Contract ID"),
});

export type LoadEscrowFormValues = z.infer<typeof loadEscrowSchema>;
