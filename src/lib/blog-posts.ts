export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readMinutes: number;
  /** Short label for card chips (Stitch-style category) */
  category: string;
  coverImage: string;
  sections: { heading: string; paragraphs: string[] }[];
};

/** Stitch / blog hero imagery (hosted on Google CDN). */
export const BLOG_IMAGES = {
  featured:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBqcsg5B8CRb1umbi5-YYvOpPULVqnWqWCpGitU3w8ibZHshwAJLtgQ_4EnXtIgE3I_GcD93XuaZxaX0sCMgOrk_5H5UMFsO9RaUEbGSN1Z_NW3JuOdc5lfxP-r7Ayq7B4UaRK9nOQQDBTm_joYXaMzrYFF2iiM94NTnQBCFz07emCWp9_AKrb5mxka1KsjF7MXY_oCeSniT_Hfta4zdUXNWNnZVFqqhMVlXo9B1EoXbVUOc3nOmBHBFVcOJPdn73q2t9v6_t4eICn-",
  engine:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCXLDTYavDw7uBONF23rKCuby37HSRBd5rfStWl6gOB2uuMCMAmssevhMvqta9hG2L7Qscqp6tbDr2c1y5uwC6HY8laB8zBayZ2RPZgaOVOCI9PBZBf_e_Jdpk8EmeLhWfgoy23sXpEjj6E2eD0JCTtR2Gv4IBYmYhDSRFk2jMMir8aNkzVOAozr1Qpuzcd4uC80aR1wFW4OmWd4tK4JJsFFtdQNxpc4XnSEJJvfGMiJ2Pl313PEPIKGR8liin8WIuIAdmAxzklNTuR",
  workshop:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDdVG1mIHFJkSUkWppOsl0jHx6PEY1gK4kct-eM_x8XllhgUj5seeleLkZTDiWy4rKUwzhj4spA4eCaWGolY20d-bBW-fai0iCaY8TuPKoGeaPqsQmXfT1VXsydfKWs0dtUEexjVz37um5nqMJ23JsC99MCejlgXYZ7U0fm1wsIEZ6Q_iPDTt8ALyoPD9Baqd4uEWYyxtF6lMms4oLLvjjj8vfstk7m6QoEbuAfiXQH_atR8QzMqNDqsbaf7uCgW3QPJZelnA9MGKQz",
  server:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB7oiEBl6ZXx3NWgMGU04gK8p6O-qCGeBozYqbRZwe3wzq8dwzZSVsO1YKFCnEzjJ9QdVAlp0QcS11Z8wc8pUzvMHPcp-Omls85uipBlaVFd7m5-Mx7qBfYqTEYDQIVvfwxemsvLfuHs-7VJgKKUVQ4Z8K_DmWte71CQ8H-Y4V69XD-srgWCd0r1HiRZT6Y5PHv1HarbBgu9CovwjU5aEc0197gLch_2DvXonpRhtcyoHwc4EglN1FLUOt5bAG3TugzupwYA5dSsDPO"
} as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "identify-car-part-by-photo",
    title: "How to Identify a Car Part by Photo (US Guide)",
    description:
      "Step-by-step workflow for DIYers and shops: what to photograph, how OEM lookup works, and when to trust AI part identification.",
    publishedAt: "2026-05-20",
    readMinutes: 6,
    category: "Identification",
    coverImage: BLOG_IMAGES.featured,
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
    coverImage: BLOG_IMAGES.engine,
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
    coverImage: BLOG_IMAGES.workshop,
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
