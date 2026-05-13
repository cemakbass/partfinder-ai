/** @type {import('next').NextConfig} */
function supabaseStorageHostname() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw?.trim()) return null;
  try {
    return new URL(raw.trim()).hostname;
  } catch {
    return null;
  }
}

const supabaseHost = supabaseStorageHostname();

const nextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**"
          }
        ]
      : []
  }
};

export default nextConfig;
