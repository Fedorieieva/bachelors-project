import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ["./src/styles"],
    silenceDeprecations: ['mixed-decls'],
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  webpack(config) {
    return config;
  },
};

export default nextConfig;