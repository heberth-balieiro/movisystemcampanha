import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="MoviSystem Eleições e Assembleias">
      <span className="relative flex h-10 w-10 items-center justify-center" aria-hidden="true">
        <span className="absolute h-8 w-8 rotate-45 rounded-[10px] border-2 border-emerald-700" />
        <span className="absolute h-4 w-4 rotate-45 rounded-[5px] bg-emerald-700" />
      </span>
      <span className="leading-tight">
        <strong className="block text-[15px] font-black tracking-tight text-slate-950">MoviSystem</strong>
        <small className="block text-xs font-medium text-slate-500">Eleições &amp; Assembleias</small>
      </span>
    </Link>
  );
}
