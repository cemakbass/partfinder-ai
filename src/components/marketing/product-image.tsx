import Image from "next/image";
import type { MarketingImage } from "@/lib/marketing-images";

/** White-background catalog photos — use contain so the full part stays visible. */
export function ProductImage({
  image,
  fill = true,
  className = "",
  sizes = "100vw",
  priority = false
}: {
  image: MarketingImage;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const cover = image.fit === "cover";
  return (
    <div
      className={`relative overflow-hidden ${cover ? "bg-zinc-900" : "bg-white"} ${fill ? "h-full w-full" : ""} ${className}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={cover ? "object-cover" : "object-contain p-3 sm:p-4"}
      />
    </div>
  );
}
