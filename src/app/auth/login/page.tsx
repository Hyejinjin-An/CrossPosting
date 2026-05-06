import { redirect } from "next/navigation";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const params = new URLSearchParams({ modal: "login" });
  if (error) params.set("error", error);
  redirect(`/?${params.toString()}`);
}
