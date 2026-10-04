export default function CadastroPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <form className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="mt-1 text-sm text-slate-500">Cadastre a empresa e o primeiro administrador.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {["Razão social", "Nome fantasia", "CPF/CNPJ", "Telefone", "E-mail da empresa", "Responsável", "E-mail de acesso", "Senha"].map((x) => (
            <label key={x} className="grid gap-1 text-sm font-medium">
              {x}
              <input className="rounded-xl border border-slate-300 px-3 py-2.5" />
            </label>
          ))}
        </div>
        <button className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white">Criar conta</button>
      </form>
    </main>
  );
}
