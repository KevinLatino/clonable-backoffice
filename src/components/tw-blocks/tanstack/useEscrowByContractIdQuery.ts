import { useQuery } from "@tanstack/react-query";
import {
  GetEscrowFromIndexerByContractIdsParams,
  useGetEscrowFromIndexerByContractIds,
} from "@trustless-work/escrow";
import { GetEscrowsFromIndexerResponse as Escrow } from "@trustless-work/escrow/types";

type UseEscrowByContractIdQueryParams = Omit<
  GetEscrowFromIndexerByContractIdsParams,
  "contractIds"
> & {
  contractId?: string;
  enabled?: boolean;
  validateOnChain?: boolean;
};

/**
 * Use the query to get an escrow by contract ID
 *
 * @param params - The parameters for the query
 * @returns The query result
 */
export const useEscrowByContractIdQuery = ({
  contractId,
  validateOnChain = true,
  enabled = true,
}: UseEscrowByContractIdQueryParams) => {
  // Get the escrow by contract ID
  const { getEscrowByContractIds } = useGetEscrowFromIndexerByContractIds();

  return useQuery({
    queryKey: ["escrow", contractId, validateOnChain],
    queryFn: async (): Promise<Escrow | null> => {
      if (!contractId) {
        throw new Error("Contract ID is required to fetch escrow");
      }

      /**
       * Call the query to get the escrow from the Trustless Work Indexer
       *
       * @param params - The parameters for the query
       * @returns The query result
       */
      const escrows = await getEscrowByContractIds({
        contractIds: [contractId],
        validateOnChain,
      });

      if (!escrows || escrows.length === 0) {
        return null;
      }

      return escrows[0]; // Assuming contract ID is unique
    },
    enabled: enabled && !!contractId,
    staleTime: 1000 * 60 * 5,
  });
};