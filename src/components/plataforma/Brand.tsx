import Image from "next/image";
import Link from "next/link";

type BrandProps = {
  variant?: "light" | "dark";
  className?: string;
};

export function Brand({ variant = "light", className = "" }: BrandProps) {
  const logo = variant === "dark" ? "/logo2.png" : "/logo1.png";

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="MoviSystem Eleições e Assembleias"
    >
      <Image
        src={logo}
        alt="MoviSystem"
        width={260}
        height={90}
        priority={variant === "light"}
        className="h-auto w-[150px] object-contain sm:w-[176px]"
      />
    </Link>
  );
}
