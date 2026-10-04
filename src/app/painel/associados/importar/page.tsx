export default function ImportarPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold">Importar associados</h1>
      <div className="mt-6 rounded-2xl border bg-white p-6">
        <label className="block rounded-xl border-2 border-dashed p-10 text-center">
          <strong>Selecionar arquivo CSV</strong>
          <input type="file" accept=".csv" className="mt-4 block w-full" />
        </label>
        <p className="mt-4 text-sm text-slate-500">Próximo passo: pré-visualizar, validar CPF/matrícula e confirmar a importação.</p>
      </div>
    </div>
  );
}
