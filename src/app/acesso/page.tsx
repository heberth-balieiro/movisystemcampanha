export default function AcessoPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <form className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Acessar painel</h1>
        <label className="mt-6 grid gap-1 text-sm font-medium">E-mail<input className="rounded-xl border px-3 py-2.5" /></label>
        <label className="mt-4 grid gap-1 text-sm font-medium">Senha<input type="password" className="rounded-xl border px-3 py-2.5" /></label>
        <button className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white">Entrar</button>
      </form>
    </main>
  );
}
