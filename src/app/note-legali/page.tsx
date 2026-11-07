import LegalPage from "@/components/LegalPage";
import { legal } from "@/content/legal";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Note legali",
  description: "Note legali del sito di Roberto Landi Lab Watches, laboratorio di orologeria a Pistoia.",
  path: "/note-legali",
});

export default function Page() {
  return <LegalPage page={legal.noteLegali} path="/note-legali" />;
}
