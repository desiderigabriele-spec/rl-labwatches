import LegalPage from "@/components/LegalPage";
import { legal } from "@/content/legal";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Informativa sui Cookie",
  description: "Il sito di Roberto Landi Lab Watches non usa cookie di profilazione, pubblicità o statistiche: ecco quali dati tecnici usa e come gestirli.",
  path: "/cookie",
});

export default function Page() {
  return <LegalPage page={legal.cookie} path="/cookie" />;
}
