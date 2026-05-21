export type MarketingImage = { src: string; alt: string };

export const MARKETING_IMAGES = {
  heroWorkshop: {
    src: "/marketing/hero-workshop-scan.jpg",
    alt: "Technician scanning an engine with a tablet for AI part identification"
  },
  brakePad: {
    src: "/marketing/part-brake-pad.jpg",
    alt: "Close-up of a ceramic brake pad for photo-based part identification"
  },
  engineScan: {
    src: "/marketing/part-engine-scan.jpg",
    alt: "Engine block with digital scan overlays for OEM reference lookup"
  },
  oilFilter: {
    src: "/marketing/part-oil-filter.jpg",
    alt: "Automotive oil filter — typical catalog component for shop counter lookup"
  },
  sparkPlug: {
    src: "/marketing/part-spark-plug.jpg",
    alt: "Iridium spark plug macro photo for precision parts research"
  },
  logistics: {
    src: "/marketing/logistics-hub.jpg",
    alt: "Automotive parts logistics facility with AI-driven inventory context"
  },
  aiViz: {
    src: "/marketing/ai-visualization.jpg",
    alt: "Abstract visualization of neural network data flow for vision AI analysis"
  }
} as const satisfies Record<string, MarketingImage>;

export const PART_GALLERY = [
  MARKETING_IMAGES.brakePad,
  MARKETING_IMAGES.engineScan,
  MARKETING_IMAGES.oilFilter,
  MARKETING_IMAGES.sparkPlug
] as const;
