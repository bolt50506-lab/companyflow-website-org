const PHONE = '923407465567';

export function WhatsAppWidget() {
  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent('Hi CompanyFlow, I would like to discuss a project.')}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with CompanyFlow on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed left-5 bottom-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(0,0,0,.35)] transition-transform duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
    >
      <svg viewBox="0 0 32 32" className="h-8 w-8 fill-current" aria-hidden="true">
        <path d="M16.04 3C8.87 3 3.04 8.77 3.04 15.87c0 2.27.6 4.49 1.74 6.44L3 29l6.91-1.8a13.1 13.1 0 0 0 6.13 1.52h.01c7.17 0 13-5.77 13-12.87S23.22 3 16.04 3Zm0 23.55c-1.9 0-3.76-.5-5.39-1.45l-.39-.23-4.1 1.07 1.09-3.97-.25-.4a10.6 10.6 0 0 1-1.63-5.7c0-5.84 4.8-10.59 10.68-10.59 5.89 0 10.68 4.75 10.68 10.59s-4.79 10.68-10.69 10.68Zm5.86-7.95c-.32-.16-1.9-.93-2.19-1.03-.3-.11-.51-.16-.72.16-.21.32-.83 1.03-1.02 1.24-.19.21-.38.24-.7.08-.32-.16-1.35-.49-2.57-1.56-.95-.83-1.59-1.85-1.78-2.17-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.72-1.72-.99-2.36-.26-.62-.52-.54-.72-.55h-.62c-.21 0-.56.08-.86.4-.3.32-1.13 1.1-1.13 2.68s1.16 3.11 1.32 3.33c.16.21 2.28 3.46 5.52 4.85.77.33 1.37.53 1.84.68.77.24 1.47.21 2.02.13.62-.09 1.9-.77 2.17-1.51.27-.74.27-1.37.19-1.51-.08-.13-.29-.21-.62-.37Z" />
      </svg>
      <span className="sr-only">WhatsApp: +92 340 7465567</span>
    </a>
  );
}
