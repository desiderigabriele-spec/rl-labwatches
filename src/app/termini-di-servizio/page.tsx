import LegalPage from "@/components/LegalPage";
import { legal } from "@/content/legal";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Termini di Servizio",
  description: "Termini di servizio di Roberto Landi, artigiano di orologi di lusso a Pistoia: servizi, prenotazioni, spedizioni e condizioni.",
  path: "/termini-di-servizio",
});

export default function Page() {
  return <LegalPage page={legal.termini} path="/termini-di-servizio" />;
}
