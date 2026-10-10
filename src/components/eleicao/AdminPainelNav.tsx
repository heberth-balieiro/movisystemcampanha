"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type AdminPainelSecao = "painel" | "relatorios" | "auditoria" | "contingencia" | "dados";

type AdminPainelNavProps = {
  slug: string;
  ativa: AdminPainelSecao;
  onPainel?: () => void;
  onRelatorios?: () => void;
  onAuditoria?: () => void;
};

export function AdminPainelNav({
  slug,
  ativa,
  onPainel,
  onRelatorios,
  onAuditoria,
}: AdminPainelNavProps) {
  const router = useRouter();
  const irPainel = () => router.push(`/${slug}/admin/painel`);

  return (
    <nav className="inline-flex w-full flex-wrap rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] p-1 sm:w-auto">
      <Button className="flex-1 sm:flex-none" size="sm" variant={ativa === "painel" ? "primary" : "ghost"} onClick={onPainel || irPainel}>
        Painel
      </Button>
      <Button className="flex-1 sm:flex-none" size="sm" variant={ativa === "relatorios" ? "primary" : "ghost"} onClick={onRelatorios || irPainel}>
        Relatórios
      </Button>
      <Button className="flex-1 sm:flex-none" size="sm" variant={ativa === "auditoria" ? "primary" : "ghost"} onClick={onAuditoria || irPainel}>
        Auditoria
      </Button>
      <Button className="flex-1 sm:flex-none" size="sm" variant={ativa === "contingencia" ? "primary" : "ghost"} onClick={() => router.push(`/${slug}/admin/painel/contingencia`)}>
        Contingência
      </Button>
      <Button className="flex-1 sm:flex-none" size="sm" variant={ativa === "dados" ? "primary" : "ghost"} onClick={() => router.push(`/${slug}/admin/painel/dados`)}>
        Dados da eleição
      </Button>
    </nav>
  );
}
