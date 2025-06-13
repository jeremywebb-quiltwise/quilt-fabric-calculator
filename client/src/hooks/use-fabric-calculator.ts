import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { calculateFabricRequirements } from "@/lib/fabric-calculations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CalculationParams {
  quiltWidth: number;
  quiltHeight: number;
  blockSize: number;
  seamAllowance: string;
  fabricWidth: number;
  pattern: string;
}

interface CalculationResults {
  mainFabric: string;
  accentFabric1: string;
  accentFabric2: string;
  bindingFabric: string;
  totalFabric: string;
  blockCount: number;
  blocksPerRow: number;
  blocksPerColumn: number;
}

export function useFabricCalculator() {
  const [results, setResults] = useState<CalculationResults | null>(null);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (params: CalculationParams) => {
      // Calculate fabric requirements locally first
      const calculationResults = calculateFabricRequirements(params);
      
      // Save to backend (optional - don't let it block the calculation)
      try {
        await apiRequest("POST", "/api/calculations", {
          ...params,
          results: JSON.stringify(calculationResults),
        });
      } catch (error) {
        console.warn("Failed to save calculation to backend:", error);
      }
      
      return calculationResults;
    },
    onSuccess: (data) => {
      setResults(data);
      toast({
        title: "Calculation Complete",
        description: "Your fabric requirements have been calculated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Calculation Failed",
        description: error.message || "Failed to calculate fabric requirements.",
        variant: "destructive",
      });
    },
  });

  const calculate = (params: CalculationParams) => {
    mutation.mutate(params);
  };

  return {
    calculate,
    results,
    isCalculating: mutation.isPending,
    error: mutation.error,
  };
}
