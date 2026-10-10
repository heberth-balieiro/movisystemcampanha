export function WhatsAppFloat() {
  const phone = "5569992161179";
  const message = encodeURIComponent("Olá! Gostaria de falar com a MoviSystem.");

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a MoviSystem pelo WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-105 hover:bg-[#1fbd5a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/25"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden="true">
        <path d="M19.11 17.27c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27s.98 2.63 1.11 2.81c.14.18 1.92 2.93 4.65 4.11.65.28 1.16.45 1.56.58.66.21 1.26.18 1.73.11.53-.08 1.6-.66 1.83-1.29.23-.64.23-1.18.16-1.29-.07-.11-.25-.18-.52-.32Z"/>
        <path d="M16.03 3.2c-6.97 0-12.62 5.65-12.62 12.62 0 2.22.58 4.31 1.59 6.12L3.31 28.1l6.31-1.65a12.55 12.55 0 0 0 6.4 1.76h.01c6.96 0 12.62-5.65 12.62-12.62S23 3.2 16.03 3.2Zm0 22.89h-.01a10.43 10.43 0 0 1-5.31-1.45l-.38-.23-3.74.98 1-3.64-.25-.37a10.45 10.45 0 1 1 8.69 4.71Z"/>
      </svg>
    </a>
  );
}
