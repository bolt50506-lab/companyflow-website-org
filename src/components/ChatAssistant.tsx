import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, X, LoaderCircle, CalendarDays, ClipboardList, ArrowLeft } from 'lucide-react';

const WEB3FORMS_ACCESS_KEY = '60cc8168-551e-4b8c-9b6b-b89d6f9c1e23';

type Message = { role: 'user' | 'assistant'; content: string };
type ChatMode = 'chat' | 'lead' | 'booking';
const START: Message[] = [{ role: 'assistant', content: "Hi, I'm the CompanyFlow assistant. Ask me about our software, websites, ecommerce, ERP/CRM, or how to start a project." }];

function quickAnswer(input: string): string {
  const q = input.toLowerCase();
  if (/price|cost|budget|quote|how much/.test(q)) return 'Project costs depend on scope, integrations, and delivery needs. Share a short brief through our contact page or WhatsApp and the team can discuss a suitable approach.';
  if (/website|web design|landing|ecommerce|e-commerce|shopify|store/.test(q)) return 'CompanyFlow can help with business websites, landing pages, ecommerce stores, and tailored customer experiences. Tell us what you sell and what your site needs to achieve.';
  if (/erp|crm|software|dashboard|system|automation|ai/.test(q)) return 'We work on custom business software, ERP and CRM workflows, dashboards, integrations, and automation. The best starting point is the process you want to make simpler.';
  if (/process|how.*work|start|begin|timeline/.test(q)) return 'We start by understanding the business problem, agree on scope and priorities, then design, build, test, and prepare the product for handover. Send us a brief to discuss your specific project.';
  if (/job|career|apply|hiring|vacancy/.test(q)) return 'You can review listed roles on the Careers page and use Apply now to send an application. If a role is not a fit, you can still contact us about future collaboration.';
  if (/contact|email|whatsapp|talk|human/.test(q)) return 'You can email companyflow0@gmail.com or use the WhatsApp button on this page to speak with CompanyFlow.';
  return 'I can help with general questions about CompanyFlow services and getting started. For a specific estimate or detailed technical discussion, please contact companyflow0@gmail.com or message us on WhatsApp.';
}

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(START);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<'ai' | 'quick'>('quick');
  const [actionMode, setActionMode] = useState<ChatMode>('chat');
  const [formBusy, setFormBusy] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  const [lead, setLead] = useState({ name: '', email: '', company: '', service: 'Custom Software Development', budget: '', details: '' });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, open, busy]);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-10).map(({ role, content }) => ({ role, content })) }),
      });
      if (!response.ok) throw new Error('AI endpoint is not configured');
      const payload = await response.json() as { reply?: string };
      if (!payload.reply) throw new Error('Empty assistant reply');
      setMessages(current => [...current, { role: 'assistant', content: payload.reply! }]);
      setMode('ai');
    } catch {
      setMessages(current => [...current, { role: 'assistant', content: quickAnswer(text) }]);
      setMode('quick');
    } finally { setBusy(false); }
  }


  async function submitLead(event: FormEvent) {
    event.preventDefault();
    setFormBusy(true); setFormStatus('');
    try {
      // Match the working Contact page's Web3Forms submission flow.
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'CompanyFlow AI assistant project enquiry',
          from_name: 'CompanyFlow AI Assistant',
          name: lead.name,
          email: lead.email,
          replyto: lead.email,
          company: lead.company || 'Not provided',
          budget: lead.budget || 'Not specified',
          service: lead.service || 'Not specified',
          message: lead.details,
          botcheck: '',
        }),
      });
      const result = await response.json() as { success?: boolean; message?: string };
      if (!response.ok || result.success !== true) throw new Error(result.message || 'Could not send your enquiry.');
      setFormStatus(result.message || 'Your enquiry has been sent.');
      setMessages(current => [...current, { role: 'assistant', content: 'Thanks. Your project enquiry has been sent to the CompanyFlow team. They can reply to the email address you provided.' }]);
      setLead({ name: '', email: '', company: '', service: 'Custom Software Development', budget: '', details: '' });
    } catch (error) { setFormStatus(error instanceof Error ? error.message : 'Could not send your enquiry. Please email companyflow0@gmail.com.'); }
    finally { setFormBusy(false); }
  }


  return (
    <div className="chat-widget fixed right-5 bottom-5 z-[85] flex flex-col items-end gap-3">
      {open && <section className="chat-panel flex h-[min(560px,70vh)] w-[min(370px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border border-line bg-bg-surface shadow-[0_24px_80px_rgba(0,0,0,.5)]" aria-label="CompanyFlow chat assistant">
        <header className="flex items-center gap-3 border-b border-line p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy/20 text-burgundy-light"><Bot className="h-5 w-5" /></div>
          <div className="min-w-0 flex-1"><h2 className="font-semibold">CompanyFlow assistant</h2><p className="text-xs text-ink-muted">{actionMode !== 'chat' ? (actionMode === 'lead' ? 'Project enquiry' : 'Book a consultation') : (mode === 'ai' ? 'AI assistant' : 'CompanyFlow support')} · CompanyFlow</p></div>
          <button onClick={() => setOpen(false)} className="rounded-full p-2 text-ink-muted hover:bg-bg" aria-label="Close chat"><X className="h-4 w-4" /></button>
        </header>
        {actionMode !== 'chat' && <div className="flex items-center gap-2 border-b border-line px-4 py-2">
          <button type="button" onClick={() => { setActionMode('chat'); setFormStatus(''); }} className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" /> Back to chat</button>
        </div>}
        {actionMode === 'chat' ? <>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((message, i) => <div key={`${i}-${message.role}`} className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3.5 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'ml-auto bg-burgundy text-white' : 'mr-auto bg-bg text-ink'}`}>{message.content}</div>)}
            {busy && <div className="flex items-center gap-2 text-xs text-ink-muted"><LoaderCircle className="h-4 w-4 animate-spin" />Thinking…</div>}
          </div>
          <div className="flex gap-2 px-3 pb-2">
            <button type="button" onClick={() => { setActionMode('lead'); setFormStatus(''); }} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-line px-2 py-2 text-xs text-ink-muted hover:border-burgundy-light"><ClipboardList className="h-3.5 w-3.5" /> Project enquiry</button>
            <button type="button" onClick={() => { setActionMode('booking'); setFormStatus(''); }} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-line px-2 py-2 text-xs text-ink-muted hover:border-burgundy-light"><CalendarDays className="h-3.5 w-3.5" /> Book a call</button>
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 border-t border-line p-3">
            <input value={input} onChange={e => setInput(e.target.value)} maxLength={1200} aria-label="Your message" placeholder="Ask about CompanyFlow…" className="min-w-0 flex-1 rounded-full border border-line bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-burgundy-light" />
            <button disabled={!input.trim() || busy} aria-label="Send message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-burgundy text-white transition-opacity disabled:opacity-40"><Send className="h-4 w-4" /></button>
          </form>
        </> : actionMode === 'lead' ? <form onSubmit={submitLead} className="flex-1 space-y-3 overflow-y-auto p-4">
          <p className="text-sm text-ink-muted">Tell us a little about your project. The details will be emailed to the CompanyFlow team.</p>
          <input required value={lead.name} onChange={e => setLead(v => ({ ...v, name: e.target.value }))} maxLength={120} placeholder="Your name" className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink" />
          <input required type="email" value={lead.email} onChange={e => setLead(v => ({ ...v, email: e.target.value }))} maxLength={254} placeholder="Email address" className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink" />
          <input value={lead.company} onChange={e => setLead(v => ({ ...v, company: e.target.value }))} maxLength={160} placeholder="Company (optional)" className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink" />
          <select value={lead.service} onChange={e => setLead(v => ({ ...v, service: e.target.value }))} className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink">
            {['Custom Software Development','Web Development','Mobile App Development','ERP Systems','CRM Solutions','Shopify / E-commerce','UI/UX Design','Cloud & DevOps','AI & Automation','Digital Marketing / Growth Engineering','Not sure yet'].map(item => <option key={item}>{item}</option>)}
          </select>
          <input value={lead.budget} onChange={e => setLead(v => ({ ...v, budget: e.target.value }))} maxLength={80} placeholder="Budget (optional)" className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink" />
          <textarea required minLength={10} maxLength={5000} value={lead.details} onChange={e => setLead(v => ({ ...v, details: e.target.value }))} rows={4} placeholder="What would you like to build?" className="w-full resize-none rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink" />
          {formStatus && <p role="status" className="text-xs text-ink-muted">{formStatus}</p>}
          <button disabled={formBusy} className="flex w-full items-center justify-center gap-2 rounded-full bg-burgundy px-4 py-3 text-sm text-white disabled:opacity-50">{formBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{formBusy ? 'Sending…' : 'Send project enquiry'}</button>
        </form> : <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-4 text-sm text-ink-muted">Choose a time that works for you using our Cal.com booking page. Select an available slot there to receive your booking confirmation.</p>
          <a href="https://cal.com/company-flow-1ort2e/15min" target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-full bg-burgundy px-4 py-3 text-sm text-white hover:bg-burgundy-light transition-colors">
            <CalendarDays className="h-4 w-4" /> Choose a time on Cal.com
          </a>
        </div>}
        <p className="px-4 pb-3 text-[10px] text-ink-dim">Avoid sharing sensitive information. Enquiries go to companyflow0@gmail.com.</p>
      </section>}
      <div className="flex items-center gap-3">
        {!open && <span className="chat-greeting rounded-full border border-burgundy-light/30 bg-bg-surface px-4 py-2 text-sm font-medium text-ink shadow-[0_8px_30px_rgba(0,0,0,.28)] animate-[fadeIn_500ms_ease-out]">Hi, wanna chat?</span>}
        <button onClick={() => setOpen(value => !value)} aria-label={open ? 'Close chat assistant' : 'Open chat assistant'} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-burgundy-light/50 bg-burgundy text-white shadow-[0_8px_30px_rgba(0,0,0,.35)] transition-transform duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy-light">
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
}
