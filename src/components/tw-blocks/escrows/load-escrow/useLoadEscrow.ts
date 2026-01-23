"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ErrorResponse,
  handleError,
} from "@/components/tw-blocks/handle-errors/handle";
import { useGetEscrowFromIndexerByContractIds } from "@trustless-work/escrow/hooks";
import { GetEscrowsFromIndexerResponse } from "@trustless-work/escrow/types";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import { loadEscrowSchema, LoadEscrowFormValues } from "./schema";

export const useLoadEscrow = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const { setSelectedEscrow } = useEscrowContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getEscrowByContractIds } = useGetEscrowFromIndexerByContractIds();

  const form = useForm<LoadEscrowFormValues>({
    resolver: zodResolver(loadEscrowSchema),
    defaultValues: {
      contractId: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (payload: LoadEscrowFormValues) => {
    setIsSubmitting(true);

    try {
      const data = (await getEscrowByContractIds({
        contractIds: [payload.contractId],
        validateOnChain: true,
      })) as unknown as GetEscrowsFromIndexerResponse[];

      const escrowData = data[0];

      if (!escrowData) {
        throw new Error("No escrow data received");
      }

      setSelectedEscrow(escrowData);

      toast.success("Escrow loaded successfully");

      onSuccess?.();
    } catch (error) {
      toast.error(handleError(error as ErrorResponse).message);
    } finally {
      setIsSubmitting(false);
      form.reset();
    }
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return { form, isSubmitting, handleSubmit };
};
