"use client";

import { useState } from "react";
import { searchCep } from "../services/cep";

export function useCep() {
  const [loading, setLoading] = useState(false);

  async function findCep(
    cep: string,
    onSuccess: (data: {
      address: string;
      district: string;
      city: string;
      state: string;
    }) => void
  ) {
    const numbers = cep.replace(/\D/g, "");

    if (numbers.length !== 8) {
      return;
    }

    setLoading(true);

    try {
      const result = await searchCep(cep);

      if (!result) {
        return;
      }

      onSuccess({
        address: result.logradouro,
        district: result.bairro,
        city: result.localidade,
        state: result.uf,
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    findCep,
  };
}