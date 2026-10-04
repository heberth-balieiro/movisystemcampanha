import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoMensagem } from "@/components/eleicao/EleicaoMensagem";

export default function EleicaoNotFound() {
  return (
    <EleicaoLayout>
      <EleicaoMensagem
        titulo="Página não encontrada"
        mensagem="O endereço solicitado não existe ou não está mais disponível neste ambiente de votação."
        acaoHref="/"
        acaoTexto="Voltar para a página inicial"
      />
    </EleicaoLayout>
  );
}
