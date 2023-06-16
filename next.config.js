/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, options) => {
        config.ignoreWarnings = [
          {
            // Add the regular expression for the warning message you want to ignore
            message: /Some warning message/,
          },
        ];
    
        return config;
      },
}

module.exports = nextConfig
