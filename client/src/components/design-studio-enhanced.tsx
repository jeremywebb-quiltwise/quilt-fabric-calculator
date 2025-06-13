import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDesignGrid, type CellData } from "@/hooks/use-design-grid";
import QuiltBlockPattern from "@/components/quilt-block-pattern";
import { 
  Save, Printer, Trash2, Palette, RotateCcw, RotateCw, Undo, Redo, Copy, Layers, 
  Download, Upload, Zap, Grid, Move, MousePointer, ZoomIn, ZoomOut, FlipHorizontal, 
  FlipVertical, Eye, EyeOff, Plus, Minus, FileText, 
  Folder, FolderOpen, Settings, HelpCircle, Map
} from "lucide-react";

// Enhanced block definitions with rotation and fabric support
const QUILT_BLOCKS = {
  traditional: [
    { id: "nine-patch", name: "Nine Patch", pattern: "ninePatch", category: "traditional" },
    { id: "log-cabin", name: "Log Cabin", pattern: "logCabin", category: "traditional" },
    { id: "flying-geese", name: "Flying Geese", pattern: "flyingGeese", category: "traditional" },
    { id: "pinwheel", name: "Pinwheel", pattern: "pinwheel", category: "traditional" },
    { id: "ohio-star", name: "Ohio Star", pattern: "ohioStar", category: "traditional" },
    { id: "churn-dash", name: "Churn Dash", pattern: "churnDash", category: "traditional" },
    { id: "bear-paw", name: "Bear's Paw", pattern: "bearPaw", category: "traditional" },
    { id: "four-patch", name: "Four Patch", pattern: "fourPatch", category: "traditional" },
  ],
  modern: [
    { id: "half-square", name: "Half Square Triangle", pattern: "halfSquare", category: "modern" },
    { id: "courthouse-steps", name: "Courthouse Steps", pattern: "courthouseSteps", category: "modern" },
    { id: "disappearing-nine", name: "Disappearing Nine", pattern: "disappearingNine", category: "modern" },
    { id: "wonky-cross", name: "Wonky Cross", pattern: "wonkyCross", category: "modern" },
  ],
  shapes: [
    { id: "solid", name: "Solid", pattern: "solid", category: "basic" },
    { id: "triangle-hst", name: "HST", pattern: "hst", category: "basic" },
    { id: "quarter-square", name: "Quarter Square", pattern: "quarterSquare", category: "basic" },
    { id: "hexagon", name: "Hexagon", pattern: "hexagon", category: "basic" },
  ]
};

// Enhanced color palettes with fabric-inspired collections
const COLOR_PALETTES = {
  warm: ["#8B4B3C", "#C4A76B", "#D2691E", "#CD853F", "#DEB887", "#F4A460"],
  cool: ["#6B8B73", "#4682B4", "#5F9EA0", "#708090", "#778899", "#B0C4DE"],
  earth: ["#8B4513", "#A0522D", "#CD853F", "#D2691E", "#DEB887", "#F5DEB3"],
  jewel: ["#8B008B", "#4B0082", "#191970", "#006400", "#B22222", "#FF8C00"],
  pastels: ["#FFB6C1", "#DDA0DD", "#98FB98", "#F0E68C", "#FFA07A", "#20B2AA"],
  modern: ["#2D3748", "#4A5568", "#718096", "#A0AEC0", "#CBD5E0", "#E2E8F0"],
  christmas: ["#B91C1C", "#059669", "#FFFFFF", "#FDE047", "#A3A3A3", "#DC2626"],
  autumn: ["#DC2626", "#EA580C", "#D97706", "#CA8A04", "#65A30D", "#16A34A"]
};

// Enhanced tools with tooltips and functionality
const TOOLS = [
  { id: "select", name: "Select", icon: MousePointer, tooltip: "Select and modify blocks" },
  { id: "paint", name: "Paint", icon: Palette, tooltip: "Click to place blocks" },
  { id: "fill", name: "Fill", icon: Zap, tooltip: "Fill connected areas" },
  { id: "move", name: "Move", icon: Move, tooltip: "Move blocks around" },
  { id: "eyedropper", name: "Eyedropper", icon: Eye, tooltip: "Copy block pattern" },
];

