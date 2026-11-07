import LegalPage from "@/components/LegalPage";
import { legal } from "@/content/legal";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Informativa sui Cookie",
  description: "Informativa sui cookie del sito di Roberto Landi Lab Watches: quali cookie usiamo e come gestirli.",
  path: "/cookie",
});

export default function Page() {
  return <LegalPage page={legal.cookie} path="/cookie" />;
}
