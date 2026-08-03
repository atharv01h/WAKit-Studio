// @ts-ignore
import { Handle, Position, useReactFlow } from 'reactflow';
import { MessageSquare, Zap, Image as ImageIcon, BarChart2, Shield, Clock, X, GitBranch, Hourglass, HelpCircle } from 'lucide-react';

const colorMap: any = {
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50', handle: 'bg-blue-500' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/50', handle: 'bg-emerald-500' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/50', handle: 'bg-purple-500' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/50', handle: 'bg-amber-500' },
  rose: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/50', handle: 'bg-rose-500' },
  slate: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/50', handle: 'bg-slate-500' }
};

const NodeWrapper = ({ id, children, title, icon: Icon, color, handles }: any) => {
  const { setNodes, setEdges } = useReactFlow();
  const c = colorMap[color];

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  return (
    <div className={`bg-slate-900/60 backdrop-blur-md border ${c.border} rounded-xl p-4 w-56 shadow-2xl relative group`}>
      {handles?.target && <Handle type="target" position={Position.Left} isConnectable={true} />}
      
      <button 
        onClick={handleDelete}
        className="absolute top-3 right-3 p-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
        title="Delete Node"
      >
        <X size={14} />
      </button>

      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10 pr-6">
        <div className={`p-1.5 rounded-md ${c.bg}`}>
          <Icon className={c.text} size={16} />
        </div>
        <strong className={`${c.text} text-sm font-semibold tracking-wide`}>{title}</strong>
      </div>
      
      <div className="flex flex-col gap-2">
        {children}
      </div>

      {handles?.source && <Handle type="source" position={Position.Right} isConnectable={true} />}
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div>
    <div className="text-[10px] text-slate-400 mb-1 uppercase font-bold tracking-wider">{label}</div>
    <input 
      type={type}
      className="w-full bg-slate-950/50 text-white border border-white/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-slate-600" 
      defaultValue={value} 
      onChange={onChange} 
      placeholder={placeholder}
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder }: any) => (
  <div>
    <div className="text-[10px] text-slate-400 mb-1 uppercase font-bold tracking-wider">{label}</div>
    <textarea 
      className="w-full bg-slate-950/50 text-white border border-white/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-slate-600 resize-none h-20" 
      defaultValue={value} 
      onChange={onChange} 
      placeholder={placeholder}
    />
  </div>
);

export const TriggerNode = ({ id, data }: any) => (
  <NodeWrapper id={id} title="Text Trigger" icon={Zap} color="blue" handles={{ source: true }}>
    <InputField label="If user says:" value={data.keyword} onChange={data.onChange} placeholder="e.g. ping" />
  </NodeWrapper>
);

export const ActionNode = ({ id, data }: any) => (
  <NodeWrapper id={id} title="Send Text" icon={MessageSquare} color="emerald" handles={{ target: true, source: true }}>
    <TextAreaField label="Message:" value={data.text} onChange={data.onChange} placeholder="e.g. Hello!\nHow are you?" />
  </NodeWrapper>
);

export const MediaNode = ({ id, data }: any) => (
  <NodeWrapper id={id} title="Send Media" icon={ImageIcon} color="purple" handles={{ target: true, source: true }}>
    <InputField label="Media URL:" value={data.url} onChange={data.onUrlChange} placeholder="https://..." />
    <InputField label="Caption (Optional):" value={data.caption} onChange={data.onCaptionChange} placeholder="Look at this!" />
  </NodeWrapper>
);

export const PollNode = ({ id, data }: any) => (
  <NodeWrapper id={id} title="Send Poll" icon={BarChart2} color="amber" handles={{ target: true, source: true }}>
    <InputField label="Question:" value={data.question} onChange={data.onQuestionChange} placeholder="Favorite color?" />
    <InputField label="Options (comma separated):" value={data.options} onChange={data.onOptionsChange} placeholder="Red, Blue, Green" />
  </NodeWrapper>
);

export const CronNode = ({ id, data }: any) => (
  <NodeWrapper id={id} title="Schedule (Cron)" icon={Clock} color="rose" handles={{ source: true }}>
    <InputField label="Cron Expression:" value={data.cron} onChange={data.onChange} placeholder="* * * * *" />
  </NodeWrapper>
);

export const RateLimitNode = ({ id, data }: any) => (
  <NodeWrapper id={id} title="Global Rate Limit" icon={Shield} color="slate" handles={{}}>
    <div className="text-xs text-slate-300 mb-2 leading-relaxed">Limits all incoming messages.</div>
    <InputField label="Max messages:" type="number" value={data.max} onChange={data.onMaxChange} placeholder="10" />
    <InputField label="Window (ms):" type="number" value={data.window} onChange={data.onWindowChange} placeholder="60000" />
  </NodeWrapper>
);

export const ConditionNode = ({ id, data }: any) => {
  const { setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-cyan-500/50 rounded-xl p-4 w-64 shadow-2xl relative group">
      <Handle type="target" position={Position.Left} isConnectable={true} />
      
      <button 
        onClick={handleDelete}
        className="absolute top-3 right-3 p-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
        title="Delete Node"
      >
        <X size={14} />
      </button>

      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10 pr-6">
        <div className="p-1.5 rounded-md bg-cyan-500/20">
          <GitBranch className="text-cyan-400" size={16} />
        </div>
        <strong className="text-cyan-400 text-sm font-semibold tracking-wide">Condition</strong>
      </div>
      
      <div className="flex flex-col gap-2 relative">
        <div className="text-[10px] text-slate-400 mb-1 uppercase font-bold tracking-wider">If message contains:</div>
        <input 
          className="w-full bg-slate-950/50 text-white border border-white/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600 mb-2" 
          defaultValue={data.keyword} 
          onChange={data.onChange} 
          placeholder="e.g. help"
        />
        <div className="flex justify-between items-center text-xs mt-2 px-1">
          <span className="text-rose-400 font-semibold">False</span>
          <span className="text-emerald-400 font-semibold">True</span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="true" style={{ top: 120 }} isConnectable={true} className="condition-handle-true" />
      <Handle type="source" position={Position.Right} id="false" style={{ top: 100 }} isConnectable={true} className="condition-handle-false" />
    </div>
  );
};

export const DelayNode = ({ id, data }: any) => (
  <NodeWrapper id={id} title="Wait (Delay)" icon={Hourglass} color="amber" handles={{ target: true, source: true }}>
    <InputField label="Delay (milliseconds):" type="number" value={data.ms} onChange={data.onChange} placeholder="2000" />
    <div className="text-[10px] text-amber-500 mt-1">Simulates typing pause</div>
  </NodeWrapper>
);

export const CatchAllNode = ({ id }: any) => (
  <NodeWrapper id={id} title="Catch-All (Fallback)" icon={HelpCircle} color="rose" handles={{ source: true }}>
    <div className="text-xs text-rose-300 leading-relaxed mb-2">Fires if NO other trigger matches the user's message.</div>
  </NodeWrapper>
);