export default function DesignStudioEnhanced() {
  // Core design state
  const [gridSize, setGridSize] = useState("12");
  const [selectedColor, setSelectedColor] = useState("#8B4B3C");
  const [secondaryColor, setSecondaryColor] = useState("#F7F5F3");
  const [selectedBlockType, setSelectedBlockType] = useState("ninePatch");
  const [activeTool, setActiveTool] = useState("paint");
  const [selectedPalette, setSelectedPalette] = useState("warm");
  const [gridType, setGridType] = useState("rectangle"); // rectangle, on-point, equilateral
  const [defaultBlockSize, setDefaultBlockSize] = useState("5");
  const [colorTags, setColorTags] = useState<{[key: string]: string}>({
    A: "#8B4B3C",
    B: "#F7F5F3", 
    C: "#6B8B73",
    D: "#C4A76B"
  });
  const [activeColorway, setActiveColorway] = useState(0);
  const [colorways, setColorways] = useState<any[]>([
    { name: "Original", colors: {...colorTags} }
  ]);
  
  // UI state
  const [zoom, setZoom] = useState([100]);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Set<number>>(new Set());
  
  // Project management
  const [projectName, setProjectName] = useState("My Quilt Design");
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [isUnsaved, setIsUnsaved] = useState(false);
  
  // History management
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [customPalettes, setCustomPalettes] = useState<any[]>([]);
  
  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const lastPanPoint = useRef({ x: 0, y: 0 });
  
  const { 
    grid, 
    updateCell, 
    clearGrid, 
    saveDesign, 
    loadDesign,
    gridSizeNumber,
    setGridSizeNumber 
  } = useDesignGrid(parseInt(gridSize));

  // Enhanced grid size change with history tracking
  const handleGridSizeChange = (newSize: string) => {
    addToHistory();
    setGridSize(newSize);
    setGridSizeNumber(parseInt(newSize));
    setIsUnsaved(true);
  };

  // Enhanced history management with proper state restoration
  const addToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify({
      grid,
      projectName,
      gridSize,
      timestamp: Date.now()
    })));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Limit history to 50 entries for performance
    if (newHistory.length > 50) {
      const trimmedHistory = newHistory.slice(-50);
      setHistory(trimmedHistory);
      setHistoryIndex(trimmedHistory.length - 1);
    }
  }, [grid, history, historyIndex, projectName, gridSize]);

  const undo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      if (previousState) {
        // Apply previous state to grid
        Object.keys(previousState.grid).forEach(key => {
          updateCell(parseInt(key), previousState.grid[key]);
        });
        setHistoryIndex(historyIndex - 1);
        setIsUnsaved(true);
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      if (nextState) {
        // Apply next state to grid
        Object.keys(nextState.grid).forEach(key => {
          updateCell(parseInt(key), nextState.grid[key]);
        });
        setHistoryIndex(historyIndex + 1);
        setIsUnsaved(true);
      }
    }
  };

  // Block transformation functions
  const rotateBlock = (rotation: number) => {
    return (rotation + 90) % 360;
  };

  const flipBlockHorizontal = (pattern: string) => {
    return pattern + "_flipped_h";
  };

  const flipBlockVertical = (pattern: string) => {
    return pattern + "_flipped_v";
  };

  // Selection management
  const selectCell = (index: number, multiSelect = false) => {
    if (multiSelect) {
      const newSelection = new Set(selectedCells);
      if (newSelection.has(index)) {
        newSelection.delete(index);
      } else {
        newSelection.add(index);
      }
      setSelectedCells(newSelection);
    } else {
      setSelectedCells(new Set([index]));
    }
  };

  const clearSelection = () => {
    setSelectedCells(new Set());
  };

  // Enhanced block operations on selected cells
  const rotateSelectedBlocks = () => {
    addToHistory();
    selectedCells.forEach(index => {
      const currentCell = grid[index];
      if (currentCell && !currentCell.isEmpty) {
        updateCell(index, {
          ...currentCell,
          rotation: rotateBlock(currentCell.rotation || 0)
        });
      }
    });
    setIsUnsaved(true);
  };

  const flipSelectedBlocksHorizontal = () => {
    addToHistory();
    selectedCells.forEach(index => {
      const currentCell = grid[index];
      if (currentCell && !currentCell.isEmpty) {
        updateCell(index, {
          ...currentCell,
          type: flipBlockHorizontal(currentCell.type),
          flippedH: !currentCell.flippedH
        });
      }
    });
    setIsUnsaved(true);
  };

  const flipSelectedBlocksVertical = () => {
    addToHistory();
    selectedCells.forEach(index => {
      const currentCell = grid[index];
      if (currentCell && !currentCell.isEmpty) {
        updateCell(index, {
          ...currentCell,
          type: flipBlockVertical(currentCell.type),
          flippedV: !currentCell.flippedV
        });
      }
    });
    setIsUnsaved(true);
  };

  // Enhanced project management
  const saveProject = () => {
    const projectData = {
      id: Date.now().toString(),
      name: projectName,
      grid,
      gridSize,
      timestamp: Date.now(),
      colors: { primary: selectedColor, secondary: secondaryColor },
      palette: selectedPalette
    };
    
    const saved = JSON.parse(localStorage.getItem('quilt-projects') || '[]');
    const existingIndex = saved.findIndex((p: any) => p.name === projectName);
    
    if (existingIndex >= 0) {
      saved[existingIndex] = projectData;
    } else {
      saved.push(projectData);
    }
    
    localStorage.setItem('quilt-projects', JSON.stringify(saved));
    setSavedProjects(saved);
    setIsUnsaved(false);
  };

  const loadProject = (projectData: any) => {
    addToHistory();
    setProjectName(projectData.name);
    setGridSize(projectData.gridSize);
    setGridSizeNumber(parseInt(projectData.gridSize));
    setSelectedColor(projectData.colors?.primary || "#8B4B3C");
    setSecondaryColor(projectData.colors?.secondary || "#F7F5F3");
    setSelectedPalette(projectData.palette || "warm");
    
    // Load grid data
    Object.keys(projectData.grid).forEach(key => {
      updateCell(parseInt(key), projectData.grid[key]);
    });
    
    setIsUnsaved(false);
  };

  const createNewProject = () => {
    if (isUnsaved) {
      if (confirm("You have unsaved changes. Create new project anyway?")) {
        addToHistory();
        clearGrid();
        setProjectName("New Quilt Design");
        setIsUnsaved(false);
        clearSelection();
      }
    } else {
      addToHistory();
      clearGrid();
      setProjectName("New Quilt Design");
      clearSelection();
    }
  };

  // Enhanced zoom and pan functionality
  const handleZoomIn = () => {
    setZoom([Math.min(zoom[0] + 25, 300)]);
  };

  const handleZoomOut = () => {
    setZoom([Math.max(zoom[0] - 25, 25)]);
  };

  const resetZoom = () => {
    setZoom([100]);
    setPanOffset({ x: 0, y: 0 });
  };

  // Save custom color palette
  const saveCustomPalette = () => {
    const paletteName = prompt("Enter palette name:");
    if (paletteName) {
      const newPalette = {
        name: paletteName,
        colors: [selectedColor, secondaryColor, ...Object.values(COLOR_PALETTES.warm).slice(0, 4)]
      };
      setCustomPalettes([...customPalettes, newPalette]);
      localStorage.setItem('custom-palettes', JSON.stringify([...customPalettes, newPalette]));
    }
  };

  // Advanced grid manipulation functions
  const addRowAbove = (rowIndex: number) => {
    addToHistory();
    const newGrid: any = {};
    const totalCells = gridSizeNumber * gridSizeNumber;
    
    for (let i = 0; i < totalCells; i++) {
      const row = Math.floor(i / gridSizeNumber);
      const col = i % gridSizeNumber;
      
      if (row >= rowIndex) {
        const newIndex = (row + 1) * gridSizeNumber + col;
        newGrid[newIndex] = grid[i];
      } else {
        newGrid[i] = grid[i];
      }
    }
    
    setGridSizeNumber(gridSizeNumber + 1);
    setGridSize((gridSizeNumber + 1).toString());
    Object.keys(newGrid).forEach(key => {
      updateCell(parseInt(key), newGrid[key]);
    });
    setIsUnsaved(true);
  };

  const addColumnLeft = (colIndex: number) => {
    addToHistory();
    const newGrid: any = {};
    const totalCells = gridSizeNumber * gridSizeNumber;
    
    for (let i = 0; i < totalCells; i++) {
      const row = Math.floor(i / gridSizeNumber);
      const col = i % gridSizeNumber;
      
      if (col >= colIndex) {
        const newIndex = row * (gridSizeNumber + 1) + (col + 1);
        newGrid[newIndex] = grid[i];
      } else {
        const newIndex = row * (gridSizeNumber + 1) + col;
        newGrid[newIndex] = grid[i];
      }
    }
    
    setGridSizeNumber(gridSizeNumber + 1);
    setGridSize((gridSizeNumber + 1).toString());
    Object.keys(newGrid).forEach(key => {
      updateCell(parseInt(key), newGrid[key]);
    });
    setIsUnsaved(true);
  };

  // Cell merging functionality
  const mergeCells = (cellIndices: number[]) => {
    if (cellIndices.length < 2) return;
    
    addToHistory();
    const firstCell = grid[cellIndices[0]];
    
    cellIndices.forEach((index, i) => {
      if (i === 0) {
        updateCell(index, {
          ...firstCell,
          merged: true,
          mergedSize: cellIndices.length
        });
      } else {
        updateCell(index, {
          type: "merged",
          color: "transparent",
          isEmpty: true,
          mergedParent: cellIndices[0]
        });
      }
    });
    setIsUnsaved(true);
  };

  // Colorway management
  const createNewColorway = () => {
    const newColorway = {
      name: `Colorway ${colorways.length + 1}`,
      colors: {...colorTags}
    };
    setColorways([...colorways, newColorway]);
    setActiveColorway(colorways.length);
  };

  const cloneColorway = (index: number) => {
    const original = colorways[index];
    const cloned = {
      name: `${original.name} Copy`,
      colors: {...original.colors}
    };
    setColorways([...colorways, cloned]);
    setActiveColorway(colorways.length);
  };

  const updateColorway = (colorwayIndex: number, tagKey: string, color: string) => {
    const updatedColorways = [...colorways];
    updatedColorways[colorwayIndex].colors[tagKey] = color;
    setColorways(updatedColorways);
    
    if (colorwayIndex === activeColorway) {
      setColorTags({...colorTags, [tagKey]: color});
    }
  };

  const randomizeColors = () => {
    const newTags = {...colorTags};
    Object.keys(newTags).forEach(key => {
      const palette = (COLOR_PALETTES as any)[selectedPalette];
      newTags[key] = palette[Math.floor(Math.random() * palette.length)];
    });
    setColorTags(newTags);
    updateColorway(activeColorway, "", ""); // Update current colorway
  };

  // Enhanced cell click with rotation support
  const handleCellClick = (index: number, event?: React.MouseEvent) => {
    const isCtrlClick = event?.ctrlKey || event?.metaKey;
    const cellData = grid[index];
    
    if (activeTool === "select") {
      selectCell(index, isCtrlClick);
    } else if (activeTool === "paint") {
      // If cell already has this block, rotate it
      if (cellData && !cellData.isEmpty && cellData.type === selectedBlockType) {
        addToHistory();
        const newRotation = ((cellData.rotation || 0) + 90) % 360;
        updateCell(index, {
          ...cellData,
          rotation: newRotation
        });
      } else {
        // Place new block
        addToHistory();
        updateCell(index, {
          type: selectedBlockType,
          color: selectedColor,
          secondaryColor: secondaryColor,
          isEmpty: false,
          rotation: 0
        });
      }
      setIsUnsaved(true);
    } else if (activeTool === "fill") {
      addToHistory();
      fillConnectedCells(index);
      setIsUnsaved(true);
    } else if (activeTool === "eyedropper") {
      if (cellData && !cellData.isEmpty) {
        setSelectedBlockType(cellData.type);
        setSelectedColor(cellData.color);
        if (cellData.secondaryColor) {
          setSecondaryColor(cellData.secondaryColor);
        }
      }
    }
  };

  // Right-click context menu
  const handleCellRightClick = (index: number, event: React.MouseEvent) => {
    event.preventDefault();
    const row = Math.floor(index / gridSizeNumber);
    const col = index % gridSizeNumber;
    
    // Simple context menu using native confirm/prompt
    const actions = [
      "Select Row",
      "Select Column", 
      "Add Row Above",
      "Add Column Left",
      "Rotate Block",
      "Delete Block"
    ];
    
    // For now, implement basic actions
    const cellData = grid[index];
    if (cellData && !cellData.isEmpty) {
      const newRotation = ((cellData.rotation || 0) + 90) % 360;
      addToHistory();
      updateCell(index, {
        ...cellData,
        rotation: newRotation
      });
      setIsUnsaved(true);
    }
  };

  // Row and column selection
  const selectRow = (rowIndex: number) => {
    const rowCells = new Set<number>();
    for (let col = 0; col < gridSizeNumber; col++) {
      rowCells.add(rowIndex * gridSizeNumber + col);
    }
    setSelectedCells(rowCells);
  };

  const selectColumn = (colIndex: number) => {
    const colCells = new Set<number>();
    for (let row = 0; row < gridSizeNumber; row++) {
      colCells.add(row * gridSizeNumber + colIndex);
    }
    setSelectedCells(colCells);
  };

  // Copy and paste functionality
  const copySelectedCells = () => {
    const copiedData: any = {};
    selectedCells.forEach(index => {
      copiedData[index] = grid[index];
    });
    localStorage.setItem('copied-cells', JSON.stringify(copiedData));
  };

  const pasteToSelectedCells = () => {
    const copiedData = JSON.parse(localStorage.getItem('copied-cells') || '{}');
    if (Object.keys(copiedData).length === 0) return;
    
    addToHistory();
    selectedCells.forEach(index => {
      const copiedIndex = Object.keys(copiedData)[0];
      const cellData = copiedData[copiedIndex];
      if (cellData) {
        updateCell(index, {...cellData});
      }
    });
    setIsUnsaved(true);
  };

  // Delete selected cells
  const deleteSelectedCells = () => {
    if (selectedCells.size === 0) return;
    
    addToHistory();
    selectedCells.forEach(index => {
      updateCell(index, {
        type: "empty",
        color: "#f5f5f5",
        isEmpty: true,
        rotation: 0
      });
    });
    setSelectedCells(new Set());
    setIsUnsaved(true);
  };

  // Enhanced keyboard shortcuts for professional workflow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCells(new Set());
      } else if (e.key === 'Delete' && selectedCells.size > 0) {
        e.preventDefault();
        deleteSelectedCells();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        copySelectedCells();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        pasteToSelectedCells();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveProject();
      } else if (e.key === 'r' && selectedCells.size > 0) {
        e.preventDefault();
        rotateSelectedBlocks();
      } else if (e.key === 'h' && selectedCells.size > 0) {
        e.preventDefault();
        flipSelectedBlocksHorizontal();
      } else if (e.key === 'v' && selectedCells.size > 0) {
        e.preventDefault();
        flipSelectedBlocksVertical();
      } else if (e.key >= '1' && e.key <= '9') {
        // Quick tool selection
        const toolIndex = parseInt(e.key) - 1;
        if (toolIndex < TOOLS.length) {
          setActiveTool(TOOLS[toolIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCells, historyIndex, history.length]);

  const fillConnectedCells = (startIndex: number) => {
    const visited = new Set();
    const stack = [startIndex];
    const originalCell = grid[startIndex];
    
    while (stack.length > 0) {
      const currentIndex = stack.pop();
      if (!currentIndex || visited.has(currentIndex)) continue;
      
      visited.add(currentIndex);
      updateCell(currentIndex, {
        type: selectedBlockType,
        color: selectedColor,
        secondaryColor: secondaryColor,
        isEmpty: false,
        rotation: 0
      });
      
      // Add adjacent cells
      const row = Math.floor(currentIndex / gridSizeNumber);
      const col = currentIndex % gridSizeNumber;
      
      // Check neighbors
      [[0,1], [0,-1], [1,0], [-1,0]].forEach(([dr, dc]) => {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < gridSizeNumber && newCol >= 0 && newCol < gridSizeNumber) {
          const neighborIndex = newRow * gridSizeNumber + newCol;
          const neighborCell = grid[neighborIndex];
          
          if (!visited.has(neighborIndex) && 
              (!neighborCell || neighborCell.isEmpty || 
               (neighborCell.type === originalCell?.type && neighborCell.color === originalCell?.color))) {
            stack.push(neighborIndex);
          }
        }
      });
    }
  };

  const handleBlockDrop = (index: number, blockType: string) => {
    addToHistory();
    updateCell(index, {
      type: blockType,
      color: selectedColor,
      secondaryColor: secondaryColor,
      isEmpty: false,
      rotation: 0
    });
    setIsUnsaved(true);
  };

  // Enhanced export functionality
  const exportDesignToHighResPNG = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const cellSize = 100;
    canvas.width = gridSizeNumber * cellSize;
    canvas.height = gridSizeNumber * cellSize;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < gridSizeNumber * gridSizeNumber; i++) {
      const cellData = grid[i];
      const row = Math.floor(i / gridSizeNumber);
      const col = i % gridSizeNumber;
      
      if (cellData && !cellData.isEmpty) {
        ctx.fillStyle = cellData.color;
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        
        if (cellData.secondaryColor) {
          ctx.fillStyle = cellData.secondaryColor;
          ctx.fillRect(col * cellSize + cellSize/4, row * cellSize + cellSize/4, cellSize/2, cellSize/2);
        }
      }
      
      if (showGrid) {
        ctx.strokeStyle = '#e5e5e5';
        ctx.lineWidth = 1;
        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}-highres.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  // Load saved projects on component mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('quilt-projects') || '[]');
    setSavedProjects(saved);
    
    const customPals = JSON.parse(localStorage.getItem('custom-palettes') || '[]');
    setCustomPalettes(customPals);
  }, []);

  const renderGrid = () => {
    const totalCells = gridSizeNumber * gridSizeNumber;
    const cells = [];
    
    for (let i = 0; i < totalCells; i++) {
      const cellData = grid[i];
      const isSelected = selectedCells.has(i);
      
      cells.push(
        <div
          key={i}
          className={`
            quilt-cell relative aspect-square transition-all duration-200 cursor-pointer
            ${showGrid ? 'border border-gray-300' : 'border-0'}
            ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
            ${activeTool === 'paint' ? 'hover:opacity-75' : ''}
            ${activeTool === 'fill' ? 'hover:opacity-75' : ''}
            ${activeTool === 'select' ? 'hover:ring-2 hover:ring-blue-300' : ''}
            ${!cellData || cellData.isEmpty ? 'bg-white' : ''}
          `}
          onClick={(e) => handleCellClick(i, e)}
          onDrop={(e) => {
            e.preventDefault();
            const blockType = e.dataTransfer.getData("text/plain");
            if (blockType) handleBlockDrop(i, blockType);
          }}
          onDragOver={(e) => e.preventDefault()}
          onContextMenu={(e) => handleCellRightClick(i, e)}
        >
          {cellData && !cellData.isEmpty ? (
            <div 
              style={{ 
                transform: `rotate(${cellData.rotation || 0}deg)`,
                transition: 'transform 0.2s ease'
              }}
              className="w-full h-full"
            >
              <QuiltBlockPattern
                pattern={cellData.type}
                primaryColor={cellData.color}
                secondaryColor={cellData.secondaryColor || "#F7F5F3"}
                size={22}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-white"></div>
          )}
          
          {isSelected && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 pointer-events-none" />
          )}
        </div>
      );
    }
    
    return cells;
  };

  // Mini-map component for large quilts
  const renderMiniMap = () => {
    if (!showMiniMap) return null;
    
    const totalCells = gridSizeNumber * gridSizeNumber;
    const miniCells = [];
    
    for (let i = 0; i < totalCells; i++) {
      const cellData = grid[i];
      miniCells.push(
        <div
          key={i}
          className="w-1 h-1"
          style={{
            backgroundColor: cellData && !cellData.isEmpty ? cellData.color : '#f5f5f5',
            width: '32px',
            height: '32px'
          }}
        />
      );
    }
    
    return (
      <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-2 shadow-lg z-10">
        <div className="text-xs font-medium mb-1">Overview</div>
        <div 
          className="grid gap-0"
          style={{ 
            gridTemplateColumns: `repeat(${gridSizeNumber}, minmax(0, 1fr))`,
            width: `${gridSizeNumber * 2}px`,
            height: `${gridSizeNumber * 2}px`
          }}
        >
          {miniCells}
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="studio-page h-screen flex flex-col bg-gray-50 relative overflow-hidden">
        {/* Enhanced Top Toolbar */}
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between overflow-hidden">
            {/* Left Section - Project Name */}
            <div className="flex items-center space-x-2 min-w-0">
              <Input
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  setIsUnsaved(true);
                }}
                className="text-sm font-semibold border-none shadow-none p-0 h-auto focus-visible:ring-0 w-32"
              />
              {isUnsaved && <Badge variant="outline" className="text-orange-600 text-xs">•</Badge>}
            </div>
            
            {/* Center Section - Compact Tools */}
            <div className="flex items-center space-x-2 flex-1 justify-center min-w-0">
              {/* Essential Tools Only */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                {TOOLS.slice(0, 5).map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Button
                      key={tool.id}
                      variant={activeTool === tool.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTool(tool.id)}
                      className={`${activeTool === tool.id ? "bg-terracotta text-white" : ""} w-8 h-8 p-0`}
                    >
                      <Icon className="h-3 w-3" />
                    </Button>
                  );
                })}
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="sm" onClick={copySelectedCells} disabled={selectedCells.size === 0} className="w-8 h-8 p-0">
                  <Copy className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={pasteToSelectedCells} className="w-8 h-8 p-0">
                  <Upload className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0} className="w-8 h-8 p-0">
                  <Undo className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1} className="w-8 h-8 p-0">
                  <Redo className="h-3 w-3" />
                </Button>
              </div>
              
              {selectedCells.size > 0 && (
                <Badge variant="secondary" className="text-xs">{selectedCells.size}</Badge>
              )}
            </div>
            
            {/* Right Section - Compact Controls */}
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" onClick={handleZoomOut} className="w-8 h-8 p-0">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-xs w-10 text-center">{zoom[0]}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn} className="w-8 h-8 p-0">
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={saveProject} className="w-8 h-8 p-0">
                <Save className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left Sidebar - Block Library & Tools */}
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
            <Tabs defaultValue="blocks" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="blocks">Blocks</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="layers">Layers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="blocks" className="p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-charcoal mb-3">Traditional Blocks</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {QUILT_BLOCKS.traditional.map((block) => (
                        <div
                          key={block.id}
                          className={`cursor-grab transition-all hover:scale-105 ${
                            selectedBlockType === block.pattern ? "ring-2 ring-terracotta" : ""
                          }`}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData("text/plain", block.pattern)}
                          onClick={() => setSelectedBlockType(block.pattern)}
                          title={block.name}
                        >
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <QuiltBlockPattern 
                              pattern={block.pattern}
                              primaryColor={selectedColor}
                              secondaryColor="#F7F5F3"
                              size={60}
                            />
                          </div>
                          <p className="text-xs text-center mt-1 font-medium text-charcoal">{block.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-charcoal mb-3">Modern Blocks</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {QUILT_BLOCKS.modern.map((block) => (
                        <div
                          key={block.id}
                          className={`cursor-grab transition-all hover:scale-105 ${
                            selectedBlockType === block.pattern ? "ring-2 ring-terracotta" : ""
                          }`}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData("text/plain", block.pattern)}
                          onClick={() => setSelectedBlockType(block.pattern)}
                          title={block.name}
                        >
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <QuiltBlockPattern 
                              pattern={block.pattern}
                              primaryColor={selectedColor}
                              secondaryColor="#F7F5F3"
                              size={60}
                            />
                          </div>
                          <p className="text-xs text-center mt-1 font-medium text-charcoal">{block.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-charcoal mb-3">Basic Shapes</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {QUILT_BLOCKS.shapes.map((block) => (
                        <div
                          key={block.id}
                          className={`cursor-grab transition-all hover:scale-105 ${
                            selectedBlockType === block.pattern ? "ring-2 ring-terracotta" : ""
                          }`}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData("text/plain", block.pattern)}
                          onClick={() => setSelectedBlockType(block.pattern)}
                          title={block.name}
                        >
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <QuiltBlockPattern 
                              pattern={block.pattern}
                              primaryColor={selectedColor}
                              secondaryColor="#F7F5F3"
                              size={60}
                            />
                          </div>
                          <p className="text-xs text-center mt-1 font-medium text-charcoal">{block.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="colors" className="p-4">
                <div className="space-y-4">
                  {/* Colorway Management */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-semibold">Colorways</Label>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" onClick={createNewColorway}>
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={randomizeColors}>
                          🎲
                        </Button>
                      </div>
                    </div>
                    <Select value={activeColorway.toString()} onValueChange={(value) => setActiveColorway(parseInt(value))}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorways.map((colorway, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {colorway.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Color Tags */}
                  <div>
                    <Label className="text-sm font-semibold">Color Tags</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {Object.entries(colorTags).map(([tag, color]) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <div className="w-6 h-6 text-xs font-bold bg-gray-800 text-white rounded flex items-center justify-center">
                            {tag}
                          </div>
                          <Input
                            type="color"
                            value={color}
                            onChange={(e) => {
                              const newTags = {...colorTags, [tag]: e.target.value};
                              setColorTags(newTags);
                              updateColorway(activeColorway, tag, e.target.value);
                            }}
                            className="w-12 h-6 p-0 border-0"
                          />
                          <span className="text-xs text-gray-600 flex-1">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Quick Color Palette */}
                  <div>
                    <Label className="text-sm font-semibold">Quick Colors</Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {(COLOR_PALETTES as any)[selectedPalette]?.map((color: string, index: number) => (
                        <div
                          key={index}
                          className={`aspect-square rounded-lg cursor-pointer border-2 transition-all hover:scale-110 ${
                            selectedColor === color ? "border-terracotta shadow-lg" : "border-gray-200"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Current Selection */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2">
                      <div>
                        <Label className="text-xs text-gray-600">Primary</Label>
                        <Input
                          type="color"
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                          className="w-12 h-8 p-0 border-0"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Secondary</Label>
                        <Input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-12 h-8 p-0 border-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="layers" className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-charcoal">Design Layers</h4>
                    <Button size="sm" variant="outline">
                      <Layers className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Background</span>
                        <div className="w-4 h-4 bg-white border rounded"></div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-terracotta/10 rounded-lg border border-terracotta">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Main Design</span>
                        <div className="w-4 h-4 bg-terracotta border rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col">
            {/* Canvas Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Label className="text-sm font-medium">Grid Size:</Label>
                  <Select value={gridSize} onValueChange={handleGridSizeChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8 × 8</SelectItem>
                      <SelectItem value="10">10 × 10</SelectItem>
                      <SelectItem value="12">12 × 12</SelectItem>
                      <SelectItem value="16">16 × 16</SelectItem>
                      <SelectItem value="20">20 × 20</SelectItem>
                      <SelectItem value="24">24 × 24</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="text-sm text-gray-600">
                  {gridSizeNumber} × {gridSizeNumber} blocks • {gridSizeNumber * gridSizeNumber} total pieces
                </div>
              </div>
            </div>
            
            {/* Canvas - Full Grid with Headers */}
            <div className="flex-1 flex items-start justify-center bg-gray-100 overflow-auto p-2">
              <div className="bg-white shadow-xl rounded-lg p-3">
                {/* Grid with row/column headers */}
                <div className="flex">
                  {/* Row numbers header */}
                  <div className="flex flex-col">
                    <div className="w-6 h-6"></div> {/* Empty corner */}
                    {Array.from({ length: gridSizeNumber }, (_, i) => (
                      <div 
                        key={i} 
                        className="w-6 h-6 flex items-center justify-center text-xs font-medium border-r border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100"
                        onClick={() => selectRow(i)}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col">
                    {/* Column numbers */}
                    <div className="flex">
                      {Array.from({ length: gridSizeNumber }, (_, i) => (
                        <div 
                          key={i} 
                          className="w-6 h-6 flex items-center justify-center text-xs font-medium border-b border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100"
                          onClick={() => selectColumn(i)}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    
                    {/* Main grid */}
                    <div 
                      className="grid border border-gray-300"
                      style={{ 
                        gridTemplateColumns: `repeat(${gridSizeNumber}, 1fr)`,
                        gap: showGrid ? '1px' : '0px',
                        width: `${gridSizeNumber * 24}px`,
                        height: `${gridSizeNumber * 24}px`,
                        backgroundColor: showGrid ? '#e5e7eb' : 'transparent'
                      }}
                      ref={canvasRef}
                    >
                      {renderGrid()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Properties Panel */}
          <div className="w-56 bg-white border-l border-gray-200 p-3 flex-shrink-0">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-charcoal mb-3">Design Properties</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600">Dimensions</Label>
                    <p className="text-sm font-medium">{gridSizeNumber} × {gridSizeNumber}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-600">Total Blocks</Label>
                    <p className="text-sm font-medium">{gridSizeNumber * gridSizeNumber}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-600">Active Tool</Label>
                    <p className="text-sm font-medium capitalize">{activeTool}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-600">Selected Block</Label>
                    <p className="text-sm font-medium">
                      {QUILT_BLOCKS.traditional.find(b => b.pattern === selectedBlockType)?.name ||
                       QUILT_BLOCKS.modern.find(b => b.pattern === selectedBlockType)?.name ||
                       QUILT_BLOCKS.shapes.find(b => b.pattern === selectedBlockType)?.name ||
                       'None'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => {
                    addToHistory();
                    clearGrid();
                    clearSelection();
                  }}
                  variant="outline" 
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Design
                </Button>
                
                <Button 
                  onClick={() => window.print()}
                  variant="outline" 
                  className="w-full"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Template
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mini Map Overlay */}
        {renderMiniMap()}
      </div>
    </TooltipProvider>
  );
}