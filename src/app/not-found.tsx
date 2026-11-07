import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80dvh] flex-col items-center justify-center px-4 text-center">
      <p className="eyebrow">Errore 404</p>
      <h1 className="mt-6 font-display text-5xl font-light sm:text-7xl">Questa pagina si è fermata.</h1>
      <Link href="/" className="btn mt-10">Torna alla home</Link>
    </section>
  );
}
