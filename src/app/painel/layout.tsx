import type { ReactNode } from "react";
import { Sidebar } from "@/components/plataforma/Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <main className="p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
