import { cn } from "@/utils/cn";

export type IconName =
  | "arrow-right"
  | "box"
  | "brand"
  | "cart"
  | "category"
  | "check"
  | "dashboard"
  | "eye"
  | "login"
  | "logout"
  | "mail"
  | "menu"
  | "plus"
  | "save"
  | "search"
  | "settings"
  | "store"
  | "trend"
  | "whatsapp"
  | "x"
  | "ticket"
  | "users"
  | "user"
  | "calendar"
  | "clock";

type IconProps = {
  name: IconName;
  className?: string;
};

const paths: Record<IconName, string> = {
  "arrow-right": "M5 12h14M13 5l7 7-7 7",
  box: "M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Zm0 0 2.5-4h11L20 8M12 4v16",
  // ALTERAÇÃO: Ícone de marca adicionado
  brand: "M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Zm2 7h8M12 10v4",
  cart: "M6 6h15l-2 8H8L6 3H3m6 16a1 1 0 1 0 0 .01M18 19a1 1 0 1 0 0 .01",
  category: "M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z",
  check: "m5 12 4 4L19 6",
  dashboard: "M4 13h7V4H4v9Zm9 7h7V4h-7v16ZM4 20h7v-5H4v5Z",
  eye: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  login: "M14 7 19 12l-5 5M19 12H7M3 4v16h8",
  logout: "M10 17 15 12l-5-5M15 12H3M21 4v16h-8",
  mail: "M4 6h16v12H4V6Zm0 0 8 7 8-7",
  menu: "M4 6h16M4 12h16M4 18h16",
  plus: "M12 5v14M5 12h14",
  save: "M5 4h12l2 2v14H5V4Zm4 0v6h6V4M8 20v-6h8v6",
  search: "m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z",
  settings:
    "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a8.2 8.2 0 0 0 .1-2l2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1L15 5h-6l-.4 3a8 8 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a8.2 8.2 0 0 0 .1 2l-2.1 1.5 2 3.5 2.4-1a8 8 0 0 0 1.7 1l.4 3h6l.4-3a8 8 0 0 0 1.7-1l2.4 1 2-3.5L19.4 15Z",
  store: "M4 10h16l-1-5H5l-1 5Zm1 0v10h14V10M8 20v-6h8v6M4 10a3 3 0 0 0 6 0M10 10a3 3 0 0 0 6 0M16 10a3 3 0 0 0 6 0",
  trend: "M4 18 10 12l4 4 6-10M15 6h5v5",
  whatsapp:
    "M20 11.5a8 8 0 0 1-11.9 7L4 20l1.6-4A8 8 0 1 1 20 11.5Zm-5.5 3.2c-1.7 0-4.8-2.6-4.8-4.3 0-.5.4-1.4.8-1.6.2-.1.5 0 .6.2l.7 1.1c.1.2.1.4 0 .6l-.3.4c.4.7 1 1.3 1.7 1.7l.5-.3c.2-.1.4-.1.6 0l1.1.6c.2.1.3.4.2.6-.1.4-.7 1-1.1 1Z",
  x: "M6 6l12 12M18 6 6 18",
  ticket:"M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6Zm6 0h6M9 12h6M9 15h4",
  users:"M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3Zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3Zm0 2c-2.7 0-5 1.3-5 3v1h10v-1c0-1.7-2.3-3-5-3Zm8 0c-.8 0-1.6.1-2.3.4.8.7 1.3 1.6 1.3 2.6v1h6v-1c0-1.7-2.3-3-5-3Z",
  user:"M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  calendar:"M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 15H5V9h14v10ZM5 7V6h14v1H5Z",
  clock:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm1-13h-2v6l5.2 3.1 1-1.7-4.2-2.5V7Z"

};

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-4", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d={paths[name]} />
    </svg>
  );
}
