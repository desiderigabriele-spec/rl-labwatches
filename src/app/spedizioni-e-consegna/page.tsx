import LegalPage from "@/components/LegalPage";
import { legal } from "@/content/legal";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Spedizioni e Consegna",
  description: "Spedizione e ritiro sicuri del tuo orologio di lusso con UPS, Ferrari e portavalori, in tutto il mondo. Consegna su appuntamento a Pistoia.",
  path: "/spedizioni-e-consegna",
});

export default function Page() {
  return <LegalPage page={legal.spedizioni} path="/spedizioni-e-consegna" />;
}
