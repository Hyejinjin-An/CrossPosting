import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSection } from "@/components/marketing/hero-section";
import { WorkflowSection } from "@/components/marketing/workflow-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { AuthModal } from "@/components/auth/auth-modal";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <Separator />
        <WorkflowSection />
        <Separator />
        <TrustSection />
      </main>
      <SiteFooter />
      <Suspense>
        <AuthModal />
      </Suspense>
    </div>
  );
}
