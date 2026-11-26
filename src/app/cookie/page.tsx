import LegalPage from "@/components/LegalPage";
import { legal } from "@/content/legal";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Informativa sui Cookie",
  description: "Cookie del sito di Roberto Landi Lab Watches: niente pubblicità né profilazione; statistiche (Google Analytics e Clarity) solo con il tuo consenso.",
  path: "/cookie",
});

export default function Page() {
  return <LegalPage page={legal.cookie} path="/cookie" />;
}
