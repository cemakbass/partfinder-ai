export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readMinutes: number;
  category: string;
  coverImage: string;
  coverAlt: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "identify-car-part-by-photo",
    title: "How to Identify a Car Part by Photo (US Guide)",
    description:
      "Step-by-step workflow for DIYers and shops: what to photograph, how OEM lookup works, and when to trust AI part identification.",
    publishedAt: "2026-05-20",
    readMinutes: 6,
    category: "Identification",
    coverImage: "/marketing/parts/brake-pads-stack.png",
    coverAlt: "Stack of disc brake pads on a white background — example of a clear catalog-style photo for AI identification",
    sections: [
      {
        heading: "Why photos beat guesswork",
        paragraphs: [
          "Unknown components cost hours in forums and catalog hunting. A clear photo plus structured AI output gives you a starting OEM reference, likely fitment years, and retailer shortcuts—especially useful for salvage yards, collision estimates, and weekend repairs across the US.",
          "PartFinder AI is built for that first pass: upload an image, optionally add year/make/model, and review a structured report in seconds."
        ]
      },
      {
        heading: "What to include in the picture",
        paragraphs: [
          "Fill the frame with the part. Capture casting numbers, stickers, or barcodes when visible. Use daylight or shop lighting; blur is the enemy.",
          "Include context when possible: mounting brackets, left/right orientation, or damage patterns help the model infer category (suspension, cooling, electrical, etc.)."
        ]
      },
      {
        heading: "Verify before you buy",
        paragraphs: [
          "AI output is a research aid, not a warranty. Always confirm with your VIN, trim level, and the parts counter or OEM catalog. Torque specs and safety-critical work belong to a qualified technician.",
          "Use retailer links as shortcuts—inventory and supersessions change daily on Amazon, RockAuto, AutoZone, and O'Reilly."
        ]
      }
    ]
  },
  {
    slug: "oem-part-number-lookup",
    title: "OEM Part Number Lookup: A Practical Workflow for US Shops",
    description:
      "How body shops and independent garages move from mystery component to orderable OEM-style reference without wasting catalog time.",
    publishedAt: "2026-05-20",
    readMinutes: 5,
    category: "OEM lookup",
    coverImage: "/marketing/parts/fuel-injector.png",
    coverAlt: "Gasoline direct-injection fuel injector — real OEM-style component used for part-number research",
    sections: [
      {
        heading: "OEM vs aftermarket",
        paragraphs: [
          "An OEM-style reference points you to the manufacturer's numbering system. Aftermarket brands cross-reference those numbers. Starting with a solid OEM clue reduces wrong orders and return freight.",
          "When stampings are worn, vision AI can still suggest a category and probable reference from shape and mounting points—then you confirm in your preferred catalog."
        ]
      },
      {
        heading: "Where AI fits in the lane",
        paragraphs: [
          "Traditional lookup needs you to know the family of part. Photo-first tools flip the order: image → hypothesis → catalog confirmation. That is especially valuable on teardown day when everything is greasy and unlabeled.",
          "Document the report: share a 7-day link with your parts desk or attach a PDF printout to the estimate file."
        ]
      },
      {
        heading: "Reducing comebacks",
        paragraphs: [
          "Pair AI identification with a quick physical check: bushing orientation, connector pin count, spline count, and bracket holes. Mismatches caught at the bench are cheaper than mismatches caught after delivery."
        ]
      }
    ]
  },
  {
    slug: "collision-parts-research",
    title: "Collision Parts Research: Faster Supplement Support",
    description:
      "How estimators use photo-based identification to document damaged components and related parts for US collision workflows.",
    publishedAt: "2026-05-20",
    readMinutes: 5,
    category: "Collision",
    coverImage: "/marketing/parts/headlight-sensor.png",
    coverAlt: "Headlight level sensor with linkage arm — typical collision-adjacent component for supplement documentation",
    sections: [
      {
        heading: "Speed on the lift",
        paragraphs: [
          "Supplements stall when identification stalls. A phone photo on the lift plus an AI report gives you part name, OEM-style code, and related components to inspect—useful language for conversations with adjusters and suppliers.",
          "PartFinder AI also notes estimated damage context when visible, helping you tell a coherent story on the file."
        ]
      },
      {
        heading: "Sharing with stakeholders",
        paragraphs: [
          "Generate a read-only share link (valid 7 days) for your parts vendor or internal reviewer. They see the same structured report without a login.",
          "For insurer-facing documentation, print the report to PDF from the share page and attach it to your workflow."
        ]
      },
      {
        heading: "Stay compliant",
        paragraphs: [
          "Always label AI output as preliminary research. Final authority remains OEM data, scanner tools, and shop standards. PartFinder AI does not replace professional judgment or safety inspection."
        ]
      }
    ]
  }
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
