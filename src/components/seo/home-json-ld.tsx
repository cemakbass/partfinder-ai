import { absoluteUrl, getSiteUrl, SITE_NAME } from "@/lib/seo";
import { PLAN_CONFIG } from "@/lib/plans";

const faqs = [
  {
    question: "How do I find an OEM part number from a photo?",
    answer:
      "Upload a clear, well-lit photo of the part in PartFinder AI. The vision model reads shape, castings, and labels, then returns a suggested part name, OEM-style reference code, and fitment hints you can verify with your VIN or parts counter."
  },
  {
    question: "Is PartFinder AI a substitute for a professional mechanic?",
    answer:
      "No. Results are research aids for DIYers, shops, and estimators in the United States. Always confirm fitment, torque specs, and safety-critical work with a qualified technician and OEM documentation."
  },
  {
    question: "Which US auto parts stores does PartFinder AI link to?",
    answer:
      "Reports include shortcuts to major US retailers such as Amazon, RockAuto, AutoZone, and O'Reilly Auto Parts. Inventory and pricing change constantly—verify on each retailer's website before purchasing."
  },
  {
    question: "What photo works best for car part identification?",
    answer:
      "Use daylight or shop lighting, keep the part in focus, and fill most of the frame. Include stampings, stickers, or barcodes when visible. Adding year, make, and model in the dashboard improves fitment accuracy."
  },
  {
    question: "Can body shops and collision estimators use PartFinder AI?",
    answer:
      "Yes. Shops use it to speed up front-end research on damaged components, document related parts to inspect, and share structured summaries with suppliers or insurers. Paid plans scale monthly identification volume."
  }
];

export function HomeJsonLd() {
  const siteUrl = getSiteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    description:
      "AI-powered automotive part identification for the US market—photo to OEM codes, fitment, and retailer links.",
    areaServed: { "@type": "Country", name: "United States" }
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: "en-US",
    description: "Identify car parts from photos with AI for drivers and repair shops in the USA."
  };

  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: `Free tier includes ${PLAN_CONFIG.free.searchLimit} identifications per month`
    },
    areaServed: "US",
    url: siteUrl
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer }
    }))
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Car Part Identification by Photo — United States",
    url: absoluteUrl("/"),
    description:
      "PartFinder AI helps US drivers and repair professionals identify automotive parts from photos with OEM-style codes and fitment hints.",
    isPartOf: { "@type": "WebSite", url: siteUrl },
    about: {
      "@type": "Thing",
      name: "Automotive parts identification"
    }
  };

  const schemas = [organization, webSite, softwareApp, faqPage, webPage];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

export { faqs as homeFaqs };
