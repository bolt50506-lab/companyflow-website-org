import { ArrowUpRight, Check, CircleDollarSign, ContactRound, Package, TrendingUp, Users, Zap } from 'lucide-react';
import { Reveal, SectionLabel, SplitHeading } from '@/components/Reveal';

function WindowFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="bs-window">
      <div className="bs-window-bar">
        <div className="flex gap-1.5"><i /><i /><i /></div>
        <span>{label}</span>
        <span className="bs-window-status"><span /> Live</span>
      </div>
      {children}
    </div>
  );
}

function CrmMock() {
  const leads = [
    { initials: 'SC', name: 'Sophie Carter', company: 'Northstar Studio', value: '$8,400', stage: 'Qualified', tone: 'gold' },
    { initials: 'JM', name: 'James Miller', company: 'Meridian Group', value: '$12,800', stage: 'Proposal', tone: 'violet' },
    { initials: 'AR', name: 'Amara Reed', company: 'Aster & Co.', value: '$5,200', stage: 'New lead', tone: 'rose' },
  ];
  return <WindowFrame label="CompanyFlow / CRM">
    <div className="bs-app-layout">
      <aside className="bs-sidebar"><div className="bs-brand-mark">C</div>{[ContactRound, Users, TrendingUp, Zap].map((Icon, i) => <span className={i === 0 ? 'active' : ''} key={i}><Icon /></span>)}</aside>
      <div className="bs-app-main">
        <div className="bs-app-heading"><div><small>SALES OVERVIEW</small><strong>Good morning, Alex <span>✦</span></strong></div><span className="bs-avatar">A</span></div>
        <div className="bs-metric-row"><div><small>Pipeline value</small><b>$84,250</b><em>↗ 12.8%</em></div><div><small>Won this month</small><b>$26,400</b><em>↗ 8.2%</em></div></div>
        <div className="bs-table-head"><b>Recent opportunities</b><small>View all ↗</small></div>
        {leads.map(l => <div className="bs-lead-row" key={l.name}><span className={`bs-person ${l.tone}`}>{l.initials}</span><span className="bs-lead-name"><b>{l.name}</b><small>{l.company}</small></span><strong>{l.value}</strong><i>{l.stage}</i></div>)}
      </div>
    </div>
  </WindowFrame>;
}

function ErpMock() {
  const bars = [34, 52, 42, 74, 57, 88, 66, 96, 71, 83, 62, 100];
  return <WindowFrame label="CompanyFlow / ERP">
    <div className="bs-app-layout">
      <aside className="bs-sidebar"><div className="bs-brand-mark">C</div>{[Package, TrendingUp, CircleDollarSign, Users].map((Icon, i) => <span className={i === 0 ? 'active' : ''} key={i}><Icon /></span>)}</aside>
      <div className="bs-app-main">
        <div className="bs-app-heading"><div><small>OPERATIONS DASHBOARD</small><strong>Business at a glance</strong></div><span className="bs-avatar">⌘</span></div>
        <div className="bs-metric-row"><div><small>Total revenue</small><b>$128.6k</b><em>↗ 18.4%</em></div><div><small>Orders fulfilled</small><b>1,284</b><em>↗ 6.7%</em></div></div>
        <div className="bs-chart-card"><div><b>Revenue performance</b><small>Last 12 months</small></div><div className="bs-chart-bars">{bars.map((h, i) => <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 45}ms` }} />)}</div><div className="bs-chart-labels"><span>JAN</span><span>APR</span><span>JUL</span><span>OCT</span><span>DEC</span></div></div>
        <div className="bs-stock-row"><span><Package /> Inventory health</span><b>94.8%</b><div><span /></div></div>
      </div>
    </div>
  </WindowFrame>;
}

function CustomMock() {
  return <WindowFrame label="CompanyFlow / Custom">
    <div className="bs-custom-app">
      <div className="bs-custom-title"><span><small>WORKFLOW AUTOMATION</small><b>Order fulfilment</b></span><span className="bs-active-pill"><i /> Running</span></div>
      <div className="bs-flow-steps">
        <div><span className="bs-flow-icon"><Package /></span><small>01 / TRIGGER</small><b>New order</b><em>Order received</em></div>
        <span className="bs-flow-line"><i /></span>
        <div><span className="bs-flow-icon"><Zap /></span><small>02 / AUTOMATE</small><b>Process order</b><em>Stock checked</em></div>
        <span className="bs-flow-line"><i /></span>
        <div><span className="bs-flow-icon success"><Check /></span><small>03 / COMPLETE</small><b>Notify team</b><em>Task complete</em></div>
      </div>
      <div className="bs-activity"><span className="bs-activity-dot" /><span><b>Workflow completed successfully</b><small>Order #CF-2048 · Just now</small></span><Check /></div>
    </div>
  </WindowFrame>;
}

const cards = [
  { title: 'CRM systems', text: 'A clear view of every lead, conversation and deal—so your team knows what to do next.', href: '/solutions/crm-solutions', cursor: 'CRM', mock: 'crm', number: '01' },
  { title: 'ERP platforms', text: 'Bring inventory, orders, finance and operations together in one reliable workspace.', href: '/solutions/erp-systems', cursor: 'ERP', mock: 'erp', number: '02' },
  { title: 'Custom software', text: 'Purpose-built portals and workflows shaped around the way your business actually runs.', href: '/solutions/custom-software', cursor: 'Custom', mock: 'custom', number: '03' },
] as const;

export function BusinessSoftware() {
  return (
    <section className="bs-section py-24 px-[5vw] border-t border-line">
      <SectionLabel>Business software</SectionLabel>
      <SplitHeading text="Your business. In sync." className="text-[clamp(2rem,5.5vw,5rem)] font-bold tracking-tight mb-6" />
      <p className="max-w-xl text-ink-muted text-lg leading-relaxed mb-14">Less juggling between tools. More clarity across your business. We build connected systems that make everyday work feel effortless.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 80}>
            <a href={c.href} data-cursor={c.cursor} className="bs-product-card group block h-full border border-line rounded-3xl overflow-hidden bg-bg-surface transition-[transform,border-color] duration-500">
              <div className="bs-product-visual">{c.mock === 'crm' ? <CrmMock /> : c.mock === 'erp' ? <ErpMock /> : <CustomMock />}</div>
              <div className="p-7"><div className="flex items-center justify-between"><span className="bs-card-number">{c.number} / SOLUTION</span><ArrowUpRight className="w-5 h-5 text-burgundy-light transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" /></div><h3 className="text-2xl font-semibold tracking-tight mt-3">{c.title}</h3><p className="text-sm text-ink-muted leading-relaxed mt-3">{c.text}</p><span className="bs-explore">Explore solution <ArrowUpRight /></span></div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
