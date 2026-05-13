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
  // Vercel/CI can differ slightly on ESLint plugins; deploy should not block on lint alone.
  eslint: {
    ignoreDuringBuilds: true
  },
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
