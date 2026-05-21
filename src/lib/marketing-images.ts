export type MarketingImage = {
  src: string;
  alt: string;
  label?: string;
  /** Scene/lifestyle photos use cover; catalog shots use contain (default). */
  fit?: "contain" | "cover";
};

/** Real catalog-style part photos (white-background product shots). */
export const REAL_PARTS = {
  fuelInjector: {
    src: "/marketing/parts/fuel-injector.png",
    alt: "Gasoline direct-injection fuel injector with electrical connector",
    label: "Fuel injector"
  },
  acEvaporator: {
    src: "/marketing/parts/ac-evaporator.png",
    alt: "Air conditioning evaporator core with receiver-drier",
    label: "A/C evaporator"
  },
  brakePadKit: {
    src: "/marketing/parts/brake-pad-kit.png",
    alt: "Disc brake pad set with hardware and lubricant",
    label: "Brake pads"
  },
  cvJointKit: {
    src: "/marketing/parts/cv-joint-kit.png",
    alt: "CV joint repair kit with boot, joint, grease, and clamps",
    label: "CV joint kit"
  },
  brakePadsStack: {
    src: "/marketing/parts/brake-pads-stack.png",
    alt: "Stack of four disc brake pads with friction material",
    label: "Brake pads"
  },
  cvBootKit: {
    src: "/marketing/parts/cv-boot-kit.png",
    alt: "CV axle boot kit with clamp and retaining wire",
    label: "CV boot"
  },
  carBattery: {
    src: "/marketing/parts/car-battery.png",
    alt: "Automotive AGM starting and cycling battery",
    label: "Battery"
  },
  headlightSensor: {
    src: "/marketing/parts/headlight-sensor.png",
    alt: "Headlight or ride-height level sensor with linkage arm",
    label: "Level sensor"
  },
  blowerMotor: {
    src: "/marketing/parts/blower-motor.png",
    alt: "HVAC blower motor assembly with squirrel-cage fan",
    label: "Blower motor"
  }
} as const satisfies Record<string, MarketingImage>;

/** Site section assignments (all real product photography). */
export const MARKETING_IMAGES = {
  capturePart: {
    src: "/marketing/capture-part-phone.png",
    alt: "Driver photographing front-end collision damage with a smartphone at the roadside",
    fit: "cover"
  },
  runAnalyzer: {
    src: "/marketing/run-analyzer-dashboard.png",
    alt: "PartFinder AI dashboard with upload fields, Identify part action, and usage stats",
    fit: "cover"
  },
  verifyPurchase: {
    src: "/marketing/verify-purchase-report.png",
    alt: "PartFinder AI identification report with OEM code, damage notes, related parts, and retailer listings",
    fit: "cover"
  },
  hero: REAL_PARTS.brakePadKit,
  brakePad: REAL_PARTS.brakePadsStack,
  fuelSystem: REAL_PARTS.fuelInjector,
  hvac: REAL_PARTS.acEvaporator,
  drivetrain: REAL_PARTS.cvJointKit,
  electrical: REAL_PARTS.carBattery,
  sensor: REAL_PARTS.headlightSensor,
  climate: REAL_PARTS.blowerMotor,
  suspension: REAL_PARTS.cvBootKit
} as const;

/** Landing gallery — watermark-free product shots only. */
export const PART_GALLERY: readonly MarketingImage[] = [
  REAL_PARTS.fuelInjector,
  REAL_PARTS.carBattery,
  REAL_PARTS.headlightSensor
];
