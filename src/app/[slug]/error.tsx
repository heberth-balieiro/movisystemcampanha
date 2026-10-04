"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { EleicaoLayout } from "@/components/eleicao/EleicaoLayout";
import { EleicaoMensagem } from "@/components/eleicao/EleicaoMensagem";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function EleicaoError({ error, reset }: Props) {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Erro inesperado no EasyEleicao:", error);
    }
  }, [error]);

  return (
    <EleicaoLayout>
      <EleicaoMensagem
        titulo="Não foi possível concluir esta operação"
        mensagem="Ocorreu um erro inesperado nesta página. Seus dados de votação não são exibidos nesta mensagem. Tente novamente e, se o problema continuar, entre em contato com a entidade responsável."
      >
        <div className="flex flex-col justify-center gap-2 sm:flex-row">
          <Button onClick={reset}>Tentar novamente</Button>
          {slug ? <ButtonLink href={`/${slug}`} variant="secondary">Voltar para a eleição</ButtonLink> : null}
        </div>
      </EleicaoMensagem>
    </EleicaoLayout>
  );
}
