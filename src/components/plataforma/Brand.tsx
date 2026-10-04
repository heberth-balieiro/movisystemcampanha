import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-xl bg-slate-950 font-black text-white">EE</span>
      <span>
        <strong className="block text-sm">EasyEleição</strong>
        <small className="text-slate-500">Gestão eleitoral digital</small>
      </span>
    </Link>
  );
}
