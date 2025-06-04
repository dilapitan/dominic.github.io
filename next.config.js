/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
    images: {
        domains: [
            'images.unsplash.com',
            'firebasestorage.googleapis.com'
        ],
        unoptimized: true,
    },
    trailingSlash: true,
};

module.exports = nextConfig;