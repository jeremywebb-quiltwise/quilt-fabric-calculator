import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface CellData {
  type: string;
  color: string;
  secondaryColor?: string;
  isEmpty: boolean;
  rotation?: number;
  flippedH?: boolean;
  flippedV?: boolean;
  fabric?: string;
  merged?: boolean;
  mergedSize?: number;
  mergedParent?: number;
}

type GridData = Record<number, CellData>;

export function useDesignGrid(initialSize: number = 8) {
  const [grid, setGrid] = useState<GridData>({});
  const [gridSizeNumber, setGridSizeNumber] = useState(initialSize);
  const { toast } = useToast();

  const updateCell = useCallback((index: number, cellData: CellData) => {
    setGrid(prev => ({
      ...prev,
      [index]: cellData
    }));
  }, []);

  const clearGrid = useCallback(() => {
    setGrid({});
    toast({
      title: "Grid Cleared",
      description: "All blocks have been removed from the design grid.",
    });
  }, [toast]);

  const saveDesignMutation = useMutation({
    mutationFn: async () => {
      const designData = {
        name: `Design ${new Date().toLocaleDateString()}`,
        gridData: JSON.stringify(grid),
        gridSize: gridSizeNumber,
      };
      
      return await apiRequest("POST", "/api/designs", designData);
    },
    onSuccess: () => {
      toast({
        title: "Design Saved",
        description: "Your quilt design has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save your design.",
        variant: "destructive",
      });
    },
  });

  const loadDesign = useCallback(() => {
    // For now, we'll load from localStorage as a fallback
    try {
      const savedDesign = localStorage.getItem("quilt-design");
      if (savedDesign) {
        const parsedDesign = JSON.parse(savedDesign);
        setGrid(parsedDesign.gridData || {});
        setGridSizeNumber(parsedDesign.gridSize || 8);
        toast({
          title: "Design Loaded",
          description: "Your saved design has been loaded successfully.",
        });
      } else {
        toast({
          title: "No Saved Design",
          description: "No saved design found to load.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load your saved design.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const saveDesign = useCallback(() => {
    // Save to localStorage as fallback
    try {
      const designData = {
        gridData: grid,
        gridSize: gridSizeNumber,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("quilt-design", JSON.stringify(designData));
      
      // Also try to save to backend
      saveDesignMutation.mutate();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save your design locally.",
        variant: "destructive",
      });
    }
  }, [grid, gridSizeNumber, saveDesignMutation, toast]);

  return {
    grid,
    updateCell,
    clearGrid,
    saveDesign,
    loadDesign,
    gridSizeNumber,
    setGridSizeNumber,
    isSaving: saveDesignMutation.isPending,
  };
}
