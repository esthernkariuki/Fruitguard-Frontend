// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fruitguard-3b97d3adfdf5.herokuapp.com',
        port: '', // optional, leave empty for default
        pathname: '/media/**', // allows any path under /media
      },
    ],
  },
};