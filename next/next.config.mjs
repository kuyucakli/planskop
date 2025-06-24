/** @type {import('next').NextConfig} */

const nextConfig = {
  turbopack: {
    // Example: adding an alias and custom file extension
    resolveAlias: {
      underscore: "lodash",
    },
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  images: {
    remotePatterns: [new URL("https://res.cloudinary.com/**")],
  },
};

export default nextConfig;
