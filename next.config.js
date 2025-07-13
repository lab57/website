/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Add this section to configure custom headers
    async headers() {
        return [
            {
                // Apply these headers to all routes in the /WASM_Lorenz path
                source: '/WASM_Lorenz/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*', // Allows any origin to access the resource
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, OPTIONS', // Specifies allowed methods
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type', // Specifies allowed headers
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;