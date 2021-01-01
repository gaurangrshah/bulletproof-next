module.exports = {
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },
  images: {
    domains: ["cdn.jsdelivr.net", "magdeleine.co", "images.unsplash.com"],
  },
};
