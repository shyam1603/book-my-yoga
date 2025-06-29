/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
               
            },
            {
                protocol: 'https',
                hostname: 'cdn.pixabay.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'www.gravatar.com',
            },
            {
                protocol: "https",
                hostname: "randomuser.me",
            }
        ]
    }
};

export default nextConfig;
