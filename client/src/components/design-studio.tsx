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
import QuiltBlock from "@/components/quilt-block";
import QuiltBlockPattern from "@/components/quilt-block-pattern";
import { 
  Save, Printer, Trash2, Palette, RotateCcw, RotateCw, Undo, Redo, Copy, Layers, 
  Download, Upload, Zap, Grid, Move, MousePointer, ZoomIn, ZoomOut, FlipHorizontal, 
  FlipVertical, Eye, EyeOff, Plus, Minus, RotateCcw as Rotate90, FileText, 
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

// Fabric texture patterns (for future fabric support)
const FABRIC_TEXTURES = [
  { id: "solid", name: "Solid", pattern: "solid" },
  { id: "cotton", name: "Cotton", pattern: "cotton" },
  { id: "linen", name: "Linen", pattern: "linen" },
  { id: "batik", name: "Batik", pattern: "batik" },
];

export default function DesignStudio() {
  // Core design state
  const [gridSize, setGridSize] = useState("12");
  const [selectedColor, setSelectedColor] = useState("#8B4B3C");
  const [secondaryColor, setSecondaryColor] = useState("#F7F5F3");
  const [selectedBlockType, setSelectedBlockType] = useState("ninePatch");
  const [activeTool, setActiveTool] = useState("paint");
  const [selectedPalette, setSelectedPalette] = useState("warm");
  
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
    // For now, return the same pattern. In a real app, you'd have flipped versions
    return pattern + "_flipped_h";
  };

  const flipBlockVertical = (pattern: string) => {
    // For now, return the same pattern. In a real app, you'd have flipped versions
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

  const handleCellClick = (index: number, event?: React.MouseEvent) => {
    const isCtrlClick = event?.ctrlKey || event?.metaKey;
    
    if (activeTool === "select") {
      selectCell(index, isCtrlClick);
    } else if (activeTool === "paint") {
      addToHistory();
      updateCell(index, {
        type: selectedBlockType,
        color: selectedColor,
        secondaryColor: secondaryColor,
        isEmpty: false,
        rotation: 0
      });
      setIsUnsaved(true);
    } else if (activeTool === "fill") {
      addToHistory();
      fillConnectedCells(index);
      setIsUnsaved(true);
    } else if (activeTool === "eyedropper") {
      const cellData = grid[index];
      if (cellData && !cellData.isEmpty) {
        setSelectedBlockType(cellData.type);
        setSelectedColor(cellData.color);
        if (cellData.secondaryColor) {
          setSecondaryColor(cellData.secondaryColor);
        }
      }
    }
  };

  const fillConnectedCells = (startIndex: number) => {
    // Simple flood fill implementation
    const visited = new Set();
    const stack = [startIndex];
    const originalCell = grid[startIndex];
    
    while (stack.length > 0) {
      const currentIndex = stack.pop();
      if (visited.has(currentIndex)) continue;
      
      visited.add(currentIndex);
      updateCell(currentIndex, {
        type: selectedBlockType,
        color: selectedColor,
        isEmpty: false
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
    updateCell(index, {
      type: blockType,
      color: selectedColor,
      isEmpty: false
    });
    addToHistory();
  };

  const exportDesign = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = 50;
    
    canvas.width = gridSizeNumber * cellSize;
    canvas.height = gridSizeNumber * cellSize;
    
    for (let i = 0; i < gridSizeNumber * gridSizeNumber; i++) {
      const cellData = grid[i];
      const row = Math.floor(i / gridSizeNumber);
      const col = i % gridSizeNumber;
      
      if (cellData && !cellData.isEmpty) {
        ctx.fillStyle = cellData.color;
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
      
      // Draw grid lines
      if (showGrid) {
        ctx.strokeStyle = '#e5e5e5';
        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
    
    // Download the image
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  // Enhanced export functionality with high-res PNG and PDF support
  const exportDesignToHighResPNG = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const cellSize = 100; // High resolution
    canvas.width = gridSizeNumber * cellSize;
    canvas.height = gridSizeNumber * cellSize;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < gridSizeNumber * gridSizeNumber; i++) {
      const cellData = grid[i];
      const row = Math.floor(i / gridSizeNumber);
      const col = i % gridSizeNumber;
      
      if (cellData && !cellData.isEmpty) {
        ctx.fillStyle = cellData.color;
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        
        // Add secondary color if applicable
        if (cellData.secondaryColor) {
          ctx.fillStyle = cellData.secondaryColor;
          // Simple pattern overlay (could be enhanced)
          ctx.fillRect(col * cellSize + cellSize/4, row * cellSize + cellSize/4, cellSize/2, cellSize/2);
        }
      }
      
      // Draw grid lines
      if (showGrid) {
        ctx.strokeStyle = '#e5e5e5';
        ctx.lineWidth = 1;
        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
    
    // Download the image
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
          onContextMenu={(e) => {
            e.preventDefault();
            if (cellData && !cellData.isEmpty) {
              selectCell(i);
            }
          }}
        >
          {cellData && !cellData.isEmpty ? (
            <QuiltBlockPattern
              pattern={cellData.type}
              primaryColor={cellData.color}
              secondaryColor={cellData.secondaryColor || "#F7F5F3"}
              size={Math.min(600, window.innerWidth - 400) / gridSizeNumber}
            />
          ) : (
            <div className="w-full h-full bg-white"></div>
          )}
          
          {/* Selection indicator */}
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
    
    const miniSize = 4;
    const totalCells = gridSizeNumber * gridSizeNumber;
    const miniCells = [];
    
    for (let i = 0; i < totalCells; i++) {
      const cellData = grid[i];
      miniCells.push(
        <div
          key={i}
          className="w-1 h-1"
          style={{
            backgroundColor: cellData && !cellData.isEmpty ? cellData.color : '#f5f5f5'
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
      <div className="h-screen flex flex-col bg-gray-50 relative">
        {/* Enhanced Top Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section - Project & File Operations */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Input
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    setIsUnsaved(true);
                  }}
                  className="text-lg font-semibold border-none shadow-none p-0 h-auto focus-visible:ring-0 min-w-[200px]"
                />
                {isUnsaved && <Badge variant="outline" className="text-orange-600">Unsaved</Badge>}
              </div>
              
              {/* File Operations */}
              <div className="flex items-center space-x-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={createNewProject}>
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>New Project</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={saveProject}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save Project</TooltipContent>
                </Tooltip>
                
                <Select onValueChange={(value) => {
                  const project = savedProjects.find(p => p.id === value);
                  if (project) loadProject(project);
                }}>
                  <SelectTrigger className="w-32">
                    <Folder className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Load" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedProjects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Center Section - Tools */}
            <div className="flex items-center space-x-4">
              {/* Tool Selection */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                {TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Tooltip key={tool.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={activeTool === tool.id ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setActiveTool(tool.id)}
                          className={activeTool === tool.id ? "bg-terracotta text-white" : ""}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{tool.tooltip}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
              
              {/* Block Transform Tools */}
              {selectedCells.size > 0 && (
                <div className="flex items-center space-x-1 border-l pl-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={rotateSelectedBlocks}>
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Rotate 90°</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={flipSelectedBlocksHorizontal}>
                        <FlipHorizontal className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Flip Horizontal</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={flipSelectedBlocksVertical}>
                        <FlipVertical className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Flip Vertical</TooltipContent>
                  </Tooltip>
                  
                  <Badge variant="secondary">{selectedCells.size} selected</Badge>
                </div>
              )}
              
              {/* History Controls */}
              <div className="flex items-center space-x-1 border-l pl-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
                      <Undo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
                      <Redo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo</TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            {/* Right Section - View & Export Controls */}
            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleZoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom Out</TooltipContent>
                </Tooltip>
                
                <div className="w-20 text-center">
                  <Button variant="ghost" size="sm" onClick={resetZoom} className="text-xs">
                    {zoom[0]}%
                  </Button>
                </div>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleZoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom In</TooltipContent>
                </Tooltip>
              </div>
              
              {/* View Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGrid(!showGrid)}
                    className={showGrid ? "bg-gray-100" : ""}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle Grid</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMiniMap(!showMiniMap)}
                    className={showMiniMap ? "bg-gray-100" : ""}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle Mini Map</TooltipContent>
              </Tooltip>
              
              {/* Export Options */}
              <Select onValueChange={(value) => {
                if (value === "png") exportDesign();
                if (value === "high-res") exportDesignToHighResPNG();
                if (value === "print") window.print();
              }}>
                <SelectTrigger className="w-32">
                  <Download className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">Export PNG</SelectItem>
                  <SelectItem value="high-res">High-Res PNG</SelectItem>
                  <SelectItem value="print">Print Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
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
                <div>
                  <Label className="text-sm font-semibold">Color Palettes</Label>
                  <Select value={selectedPalette} onValueChange={setSelectedPalette}>
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warm">Warm Tones</SelectItem>
                      <SelectItem value="cool">Cool Tones</SelectItem>
                      <SelectItem value="earth">Earth Tones</SelectItem>
                      <SelectItem value="jewel">Jewel Tones</SelectItem>
                      <SelectItem value="pastels">Pastels</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-6 gap-2">
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
                
                <div>
                  <Label className="text-sm font-semibold">Custom Color</Label>
                  <Input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full h-10 mt-2"
                  />
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
          
          {/* Canvas */}
          <div className="flex-1 p-8 overflow-auto bg-gray-100">
            <div className="flex items-center justify-center min-h-full">
              <div 
                className="bg-white shadow-xl rounded-lg p-8 max-w-4xl mx-auto"
                style={{ transform: `scale(${zoom[0] / 100})` }}
              >
                <div 
                  className="grid mx-auto border border-gray-300"
                  style={{ 
                    gridTemplateColumns: `repeat(${gridSizeNumber}, 1fr)`,
                    gap: showGrid ? '1px' : '0px',
                    width: `${Math.min(600, window.innerWidth - 400)}px`,
                    height: `${Math.min(600, window.innerWidth - 400)}px`,
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
        
        {/* Right Properties Panel */}
        <div className="w-64 bg-white border-l border-gray-200 p-4">
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
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={clearGrid}
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
    </div>
  );
}
