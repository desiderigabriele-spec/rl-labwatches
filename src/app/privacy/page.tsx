import LegalPage from "@/components/LegalPage";
import { legal } from "@/content/legal";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Informativa sulla Privacy",
  description: "Informativa sulla privacy di Roberto Landi Lab Watches, Pistoia: quali dati raccogliamo tramite il sito, perché e come li proteggiamo.",
  path: "/privacy",
});

export default function Page() {
  return <LegalPage page={legal.privacy} path="/privacy" />;
}
