"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const headersList = await headers();
  const origin =
    headersList.get("origin") ??
    (() => {
      const host = headersList.get("host") ?? "localhost:3000";
      const protocol = host.startsWith("localhost") ? "http" : "https";
      return `${protocol}://${host}`;
    })();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error || !data.url) {
    redirect("/?modal=login&error=oauth_failed");
  }

  redirect(data.url);
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/?modal=login&error=invalid_credentials`);
  }

  redirect("/dashboard");
}

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.message.includes("already registered")) {
      redirect("/?modal=signup&error=already_registered");
    }
    redirect("/?modal=signup&error=signup_failed");
  }

  redirect("/?modal=signup&error=check_email");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
