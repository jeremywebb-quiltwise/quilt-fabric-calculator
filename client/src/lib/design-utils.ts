export interface BlockData {
  type: string;
  color: string;
  rotation?: number;
  pattern?: string;
}

export interface QuiltDesign {
  id?: number;
  name: string;
  gridSize: number;
  blocks: Record<number, BlockData>;
  colors: string[];
  createdAt?: string;
}

export function exportDesignToPDF(design: QuiltDesign): void {
  // Basic PDF generation - in a real app, you'd use a library like jsPDF
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;
  
  const cellSize = 20;
  const gridSize = design.gridSize;
  
  canvas.width = gridSize * cellSize;
  canvas.height = gridSize * cellSize;
  
  // Draw grid
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  
  for (let i = 0; i <= gridSize; i++) {
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.stroke();
    
    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }
  
  // Draw blocks
  Object.entries(design.blocks).forEach(([index, block]) => {
    const cellIndex = parseInt(index);
    const row = Math.floor(cellIndex / gridSize);
    const col = cellIndex % gridSize;
    
    const x = col * cellSize;
    const y = row * cellSize;
    
    ctx.fillStyle = block.color;
    ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
  });
  
  // Download the canvas as an image
  const link = document.createElement('a');
  link.download = `${design.name}.png`;
  link.href = canvas.toDataURL();
  link.click();
}

export function generateQuiltInstructions(design: QuiltDesign): string {
  const totalBlocks = Object.keys(design.blocks).length;
  const colors = design.colors;
  
  let instructions = `Quilt Pattern: ${design.name}\n`;
  instructions += `Grid Size: ${design.gridSize} x ${design.gridSize}\n`;
  instructions += `Total Blocks: ${totalBlocks}\n\n`;
  
  instructions += `Colors Used:\n`;
  colors.forEach((color, index) => {
    instructions += `Color ${index + 1}: ${color}\n`;
  });
  
  instructions += `\nCutting Instructions:\n`;
  instructions += `- Cut all blocks to 12.5" x 12.5" (includes 1/4" seam allowance)\n`;
  instructions += `- Arrange blocks according to the pattern shown\n`;
  instructions += `- Sew blocks together in rows\n`;
  instructions += `- Sew rows together to complete the quilt top\n`;
  
  return instructions;
}

export function validateDesign(design: QuiltDesign): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!design.name || design.name.trim().length === 0) {
    errors.push("Design must have a name");
  }
  
  if (design.gridSize < 4 || design.gridSize > 20) {
    errors.push("Grid size must be between 4 and 20");
  }
  
  if (Object.keys(design.blocks).length === 0) {
    errors.push("Design must contain at least one block");
  }
  
  if (design.colors.length === 0) {
    errors.push("Design must use at least one color");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function calculateQuiltDimensions(gridSize: number, blockSize: number = 12): {
  width: number;
  height: number;
  totalBlocks: number;
} {
  return {
    width: gridSize * blockSize,
    height: gridSize * blockSize,
    totalBlocks: gridSize * gridSize,
  };
}
