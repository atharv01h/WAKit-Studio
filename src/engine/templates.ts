import type { Node, Edge } from 'reactflow';

export const templates: Record<string, { nodes: Node[], edges: Edge[] }> = {
  ecommerce: {
    nodes: [
      { id: '1', type: 'triggerNode', position: { x: 50, y: 150 }, data: { keyword: 'store' } },
      { id: '2', type: 'actionNode', position: { x: 350, y: 150 }, data: { text: 'Welcome to MegaStore! To browse, type "search phones" or "search jackets".' } },
      { id: '3', type: 'triggerNode', position: { x: 50, y: 350 }, data: { keyword: 'search' } },
      { id: '4', type: 'conditionNode', position: { x: 350, y: 350 }, data: { keyword: 'phones' } },
      { id: '5', type: 'conditionNode', position: { x: 650, y: 450 }, data: { keyword: 'jackets' } },
      { id: '6', type: 'actionNode', position: { x: 650, y: 250 }, data: { text: 'We have Smartphones and Laptops. Visit our site: megastore.com/tech' } },
      { id: '7', type: 'mediaNode', position: { x: 950, y: 250 }, data: { url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661', caption: 'Check out the latest tech!' } },
      { id: '8', type: 'actionNode', position: { x: 950, y: 450 }, data: { text: 'We have Summer wear and Winter jackets. Visit megastore.com/clothes' } },
      { id: '9', type: 'mediaNode', position: { x: 1250, y: 450 }, data: { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050', caption: 'Fresh summer collection out now!' } },
      { id: '10', type: 'actionNode', position: { x: 950, y: 600 }, data: { text: 'Sorry, we couldn\'t find that item in our store.' } },
      { id: '11', type: 'rateLimitNode', position: { x: 50, y: 550 }, data: { max: '20', window: '60000' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#10b981' } },
      { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#0ea5e9' } },
      { id: 'e4-6', source: '4', sourceHandle: 'true', target: '6', animated: true, style: { stroke: '#10b981' } },
      { id: 'e6-7', source: '6', target: '7', animated: true, style: { stroke: '#10b981' } },
      { id: 'e4-5', source: '4', sourceHandle: 'false', target: '5', animated: true, style: { stroke: '#f43f5e' } },
      { id: 'e5-8', source: '5', sourceHandle: 'true', target: '8', animated: true, style: { stroke: '#10b981' } },
      { id: 'e8-9', source: '8', target: '9', animated: true, style: { stroke: '#10b981' } },
      { id: 'e5-10', source: '5', sourceHandle: 'false', target: '10', animated: true, style: { stroke: '#f43f5e' } }
    ]
  },
  support: {
    nodes: [
      { id: '1', type: 'triggerNode', position: { x: 50, y: 250 }, data: { keyword: 'help' } },
      { id: '3', type: 'conditionNode', position: { x: 350, y: 250 }, data: { keyword: 'sales' } },
      { id: '4', type: 'conditionNode', position: { x: 650, y: 450 }, data: { keyword: 'technical' } },
      { id: '5', type: 'conditionNode', position: { x: 950, y: 650 }, data: { keyword: 'billing' } },
      { id: '6', type: 'actionNode', position: { x: 650, y: 150 }, data: { text: 'Transferring you to Sales team... Please hold.' } },
      { id: '7', type: 'actionNode', position: { x: 950, y: 350 }, data: { text: 'Have you tried turning it off and on again?' } },
      { id: '8', type: 'actionNode', position: { x: 1250, y: 550 }, data: { text: 'You can view invoices at portal.company.com/billing' } },
      { id: '9', type: 'actionNode', position: { x: 1250, y: 750 }, data: { text: 'Welcome to Help Desk. Type "help sales", "help technical", or "help billing".' } }
    ],
    edges: [
      { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#6366f1' } },
      { id: 'e3-6', source: '3', sourceHandle: 'true', target: '6', animated: true, style: { stroke: '#10b981' } },
      { id: 'e3-4', source: '3', sourceHandle: 'false', target: '4', animated: true, style: { stroke: '#f43f5e' } },
      { id: 'e4-7', source: '4', sourceHandle: 'true', target: '7', animated: true, style: { stroke: '#10b981' } },
      { id: 'e4-5', source: '4', sourceHandle: 'false', target: '5', animated: true, style: { stroke: '#f43f5e' } },
      { id: 'e5-8', source: '5', sourceHandle: 'true', target: '8', animated: true, style: { stroke: '#10b981' } },
      { id: 'e5-9', source: '5', sourceHandle: 'false', target: '9', animated: true, style: { stroke: '#f43f5e' } }
    ]
  },
  quiz: {
    nodes: [
      { id: '1', type: 'triggerNode', position: { x: 50, y: 50 }, data: { keyword: 'quiz' } },
      { id: '2', type: 'pollNode', position: { x: 350, y: 50 }, data: { question: 'What is the capital of France?', options: 'Paris, London, Rome' } },
      { id: '3', type: 'triggerNode', position: { x: 50, y: 250 }, data: { keyword: 'paris' } },
      { id: '4', type: 'actionNode', position: { x: 350, y: 250 }, data: { text: 'Correct! 🎉 Paris is the capital.' } },
      { id: '5', type: 'triggerNode', position: { x: 50, y: 400 }, data: { keyword: 'london' } },
      { id: '6', type: 'actionNode', position: { x: 350, y: 400 }, data: { text: 'Wrong! Try again.' } },
      { id: '7', type: 'triggerNode', position: { x: 50, y: 550 }, data: { keyword: 'rome' } },
      { id: '8', type: 'actionNode', position: { x: 350, y: 550 }, data: { text: 'Wrong! Try again.' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#f59e0b' } },
      { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#10b981' } },
      { id: 'e5-6', source: '5', target: '6', animated: true, style: { stroke: '#f43f5e' } },
      { id: 'e7-8', source: '7', target: '8', animated: true, style: { stroke: '#f43f5e' } }
    ]
  },
  meme: {
    nodes: [
      { id: '1', type: 'cronNode', position: { x: 50, y: 50 }, data: { cron: '0 12 * * 5' } },
      { id: '2', type: 'triggerNode', position: { x: 50, y: 250 }, data: { keyword: 'meme' } },
      { id: '3', type: 'actionNode', position: { x: 350, y: 150 }, data: { text: 'Here is your meme!' } },
      { id: '4', type: 'mediaNode', position: { x: 650, y: 150 }, data: { url: 'https://i.imgflip.com/1ur9b0.jpg', caption: 'Programmer humor' } },
      { id: '5', type: 'rateLimitNode', position: { x: 50, y: 450 }, data: { max: '100', window: '86400000' } }
    ],
    edges: [
      { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#ec4899' } },
      { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#3b82f6' } },
      { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#d946ef' } }
    ]
  },
  simple: {
    nodes: [
      { id: '1', type: 'triggerNode', position: { x: 50, y: 150 }, data: { keyword: 'ping' } },
      { id: '2', type: 'actionNode', position: { x: 350, y: 150 }, data: { text: 'pong!' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#10b981' } }
    ]
  }
};
