import Image from "next/image";
import { PART_GALLERY } from "@/lib/marketing-images";

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
              From brake pads to filters and ignition — upload what you have on the bench or lift. PartFinder AI is built for
              greasy, worn, everyday components.
            </p>
          </div>
          <p className="font-mono text-xs uppercase tracking-wider text-amber-400/80">Dashboard · sample identifications</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {PART_GALLERY.map((item) => (
            <figure
              key={item.src}
              className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition hover:border-amber-500/40"
            >
              <div className="relative aspect-square">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
