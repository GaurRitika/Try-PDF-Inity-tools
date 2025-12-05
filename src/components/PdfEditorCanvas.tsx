import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Type,
  Highlighter,
  Pencil,
  Square,
  Circle,
  ArrowRight,
  ImagePlus,
  RotateCw,
  Trash2,
  Download,
  ZoomIn,
  ZoomOut,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Undo,
  Palette,
} from "lucide-react";
import {
  Annotation,
  TextAnnotation,
  HighlightAnnotation,
  DrawAnnotation,
  ShapeAnnotation,
  ImageAnnotation,
  renderPageToCanvas,
  generateThumbnails,
  applyAnnotationsAndSave,
  downloadPdf,
  generateId,
} from "@/utils/pdfEditor";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Tool = "select" | "text" | "highlight" | "draw" | "rectangle" | "circle" | "arrow" | "image";

interface PdfEditorCanvasProps {
  pdfBytes: Uint8Array;
  pageCount: number;
  fileName: string;
}

interface SortablePageProps {
  id: string;
  pageIndex: number;
  thumbnail: string;
  isActive: boolean;
  isDeleted: boolean;
  rotation: number;
  onClick: () => void;
  onRotate: () => void;
  onDelete: () => void;
}

const SortablePage = ({ id, pageIndex, thumbnail, isActive, isDeleted, rotation, onClick, onRotate, onDelete }: SortablePageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDeleted) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all
        ${isActive ? "border-primary shadow-primary" : "border-border hover:border-primary/50"}
      `}
      onClick={onClick}
    >
      <div {...attributes} {...listeners} className="absolute top-1 left-1 z-10 p-1 bg-background/80 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
        <GripVertical className="w-3 h-3 text-muted-foreground" />
      </div>
      <div className="absolute top-1 right-1 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onRotate(); }}
          className="p-1 bg-background/80 rounded hover:bg-primary/20"
        >
          <RotateCw className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 bg-background/80 rounded hover:bg-destructive/20"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      <div style={{ transform: `rotate(${rotation}deg)` }} className="transition-transform">
        {thumbnail ? (
          <img src={thumbnail} alt={`Page ${pageIndex + 1}`} className="w-full h-auto" />
        ) : (
          <div className="w-full h-24 bg-secondary flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Loading...</span>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-background/80 text-center text-xs py-1">
        {pageIndex + 1}
      </div>
    </div>
  );
};

const PdfEditorCanvas = ({ pdfBytes, pageCount, fileName }: PdfEditorCanvasProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [tool, setTool] = useState<Tool>("select");
  const [color, setColor] = useState("#ff0000");
  const [fontSize, setFontSize] = useState(16);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [zoom, setZoom] = useState(1);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [pageOrder, setPageOrder] = useState<string[]>([]);
  const [deletedPages, setDeletedPages] = useState<number[]>([]);
  const [rotations, setRotations] = useState<{ [key: number]: number }>({});
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawPoints, setCurrentDrawPoints] = useState<{ x: number; y: number }[]>([]);
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null);
  const [tempShape, setTempShape] = useState<ShapeAnnotation | null>(null);
  const [highlightStart, setHighlightStart] = useState<{ x: number; y: number } | null>(null);
  const [tempHighlight, setTempHighlight] = useState<HighlightAnnotation | null>(null);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize page order
  useEffect(() => {
    setPageOrder(Array.from({ length: pageCount }, (_, i) => `page-${i}`));
  }, [pageCount]);

  // Generate thumbnails
  useEffect(() => {
    const loadThumbnails = async () => {
      const thumbs = await generateThumbnails(pdfBytes, pageCount);
      setThumbnails(thumbs);
    };
    loadThumbnails();
  }, [pdfBytes, pageCount]);

  // Render current page
  useEffect(() => {
    const renderPage = async () => {
      if (!canvasRef.current) return;
      const { canvas } = await renderPageToCanvas(pdfBytes, currentPage, 1.5 * zoom);
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        canvasRef.current.width = canvas.width;
        canvasRef.current.height = canvas.height;
        ctx.drawImage(canvas, 0, 0);
        
        // Draw annotations for current page
        drawAnnotations(ctx);
      }
    };
    renderPage();
  }, [pdfBytes, currentPage, zoom, annotations, tempShape, tempHighlight]);

  const drawAnnotations = (ctx: CanvasRenderingContext2D) => {
    const scale = 1.5 * zoom;
    const pageAnnotations = annotations.filter(a => a.pageIndex === currentPage);
    
    for (const ann of pageAnnotations) {
      switch (ann.type) {
        case "text":
          ctx.font = `${ann.fontSize * scale}px Arial`;
          ctx.fillStyle = ann.color;
          ctx.fillText(ann.text, ann.x * scale, ann.y * scale);
          break;
        case "highlight":
          ctx.fillStyle = ann.color + "4D"; // 30% opacity
          ctx.fillRect(ann.x * scale, ann.y * scale, ann.width * scale, ann.height * scale);
          break;
        case "draw":
          if (ann.points.length > 1) {
            ctx.strokeStyle = ann.color;
            ctx.lineWidth = ann.strokeWidth * scale;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(ann.points[0].x * scale, ann.points[0].y * scale);
            for (let i = 1; i < ann.points.length; i++) {
              ctx.lineTo(ann.points[i].x * scale, ann.points[i].y * scale);
            }
            ctx.stroke();
          }
          break;
        case "shape":
          ctx.strokeStyle = ann.color;
          ctx.lineWidth = ann.strokeWidth * scale;
          if (ann.shapeType === "rectangle") {
            ctx.strokeRect(ann.x * scale, ann.y * scale, ann.width * scale, ann.height * scale);
          } else if (ann.shapeType === "circle") {
            const radius = Math.min(ann.width, ann.height) / 2 * scale;
            ctx.beginPath();
            ctx.arc((ann.x + ann.width / 2) * scale, (ann.y + ann.height / 2) * scale, radius, 0, Math.PI * 2);
            ctx.stroke();
          } else if (ann.shapeType === "arrow") {
            ctx.beginPath();
            ctx.moveTo(ann.x * scale, ann.y * scale);
            ctx.lineTo((ann.x + ann.width) * scale, (ann.y + ann.height) * scale);
            ctx.stroke();
            // Arrowhead
            const angle = Math.atan2(ann.height, ann.width);
            const headLength = 15 * scale;
            const endX = (ann.x + ann.width) * scale;
            const endY = (ann.y + ann.height) * scale;
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
            ctx.stroke();
          }
          break;
        case "image":
          const img = new Image();
          img.src = ann.imageData;
          ctx.drawImage(img, ann.x * scale, ann.y * scale, ann.width * scale, ann.height * scale);
          break;
      }
    }
    
    // Draw temp shape
    if (tempShape) {
      ctx.strokeStyle = tempShape.color;
      ctx.lineWidth = tempShape.strokeWidth * scale;
      if (tempShape.shapeType === "rectangle") {
        ctx.strokeRect(tempShape.x * scale, tempShape.y * scale, tempShape.width * scale, tempShape.height * scale);
      } else if (tempShape.shapeType === "circle") {
        const radius = Math.min(tempShape.width, tempShape.height) / 2 * scale;
        ctx.beginPath();
        ctx.arc((tempShape.x + tempShape.width / 2) * scale, (tempShape.y + tempShape.height / 2) * scale, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (tempShape.shapeType === "arrow") {
        ctx.beginPath();
        ctx.moveTo(tempShape.x * scale, tempShape.y * scale);
        ctx.lineTo((tempShape.x + tempShape.width) * scale, (tempShape.y + tempShape.height) * scale);
        ctx.stroke();
      }
    }
    
    // Draw temp highlight
    if (tempHighlight) {
      ctx.fillStyle = tempHighlight.color + "4D";
      ctx.fillRect(tempHighlight.x * scale, tempHighlight.y * scale, tempHighlight.width * scale, tempHighlight.height * scale);
    }
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scale = 1.5 * zoom;
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    
    if (tool === "draw") {
      setIsDrawing(true);
      setCurrentDrawPoints([coords]);
    } else if (tool === "rectangle" || tool === "circle" || tool === "arrow") {
      setShapeStart(coords);
    } else if (tool === "highlight") {
      setHighlightStart(coords);
    } else if (tool === "text") {
      setTextPosition(coords);
    } else if (tool === "image") {
      fileInputRef.current?.click();
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    
    if (tool === "draw" && isDrawing) {
      setCurrentDrawPoints(prev => [...prev, coords]);
      // Immediately draw on canvas for smooth experience
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx && currentDrawPoints.length > 0) {
        const scale = 1.5 * zoom;
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth * scale;
        ctx.lineCap = "round";
        ctx.beginPath();
        const lastPoint = currentDrawPoints[currentDrawPoints.length - 1];
        ctx.moveTo(lastPoint.x * scale, lastPoint.y * scale);
        ctx.lineTo(coords.x * scale, coords.y * scale);
        ctx.stroke();
      }
    } else if (shapeStart && (tool === "rectangle" || tool === "circle" || tool === "arrow")) {
      const shapeType = tool as "rectangle" | "circle" | "arrow";
      setTempShape({
        id: "temp",
        type: "shape",
        shapeType,
        x: Math.min(shapeStart.x, coords.x),
        y: Math.min(shapeStart.y, coords.y),
        width: Math.abs(coords.x - shapeStart.x),
        height: Math.abs(coords.y - shapeStart.y),
        color,
        strokeWidth,
        pageIndex: currentPage,
      });
    } else if (highlightStart && tool === "highlight") {
      setTempHighlight({
        id: "temp",
        type: "highlight",
        x: Math.min(highlightStart.x, coords.x),
        y: Math.min(highlightStart.y, coords.y),
        width: Math.abs(coords.x - highlightStart.x),
        height: Math.abs(coords.y - highlightStart.y),
        color,
        pageIndex: currentPage,
      });
    }
  };

  const handleCanvasMouseUp = () => {
    if (tool === "draw" && currentDrawPoints.length > 1) {
      const newAnnotation: DrawAnnotation = {
        id: generateId(),
        type: "draw",
        points: currentDrawPoints,
        color,
        strokeWidth,
        pageIndex: currentPage,
      };
      setAnnotations(prev => [...prev, newAnnotation]);
    } else if (tempShape) {
      const newAnnotation: ShapeAnnotation = {
        ...tempShape,
        id: generateId(),
      };
      setAnnotations(prev => [...prev, newAnnotation]);
      setTempShape(null);
    } else if (tempHighlight) {
      const newAnnotation: HighlightAnnotation = {
        ...tempHighlight,
        id: generateId(),
      };
      setAnnotations(prev => [...prev, newAnnotation]);
      setTempHighlight(null);
    }
    
    setIsDrawing(false);
    setCurrentDrawPoints([]);
    setShapeStart(null);
    setHighlightStart(null);
  };

  const handleAddText = () => {
    if (textPosition && textInput.trim()) {
      const newAnnotation: TextAnnotation = {
        id: generateId(),
        type: "text",
        x: textPosition.x,
        y: textPosition.y,
        text: textInput,
        fontSize,
        color,
        pageIndex: currentPage,
      };
      setAnnotations(prev => [...prev, newAnnotation]);
      setTextInput("");
      setTextPosition(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 200;
          const scale = maxWidth / img.width;
          const newAnnotation: ImageAnnotation = {
            id: generateId(),
            type: "image",
            x: 50,
            y: 50,
            width: img.width * scale,
            height: img.height * scale,
            imageData: event.target?.result as string,
            pageIndex: currentPage,
          };
          setAnnotations(prev => [...prev, newAnnotation]);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPageOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const rotatePage = (pageIndex: number) => {
    setRotations(prev => ({
      ...prev,
      [pageIndex]: ((prev[pageIndex] || 0) + 90) % 360,
    }));
  };

  const deletePage = (pageIndex: number) => {
    if (pageCount - deletedPages.length <= 1) return;
    setDeletedPages(prev => [...prev, pageIndex]);
    if (currentPage === pageIndex) {
      const nextValidPage = pageOrder.findIndex((id, idx) => {
        const pIdx = parseInt(id.split("-")[1]);
        return !deletedPages.includes(pIdx) && pIdx !== pageIndex;
      });
      if (nextValidPage >= 0) {
        setCurrentPage(parseInt(pageOrder[nextValidPage].split("-")[1]));
      }
    }
  };

  const undoLastAnnotation = () => {
    setAnnotations(prev => prev.slice(0, -1));
  };

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const finalPageOrder = pageOrder.map(id => parseInt(id.split("-")[1]));
      const editedPdfBytes = await applyAnnotationsAndSave(
        pdfBytes,
        annotations,
        finalPageOrder,
        deletedPages,
        rotations
      );
      downloadPdf(editedPdfBytes, `edited_${fileName}`);
    } catch (error) {
      console.error("Error saving PDF:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: "select", icon: <ChevronRight className="w-4 h-4" />, label: "Select" },
    { id: "text", icon: <Type className="w-4 h-4" />, label: "Text" },
    { id: "highlight", icon: <Highlighter className="w-4 h-4" />, label: "Highlight" },
    { id: "draw", icon: <Pencil className="w-4 h-4" />, label: "Draw" },
    { id: "rectangle", icon: <Square className="w-4 h-4" />, label: "Rectangle" },
    { id: "circle", icon: <Circle className="w-4 h-4" />, label: "Circle" },
    { id: "arrow", icon: <ArrowRight className="w-4 h-4" />, label: "Arrow" },
    { id: "image", icon: <ImagePlus className="w-4 h-4" />, label: "Image" },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
      {/* Toolbar */}
      <div className="bg-secondary/50 border-b border-border p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tools */}
          <div className="flex items-center gap-1 p-1 bg-background rounded-lg">
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`p-2 rounded-md transition-all ${
                  tool === t.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
                title={t.label}
              >
                {t.icon}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-border mx-2" />

          {/* Color Picker */}
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0"
            />
          </div>

          {/* Stroke Width */}
          {(tool === "draw" || tool === "rectangle" || tool === "circle" || tool === "arrow") && (
            <div className="flex items-center gap-2 min-w-[120px]">
              <span className="text-xs text-muted-foreground">Size:</span>
              <Slider
                value={[strokeWidth]}
                onValueChange={([v]) => setStrokeWidth(v)}
                min={1}
                max={10}
                step={1}
                className="w-20"
              />
            </div>
          )}

          {/* Font Size */}
          {tool === "text" && (
            <div className="flex items-center gap-2 min-w-[120px]">
              <span className="text-xs text-muted-foreground">Size:</span>
              <Slider
                value={[fontSize]}
                onValueChange={([v]) => setFontSize(v)}
                min={8}
                max={72}
                step={2}
                className="w-20"
              />
            </div>
          )}

          <div className="h-6 w-px bg-border mx-2" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(2, z + 0.25))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <div className="h-6 w-px bg-border mx-2" />

          {/* Undo */}
          <Button
            variant="ghost"
            size="icon"
            onClick={undoLastAnnotation}
            disabled={annotations.length === 0}
            title="Undo last annotation"
          >
            <Undo className="w-4 h-4" />
          </Button>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            disabled={isProcessing}
            className="ml-auto gradient-primary shadow-primary"
          >
            <Download className="w-4 h-4 mr-2" />
            {isProcessing ? "Processing..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="flex h-[600px]">
        {/* Page Thumbnails Sidebar */}
        <div className={`bg-secondary/30 border-r border-border transition-all ${sidebarOpen ? "w-32" : "w-0"} overflow-hidden`}>
          <div className="p-2 space-y-2 h-full overflow-y-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={pageOrder}
                strategy={verticalListSortingStrategy}
              >
                {pageOrder.map((id) => {
                  const pageIndex = parseInt(id.split("-")[1]);
                  return (
                    <SortablePage
                      key={id}
                      id={id}
                      pageIndex={pageIndex}
                      thumbnail={thumbnails[pageIndex] || ""}
                      isActive={currentPage === pageIndex}
                      isDeleted={deletedPages.includes(pageIndex)}
                      rotation={rotations[pageIndex] || 0}
                      onClick={() => setCurrentPage(pageIndex)}
                      onRotate={() => rotatePage(pageIndex)}
                      onDelete={() => deletePage(pageIndex)}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Toggle Sidebar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-secondary rounded-r-lg p-1 hover:bg-secondary/80"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Canvas Area */}
        <div ref={containerRef} className="flex-1 overflow-auto p-4 flex items-start justify-center bg-muted/20">
          <div className="relative">
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              className="shadow-elevated rounded-lg cursor-crosshair"
              style={{ transform: `rotate(${rotations[currentPage] || 0}deg)` }}
            />
            
            {/* Text Input Popup */}
            {textPosition && tool === "text" && (
              <div
                className="absolute z-20 bg-card border border-border rounded-lg p-3 shadow-elevated"
                style={{
                  left: textPosition.x * 1.5 * zoom,
                  top: textPosition.y * 1.5 * zoom,
                }}
              >
                <Input
                  autoFocus
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text..."
                  className="mb-2 w-48"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddText();
                    if (e.key === "Escape") setTextPosition(null);
                  }}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddText}>Add</Button>
                  <Button size="sm" variant="ghost" onClick={() => setTextPosition(null)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="bg-secondary/50 border-t border-border p-3 flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {pageCount - deletedPages.length}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage(p => Math.min(pageCount - 1, p + 1))}
          disabled={currentPage >= pageCount - 1}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Hidden file input for images */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default PdfEditorCanvas;
