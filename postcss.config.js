module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Enable cssnano in production for CSS minification
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          colormin: true,
          minifyFontValues: true,
          minifySelectors: true,
        }]
      }
    } : {})
  },
}
