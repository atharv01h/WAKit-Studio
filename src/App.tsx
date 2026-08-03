import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  MiniMap,
  applyNodeChanges, 
  applyEdgeChanges,
  type Node,
  type Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import Editor from '@monaco-editor/react';
import { TriggerNode, ActionNode, MediaNode, PollNode, RateLimitNode, CronNode, ConditionNode, DelayNode, CatchAllNode } from './components/Nodes';
import { GuideModal, TemplatesModal } from './components/Modals';
import { generateWakitCode } from './engine/CodeGenerator';
import { templates } from './engine/templates';
import { exportBotProject } from './engine/Exporter';
import { Play, Code, Smartphone, Bot, Zap, MessageSquare, Image as ImageIcon, BarChart2, Shield, Clock, GitBranch, BookOpen, LayoutTemplate, Save, FolderOpen, Download, X, Hourglass, HelpCircle } from 'lucide-react';

function App() {
  const [nodes, setNodes] = useState<Node[]>(templates.simple.nodes);
  const [edges, setEdges] = useState<Edge[]>(templates.simple.edges);
  const [generatedCode, setGeneratedCode] = useState('');
  const [chatMessages, setChatMessages] = useState<{from: 'user' | 'bot', text: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const [isGuideOpen, setGuideOpen] = useState(false);
  const [isTemplatesOpen, setTemplatesOpen] = useState(false);

  const updateNodeData = (id: string, key: string, value: string) => {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, [key]: value } } : n));
  };

  const nodeTypes = useMemo(() => ({
    triggerNode: (props: any) => <TriggerNode {...props} data={{...props.data, onChange: (e: any) => updateNodeData(props.id, 'keyword', e.target.value)}} />,
    actionNode: (props: any) => <ActionNode {...props} data={{...props.data, onChange: (e: any) => updateNodeData(props.id, 'text', e.target.value)}} />,
    mediaNode: (props: any) => <MediaNode {...props} data={{...props.data, onUrlChange: (e: any) => updateNodeData(props.id, 'url', e.target.value), onCaptionChange: (e: any) => updateNodeData(props.id, 'caption', e.target.value)}} />,
    pollNode: (props: any) => <PollNode {...props} data={{...props.data, onQuestionChange: (e: any) => updateNodeData(props.id, 'question', e.target.value), onOptionsChange: (e: any) => updateNodeData(props.id, 'options', e.target.value)}} />,
    cronNode: (props: any) => <CronNode {...props} data={{...props.data, onChange: (e: any) => updateNodeData(props.id, 'cron', e.target.value)}} />,
    rateLimitNode: (props: any) => <RateLimitNode {...props} data={{...props.data, onMaxChange: (e: any) => updateNodeData(props.id, 'max', e.target.value), onWindowChange: (e: any) => updateNodeData(props.id, 'window', e.target.value)}} />,
    conditionNode: (props: any) => <ConditionNode {...props} data={{...props.data, onChange: (e: any) => updateNodeData(props.id, 'keyword', e.target.value)}} />,
    delayNode: (props: any) => <DelayNode {...props} data={{...props.data, onChange: (e: any) => updateNodeData(props.id, 'ms', e.target.value)}} />,
    catchAllNode: (props: any) => <CatchAllNode {...props} data={props.data} />
  }), []);

  const onNodesChange = useCallback((changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge({...params, animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 }}, eds)), []);
  
  const onEdgeClick = useCallback((_: any, edge: Edge) => {
    if (confirm('Delete this connection?')) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
  }, []);

  useEffect(() => {
    setGeneratedCode(generateWakitCode(nodes, edges));
  }, [nodes, edges]);

  const addNode = (type: string, initialData: any = {}) => {
    setNodes(nds => [...nds, { id: Date.now().toString(), type, position: { x: 100, y: 100 }, data: initialData }]);
  };

  const loadTemplate = (id: string) => {
    if (templates[id]) {
      setNodes(templates[id].nodes);
      setEdges(templates[id].edges);
    }
  };

  const handleSave = () => {
    localStorage.setItem('wakit-nodes', JSON.stringify(nodes));
    localStorage.setItem('wakit-edges', JSON.stringify(edges));
    alert('Bot flow saved locally!');
  };

  const handleLoad = () => {
    const savedNodes = localStorage.getItem('wakit-nodes');
    const savedEdges = localStorage.getItem('wakit-edges');
    if (savedNodes && savedEdges) {
      setNodes(JSON.parse(savedNodes));
      setEdges(JSON.parse(savedEdges));
    } else {
      alert('No saved flow found.');
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the canvas? This cannot be undone.')) {
      setNodes([]);
      setEdges([]);
    }
  };

  const handleExport = () => {
    exportBotProject(generatedCode);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim().toLowerCase();
    setChatMessages(prev => [...prev, { from: 'user', text: inputValue }]);
    setInputValue('');

    setTimeout(async () => {
      const processNodeTree = async (nodeId: string, handleId: string | null, visited: Set<string>) => {
        if (visited.has(nodeId)) {
          console.warn('Cycle detected, aborting loop at node:', nodeId);
          return;
        }
        visited.add(nodeId);

        const outEdges = edges.filter(edg => edg.source === nodeId && (handleId ? edg.sourceHandle === handleId : true));
        for (const edge of outEdges) {
          const actionNode = nodes.find(n => n.id === edge.target);
          if (!actionNode) continue;
          
          if (actionNode.type === 'actionNode') {
            setChatMessages(prev => [...prev, { from: 'bot', text: actionNode.data.text || '' }]);
            await processNodeTree(actionNode.id, null, new Set(visited));
          } else if (actionNode.type === 'mediaNode') {
            setChatMessages(prev => [...prev, { from: 'bot', text: `[Image/Video] ${actionNode.data.caption || ''}` }]);
            await processNodeTree(actionNode.id, null, new Set(visited));
          } else if (actionNode.type === 'pollNode') {
            setChatMessages(prev => [...prev, { from: 'bot', text: `[Poll: ${actionNode.data.question}] Options: ${actionNode.data.options}` }]);
            await processNodeTree(actionNode.id, null, new Set(visited));
          } else if (actionNode.type === 'delayNode') {
            const ms = parseInt(actionNode.data.ms) || 0;
            if (ms > 0) {
              await new Promise(r => setTimeout(r, ms));
            }
            await processNodeTree(actionNode.id, null, new Set(visited));
          } else if (actionNode.type === 'conditionNode') {
            const keyword = (actionNode.data.keyword || '').toLowerCase();
            if (userText.includes(keyword)) {
              await processNodeTree(actionNode.id, 'true', new Set(visited));
            } else {
              await processNodeTree(actionNode.id, 'false', new Set(visited));
            }
          }
        }
      };

      const triggers = nodes.filter(n => n.type === 'triggerNode');
      let matchedAny = false;
      for (const trigger of triggers) {
        const triggerKeyword = (trigger.data.keyword || '').toLowerCase();
        if (triggerKeyword && userText.startsWith(triggerKeyword)) {
          matchedAny = true;
          await processNodeTree(trigger.id, null, new Set());
        }
      }

      if (!matchedAny) {
        const catchAlls = nodes.filter(n => n.type === 'catchAllNode');
        for (const catchAll of catchAlls) {
          await processNodeTree(catchAll.id, null, new Set());
        }
      }
    }, 500);
  };

  return (
    <div className="flex h-screen bg-[#0b0f19] text-white flex-col font-sans overflow-hidden bg-grid-pattern">
      
      {/* HEADER TOP ROW (Branding & Global Actions) */}
      <header className="h-14 bg-slate-900/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-tr from-emerald-500 to-cyan-400 rounded-lg shadow-lg shadow-emerald-500/20">
            <Bot className="text-white" size={20} />
          </div>
          <div className="flex flex-col leading-none">
            <h1 className="font-bold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">WAKit Studio</h1>
            <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest mt-0.5">Perfect Edition</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={handleSave} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-white/10 font-medium text-slate-200">
            <Save size={14} /> Save
          </button>
          <button onClick={handleLoad} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-white/10 font-medium text-slate-200">
            <FolderOpen size={14} /> Load
          </button>
          <button onClick={handleClear} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition border border-red-500/20 font-medium">
            <X size={14} /> Clear
          </button>
          <div className="w-px h-5 bg-white/10 mx-2"></div>
          <button onClick={() => setTemplatesOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-white/10 font-medium text-slate-200">
            <LayoutTemplate size={14} /> Templates
          </button>
          <button onClick={() => setGuideOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 rounded-lg transition font-medium">
            <BookOpen size={14} /> Guide
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition font-medium shadow-lg shadow-emerald-500/20 ml-2">
            <Download size={14} /> Export ZIP
          </button>
        </div>
      </header>

      {/* HEADER BOTTOM ROW (Node Palette) */}
      <div className="h-12 bg-slate-900/60 backdrop-blur-md border-b border-white/5 flex items-center px-6 z-10">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mr-4">Add Nodes</span>
        <div className="flex items-center gap-1.5">
          <button onClick={() => addNode('triggerNode', { keyword: '' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-transparent hover:bg-blue-500/20 text-blue-400 rounded-lg transition font-medium"><Zap size={14} /> Trigger</button>
          <button onClick={() => addNode('catchAllNode', {})} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-transparent hover:bg-rose-500/20 text-rose-400 rounded-lg transition font-medium"><HelpCircle size={14} /> Any Msg</button>
          <button onClick={() => addNode('conditionNode', { keyword: '' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-transparent hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition font-medium"><GitBranch size={14} /> Condition</button>
          <div className="w-px h-4 bg-white/10 mx-1"></div>
          <button onClick={() => addNode('actionNode', { text: '' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-transparent hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition font-medium"><MessageSquare size={14} /> Text</button>
          <button onClick={() => addNode('mediaNode', { url: '', caption: '' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-transparent hover:bg-purple-500/20 text-purple-400 rounded-lg transition font-medium"><ImageIcon size={14} /> Media</button>
          <button onClick={() => addNode('pollNode', { question: '', options: '' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-transparent hover:bg-amber-500/20 text-amber-400 rounded-lg transition font-medium"><BarChart2 size={14} /> Poll</button>
          <div className="w-px h-4 bg-white/10 mx-1"></div>
          <button onClick={() => addNode('delayNode', { ms: '2000' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-transparent hover:bg-amber-500/20 text-amber-400 rounded-lg transition font-medium"><Hourglass size={14} /> Wait</button>
          <button onClick={() => addNode('cronNode', { cron: '' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-transparent hover:bg-rose-500/20 text-rose-400 rounded-lg transition font-medium"><Clock size={14} /> Cron</button>
          <button onClick={() => addNode('rateLimitNode', { max: '10', window: '60000' })} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-transparent hover:bg-slate-500/20 text-slate-300 rounded-lg transition font-medium"><Shield size={14} /> Limit</button>
        </div>
      </div>

      {/* MODALS */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setGuideOpen(false)} />
      <TemplatesModal isOpen={isTemplatesOpen} onClose={() => setTemplatesOpen(false)} onSelectTemplate={loadTemplate} />

      {/* MAIN WORKSPACE */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT: VISUAL BUILDER */}
        <div className="flex-1 relative border-r border-white/10">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#ffffff" gap={20} size={1} className="opacity-5" />
            <Controls style={{ backgroundColor: '#1e293b', fill: '#fff', border: 'none' }} />
            <MiniMap 
              nodeStrokeColor="#475569" 
              nodeColor="#0f172a" 
              maskColor="rgba(0,0,0,0.6)" 
              style={{ backgroundColor: '#1e293b', borderRadius: '8px' }}
            />
          </ReactFlow>
        </div>

        {/* RIGHT: SPLIT PANE */}
        <div className="w-[450px] flex flex-col bg-[#0b0f19] z-10 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.5)]">
          
          {/* SIMULATOR */}
          <div className="flex-1 border-b border-white/10 flex flex-col relative overflow-hidden bg-slate-900/40 backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-50"></div>
            <div className="px-5 py-3 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <Smartphone size={16} className="text-emerald-400" />
                <h2 className="text-sm font-semibold tracking-wide">Live Simulator</h2>
              </div>
              {chatMessages.length > 0 && (
                <button 
                  onClick={() => setChatMessages([])} 
                  className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 relative">
              {chatMessages.length === 0 && (
                <div className="text-center text-xs text-slate-500 mt-10 bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-3 self-center shadow-lg">
                  Type a trigger message below to test your flow!
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-md animate-in slide-in-from-bottom-2 ${msg.from === 'user' ? 'bg-gradient-to-br from-emerald-600 to-cyan-600 self-end rounded-tr-sm' : 'bg-slate-800 border border-white/5 self-start rounded-tl-sm text-slate-200'}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-white/5 flex gap-2">
              <input 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-950/50 text-white border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
              />
              <button type="submit" className="p-2 bg-emerald-500 rounded-xl hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20">
                <Play size={18} fill="white" className="ml-0.5" />
              </button>
            </form>
          </div>

          {/* CODE EXPORT */}
          <div className="flex-1 flex flex-col bg-slate-950 relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-50"></div>
             <div className="px-5 py-3 flex items-center justify-between border-b border-white/5 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Code size={16} className="text-blue-400" />
                <h2 className="text-sm font-semibold tracking-wide">Generated WAKit Code</h2>
              </div>
              <button onClick={() => navigator.clipboard.writeText(generatedCode)} className="text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg transition">Copy Code</button>
            </div>
            <div className="flex-1 relative p-2">
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={generatedCode}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  padding: { top: 16 },
                  renderLineHighlight: 'none'
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
