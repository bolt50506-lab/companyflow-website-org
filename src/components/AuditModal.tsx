import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Check, Loader2, X } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   "Free website audit" popup. Opens on top of the current page (no navigation)
   and posts to Web3Forms, using the same access key as the Contact page.
   Usage:  <AuditModal open={open} onClose={() => setOpen(false)} />
   ───────────────────────────────────────────────────────────── */

const WEB3FORMS_ACCESS_KEY = '60cc8168-551e-4b8c-9b6b-b89d6f9c1e23';

type Status = 'idle' | 'sending' | 'success' | 'error';

const stripProtocol = (v: string) => v.trim().replace(/^https?:\/\//i, '');
const isDomain = (v: string) => /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+(:\d+)?([/?#]\S*)?$/i.test(v);
const isPhone = (v: string) => v.replace(/\D/g, '').length >= 7;

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])';

export function AuditModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ url: '', name: '', phone: '', email: '', message: '', botcheck: false });

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (error) setError('');
  };

  /* lock page scroll, focus the URL field, return focus to the button on close */
  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    const t = window.setTimeout(() => urlRef.current?.focus(), 60);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      trigger?.focus?.();
    };
  }, [open]);

  /* fresh form every time it opens */
  useEffect(() => {
    if (open) {
      setStatus('idle');
      setError('');
      setForm({ url: '', name: '', phone: '', email: '', message: '', botcheck: false });
    }
  }, [open]);

  /* Esc closes, Tab stays inside the popup */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  const urlOk = isDomain(form.url);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (!urlOk) {
      setError('Please enter your website address, for example yourbusiness.com');
      urlRef.current?.focus();
      return;
    }
    if (!isPhone(form.phone)) {
      setError('Please enter a valid phone number.');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: 'CompanyFlow free website audit request',
          from_name: 'CompanyFlow Website Audit',
          website: `https://${form.url}`,
          name: form.name,
          phone: form.phone,
          email: form.email,
          replyto: form.email,
          message: form.message || 'Not provided',
          botcheck: form.botcheck ? 'true' : '',
        }),
      });
      const result = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || result.success !== true) {
        console.error('Web3Forms submission failed:', result.message || response.status);
        throw new Error(result.message || 'Could not send your request.');
      }
      setStatus('success');
    } catch (err) {
      console.error('Audit form submission error:', err);
      setStatus('error');
      setError('Something went wrong sending your request. Please try again.');
    }
  };

  const label = 'mb-1.5 block text-[11.5px] font-medium text-ink';
  const field = 'input !rounded-2xl !py-3 text-[13.5px] focus:ring-2 focus:ring-burgundy-light/25';

  return createPortal(
    <div
      className="wps-modal-backdrop fixed inset-0 z-[120] flex items-end justify-center overflow-y-auto bg-black/65 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-title"
        className="wps-modal relative my-auto w-full max-w-[500px] overflow-hidden rounded-[28px] border border-line bg-bg-surface text-ink shadow-[0_40px_90px_-30px_rgba(0,0,0,.8)]"
      >
        {/* header */}
        <div className="wps-modal-head relative px-6 pb-9 pt-6 sm:px-8 sm:pt-7">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-cursor="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1b1a1d] shadow-md transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X size={16} />
          </button>

          <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90">
            <span className="flex h-4 w-4 items-center justify-center rounded-[5px] bg-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            Free website audit
          </p>
          <h2 id="audit-title" className="mt-4 max-w-[400px] text-[1.7rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-white sm:text-[1.95rem]">
            Which of these is costing you <span className="text-[#f2b9c3]">leads?</span>
          </h2>
          <p className="mt-2.5 text-[12.5px] font-medium text-white/80">We’ll check speed, SEO and conversions, and reply within 24 hours.</p>
          {status !== 'success' && (
            <div className="mt-5 flex items-center gap-1 rounded-2xl bg-white p-1.5 shadow-[0_10px_30px_-12px_rgba(0,0,0,.5)] ring-4 ring-white/25">
              <label htmlFor="audit-url" className="sr-only">Website address (required)</label>
              <div className="flex h-[46px] flex-1 items-center gap-1 pl-3.5 text-[13.5px]">
                <span className="select-none text-gray-500">https://</span>
                <input
                  id="audit-url"
                  form="audit-form"
                  ref={urlRef}
                  value={form.url}
                  onChange={e => update('url', stripProtocol(e.target.value))}
                  inputMode="url"
                  autoComplete="url"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="yourbusiness.com"
                  aria-invalid={!!error && !urlOk}
                  data-cursor="Type"
                  className="min-w-0 flex-1 bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
              {urlOk ? (
                <span className="mr-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600"><Check size={13} strokeWidth={3} /></span>
              ) : (
                <span className="mr-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wider text-burgundy">Required</span>
              )}
            </div>
          )}
        </div>

        {status === 'success' ? (
          <div className="wps-modal-body relative -mt-5 rounded-t-[26px] bg-bg-surface px-6 pb-8 pt-10 text-center sm:px-8">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-burgundy/15 text-burgundy-light">
              <Check size={26} />
            </span>
            <h3 className="mt-5 text-xl font-bold tracking-tight">Request received</h3>
            <p className="mx-auto mt-2 max-w-[330px] text-sm leading-relaxed text-ink-muted">We’ll check speed, SEO and conversions, and reply within 24 hours.</p>
            <button
              type="button"
              onClick={onClose}
              data-cursor="Close"
              className="mt-7 inline-flex min-h-[46px] items-center rounded-full bg-burgundy px-7 text-sm font-medium text-onburg transition-colors hover:bg-burgundy-dark"
            >
              Close
            </button>
          </div>
        ) : (
          <form id="audit-form" onSubmit={handleSubmit} noValidate className="wps-modal-body relative -mt-5 rounded-t-[26px] bg-bg-surface px-6 pb-6 pt-6 sm:px-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="audit-name" className={label}>Full name <span className="text-burgundy-light">*</span></label>
                <input id="audit-name" required autoComplete="name" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Riley Brooks" data-cursor="Type" className={field} />
              </div>
              <div>
                <label htmlFor="audit-phone" className={label}>Phone <span className="text-burgundy-light">*</span></label>
                <input id="audit-phone" required type="tel" autoComplete="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="804 650 8875" data-cursor="Type" className={field} />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="audit-email" className={label}>Email <span className="text-burgundy-light">*</span></label>
              <input id="audit-email" required type="email" autoComplete="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@business.com" data-cursor="Type" className={field} />
            </div>

            <div className="mt-4">
              <label htmlFor="audit-message" className={label}>Message <span className="font-normal text-ink-muted">(optional)</span></label>
              <textarea id="audit-message" rows={3} value={form.message} onChange={e => update('message', e.target.value)} placeholder="What would you like to improve?" data-cursor="Type" className={`${field} resize-none`} />
            </div>

            {/* spam trap: real people never see or tick this */}
            <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" checked={form.botcheck} onChange={e => update('botcheck', e.target.checked)} className="hidden" aria-hidden="true" />

            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[12.5px] text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              data-cursor="Send"
              className="wps-submit group mt-6 flex min-h-[54px] w-full items-center justify-between rounded-full bg-[#0b0b0d] py-2 pl-6 pr-2 text-[14px] font-semibold text-white ring-2 ring-burgundy-light/30 transition-[transform,box-shadow] hover:ring-burgundy-light/60 active:scale-[.99] disabled:cursor-wait disabled:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy-light"
            >
              {status === 'sending' ? 'Sending…' : 'Find My Leaks'}
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0b0b0d] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                {status === 'sending' ? <Loader2 size={18} className="animate-spin" /> : <ArrowUpRight size={18} />}
              </span>
            </button>
            <p className="mt-3 text-center text-[11px] text-ink-muted">No obligation · Real people, no bots</p>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
