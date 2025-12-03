import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import CodeEditor from './components/CodeEditor';
import AIAssistant from './components/AIAssistant';
import { Shape, ShapeType, MachineSettings } from './types';
import { generateGCode } from './services/gcodeService';
import { generateShapesFromPrompt, explainGCode } from './services/geminiService';

const DEFAULT_SETTINGS: MachineSettings = {
  feedRate: 800,
  safeHeight: 5,
  cutDepth: 2,
  toolDiameter: 3.175
};

const App: React.FC = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [gcode, setGcode] = useState<string>('');
  const [isManualMode, setIsManualMode] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);

  // Auto-generate G-code when shapes change, unless in manual mode
  useEffect(() => {
    if (!isManualMode) {
      const code = generateGCode(shapes, DEFAULT_SETTINGS);
      setGcode(code);
    }
  }, [shapes, isManualMode]);

  const handleAddShape = (type: ShapeType) => {
    const id = uuidv4();
    let newShape: Shape;

    switch (type) {
      case ShapeType.RECTANGLE:
        newShape = { id, type, x: 50, y: 50, width: 50, height: 50 };
        break;
      case ShapeType.CIRCLE:
        newShape = { id, type, x: 100, y: 100, radius: 25 };
        break;
      case ShapeType.TEXT:
        newShape = { id, type, x: 50, y: 150, text: "CNC", fontSize: 24 };
        break;
      default:
        return;
    }

    setShapes(prev => [...prev, newShape]);
    setSelectedId(id);
  };

  const handleUpdateShape = (updatedShape: Shape) => {
    setShapes(prev => prev.map(s => s.id === updatedShape.id ? updatedShape : s));
  };

  const handleDeleteShape = (id: string) => {
    setShapes(prev => prev.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleCodeChange = (newCode: string) => {
    setGcode(newCode);
    setIsManualMode(true);
  };

  const handleRegenerate = () => {
    setIsManualMode(false);
    // The useEffect will trigger immediately after this state change
  };

  const handleAISubmit = async (prompt: string) => {
    setIsAILoading(true);
    try {
      const newShapes = await generateShapesFromPrompt(prompt, shapes);
      setShapes(newShapes);
      setIsAIModalOpen(false);
    } catch (error) {
      alert("Failed to generate shapes. Check console for details.");
    } finally {
      setIsAILoading(false);
    }
  };

  const handleExplainCode = async () => {
    if (!gcode) return;
    setIsAILoading(true); // Reuse loading state logic or add separate one if needed. reusing visual only.
    // For a better UX, we'd normally open a dialog. Here we'll just alert or console log for simplicity/token limits
    // But let's reuse the modal state concept or just show an alert. 
    // Let's create a temporary overlay or just put it in the G-code text for now as a comment? 
    // Better: alert it.
    
    // Actually, let's inject it into the code editor as a comment block at the top.
    try {
        const explanation = await explainGCode(gcode);
        const commentBlock = explanation.split('\n').map(l => `; ${l}`).join('\n');
        setGcode(`${commentBlock}\n\n${gcode}`);
        setIsManualMode(true);
    } catch (e) {
        console.error(e);
    } finally {
        setIsAILoading(false);
    }
  };

  const selectedShape = shapes.find(s => s.id === selectedId) || null;

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      <Toolbar onAddShape={handleAddShape} onOpenAI={() => setIsAIModalOpen(true)} />
      
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Canvas & Visuals */}
        <div className="flex-1 flex flex-col min-h-[50%] md:min-h-0 border-b md:border-b-0 md:border-r border-slate-700">
          <Canvas 
            shapes={shapes} 
            onUpdateShape={handleUpdateShape}
            onSelectShape={setSelectedId}
            selectedId={selectedId}
            onDeleteShape={handleDeleteShape}
          />
        </div>

        {/* Right Side: Controls & Code */}
        <div className="w-full md:w-[400px] flex flex-col bg-slate-800">
          <div className="h-1/2 border-b border-slate-700 overflow-y-auto custom-scrollbar">
            <PropertiesPanel shape={selectedShape} onChange={handleUpdateShape} />
            <div className="p-4 border-t border-slate-700">
                <h4 className="text-xs font-semibold text-slate-400 mb-2">Machine Settings (Global)</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>Feed: {DEFAULT_SETTINGS.feedRate} mm/min</div>
                    <div>Safe Z: {DEFAULT_SETTINGS.safeHeight} mm</div>
                    <div>Depth: {DEFAULT_SETTINGS.cutDepth} mm</div>
                    <div>Tool: {DEFAULT_SETTINGS.toolDiameter} mm</div>
                </div>
            </div>
          </div>
          <CodeEditor 
            code={gcode} 
            onChange={handleCodeChange} 
            onRegenerate={handleRegenerate}
            onExplain={handleExplainCode}
            isManualMode={isManualMode}
          />
        </div>
      </main>

      <AIAssistant 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        onSubmit={handleAISubmit}
        isLoading={isAILoading}
      />
    </div>
  );
};

export default App;
