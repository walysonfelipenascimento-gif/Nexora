import { redirect } from "next/navigation";

/**
 * Canonical messages experience lives in the Nexora home shell.
 * Keep /mensagens as a compatibility route so every entry point opens
 * the same implementation and does not fork local state or UI.
 */
export default function MessagesPage(): never {
  redirect("/?tab=mensagens");
}
