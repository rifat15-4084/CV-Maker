import { Accordion } from "@/components/marketing/accordion";
import { FAQ_ITEMS } from "@/lib/content/faq";

export function FaqPreview() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <span className="glass inline-flex rounded-full px-3 py-1 text-xs font-medium tracking-wide text-cyan-300 uppercase">
          FAQ
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Questions, answered
        </h2>
      </div>
      <div className="mt-10">
        <Accordion items={FAQ_ITEMS.slice(0, 6)} />
      </div>
    </section>
  );
}
