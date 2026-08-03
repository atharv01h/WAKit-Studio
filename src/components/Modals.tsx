// @ts-ignore
import { X, BookOpen, LayoutTemplate, CheckCircle2 } from 'lucide-react';

const ModalWrapper = ({ isOpen, onClose, title, icon: Icon, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Icon className="text-emerald-400" size={20} />
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const GuideModal = ({ isOpen, onClose }: any) => (
  <ModalWrapper isOpen={isOpen} onClose={onClose} title="WAKit Studio Guide" icon={BookOpen}>
    <div className="space-y-4 text-sm text-slate-300">
      <p>Welcome to <strong>WAKit Studio</strong>! This visual builder helps you create WhatsApp bots powered by the open-source <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-400">@atharvh01/wakit</code> library.</p>
      
      <div className="space-y-2">
        <h3 className="text-white font-semibold flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400"/> Triggers</h3>
        <p className="pl-6">Start your flow with a Trigger (like matching a specific text keyword) or a Cron Node for scheduled tasks.</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-white font-semibold flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-400"/> Actions</h3>
        <p className="pl-6">Connect triggers to Actions to send Text, Media, or Polls back to the user.</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-white font-semibold flex items-center gap-2"><CheckCircle2 size={16} className="text-slate-400"/> Global Configs</h3>
        <p className="pl-6">Add nodes like Rate Limit anywhere on the canvas to configure global bot middleware automatically.</p>
      </div>
      
      <div className="mt-6 p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg text-emerald-300">
        <strong>Tip:</strong> You can test basic text flows instantly in the Simulator pane on the right!
      </div>
    </div>
  </ModalWrapper>
);

export const TemplatesModal = ({ isOpen, onClose, onSelectTemplate }: any) => {
  const templates = [
    { id: 'ecommerce', name: 'Mega E-Commerce Bot', desc: 'A huge professional bot with category routing, images, and polling.' },
    { id: 'support', name: 'Advanced Support Desk', desc: 'Uses multiple condition nodes to route users to Sales, Technical, or Billing.' },
    { id: 'quiz', name: 'Fully Interactive Quiz', desc: 'An interactive trivia bot that grades responses statelessly.' },
    { id: 'meme', name: 'Scheduled Meme Sender (Fun)', desc: 'Sends memes on a Cron schedule, or instantly via the "meme" trigger.' },
    { id: 'simple', name: 'Simple Ping-Pong Bot', desc: 'A basic trigger and text response flow.' }
  ];

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Select a Template" icon={LayoutTemplate}>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {templates.map(t => (
          <button 
            key={t.id}
            onClick={() => {
              onSelectTemplate(t.id);
              onClose();
            }}
            className="w-full text-left p-3 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-emerald-500/50 transition group"
          >
            <div className="font-semibold text-white group-hover:text-emerald-400 transition">{t.name}</div>
            <div className="text-xs text-slate-400 mt-1">{t.desc}</div>
          </button>
        ))}
      </div>
    </ModalWrapper>
  );
};
