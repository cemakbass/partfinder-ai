import { PART_GALLERY } from "@/lib/marketing-images";
import { ProductImage } from "@/components/marketing/product-image";

export function PartGallery() {
  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950 px-4 py-16 sm:px-6" aria-labelledby="gallery-heading">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="gallery-heading" className="text-2xl font-black tracking-tight sm:text-3xl">
              Real parts, real photos
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-400 sm:text-base">
              Brake pads, injectors, HVAC cores, CV boots, batteries, and more — the same kinds of catalog and bench photos
              you already work with. Upload yours on the lift or counter.
            </p>
          </div>
          <p className="font-mono text-xs uppercase tracking-wider text-amber-400/80">Catalog-style examples</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
          {PART_GALLERY.map((item) => (
            <figure
              key={item.src}
              className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition hover:border-amber-500/40"
            >
              <div className="relative aspect-square">
                <ProductImage image={item} sizes="(max-width: 640px) 50vw, 33vw" />
              </div>
              {item.label ? (
                <figcaption className="border-t border-zinc-800 px-3 py-2 text-center text-xs font-medium text-zinc-400 group-hover:text-amber-400/90">
                  {item.label}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
