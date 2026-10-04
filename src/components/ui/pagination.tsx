"use client";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

type PaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
};

export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  itemLabel = "registro(s)",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 bg-[var(--surface-muted)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-center text-sm text-[var(--muted)] sm:text-left">
        Exibindo <strong className="text-[var(--foreground)]">{startItem}–{endItem}</strong> de {totalItems} {itemLabel}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {onPageSizeChange ? (
          <Select
            aria-label="Registros por página"
            className="h-10 sm:w-[90px]"
            value={String(pageSize)}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
        ) : null}

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:flex">
          <Button disabled={currentPage <= 1} size="sm" type="button" variant="secondary" onClick={() => onPageChange(currentPage - 1)}>
            Anterior
          </Button>
          <span className="min-w-[72px] text-center text-sm font-semibold text-[var(--foreground)]">
            {currentPage} / {totalPages}
          </span>
          <Button disabled={currentPage >= totalPages} size="sm" type="button" variant="secondary" onClick={() => onPageChange(currentPage + 1)}>
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}
